import { Injectable } from '@nestjs/common';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { In } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { User } from '../../../auth/entities/user.entity';
import { AdminRepository } from '../../../auth/repositories/admin.repository';
import {
  BadRequestExc,
  ExpectationFailedExc,
  NotFoundExc,
} from '../../../common/exceptions/custom.exception';
import { NewsRepository } from '../../../news/repositories/news.repository';
import {
  CreateSubjectAdminReqDto,
  DeleteSubjectsAdminReqDto,
  GetListSubjectAdminReqDto,
  UpdateSubjectAdminReqDto,
} from '../../dtos/admin/req/subject.admin.req.dto';
import { SubjectResDto } from '../../dtos/common/res/subject.res.dto';
import { Subject } from '../../entities/subject.entity';
import { SubjectRepository } from '../../repositories/subject.repository';
import { SubjectDetailAdminService } from './subject-detail.admin.service';

@Injectable()
export class SubjectAdminService {
  constructor(
    private readonly subjectRepo: SubjectRepository,
    private readonly subjectDetailService: SubjectDetailAdminService,
    private newsRepo: NewsRepository,
    private adminRepo: AdminRepository,
  ) {}

  async getList(dto: GetListSubjectAdminReqDto) {
    const { limit, page } = dto;

    const qb = this.subjectRepo
      .createQueryBuilder('subject')
      // .leftJoinAndSelect('subject.subjectDetails', 'subjectDetail')
      .orderBy('subject.priority', 'ASC')
      .addOrderBy('subject.createdAt', 'DESC')
      .groupBy('subject.id')
      .select('subject.id');

    const { items, meta } = await paginate(qb, { limit, page });

    const subjects = await this.subjectRepo.find({
      where: { id: In(items.map((item) => item.id)) },
      relations: {
        subjectDetails: true,
      },
    });

    const mapSubjectIdToSubjects: Record<string, Subject> = {};

    for (const subject of subjects) {
      mapSubjectIdToSubjects[subject.id] = subject;
    }

    const result = items.map((item) =>
      SubjectResDto.forAdmin({ data: mapSubjectIdToSubjects[item.id] }),
    );

    return new Pagination(result, meta);
  }

  async getOne(id: number) {
    const subject = await this.subjectRepo.findOneOrThrowNotFoundExc({
      where: { id: id },
      relations: {
        subjectDetails: true,
        newsToSubjects: true,
      },
    });

    return SubjectResDto.forAdmin({ data: subject });
  }

  @Transactional()
  async create(user: User, dto: CreateSubjectAdminReqDto) {
    const { subjectDetails, priority } = dto;

    //create subject
    const subject = this.subjectRepo.create({
      owner: user,
      priority: priority,
    });

    const createdSubject = await this.subjectRepo.save(subject);
    const existedIds = await this.getSubjectIds();
    //create subject Detail
    await this.subjectDetailService.createMultiSubjectDetail(
      subjectDetails,
      createdSubject.id,
      existedIds,
    );

    return subject; //await this.getOne(createdSubject.id);
  }

  @Transactional()
  async update(updateSubjectDto: UpdateSubjectAdminReqDto) {
    const { id, priority } = updateSubjectDto;

    const existedSubject = await this.subjectRepo.findOneOrThrowNotFoundExc({
      where: { id },
      relations: { subjectDetails: true },
    });

    //Update subject
    if (priority) await this.subjectRepo.update({ id }, { priority });

    //Check Subject Details
    if (
      existedSubject.subjectDetails.length === 0 &&
      updateSubjectDto.subjectDetails.length === 0
    )
      throw new BadRequestExc({ message: 'common.exc.badRequest' });

    //update subject Detail
    await this.subjectDetailService.updateSubjectDetail(
      updateSubjectDto.subjectDetails,
      updateSubjectDto.id,
    );

    return await this.getOne(updateSubjectDto.id);
  }

  @Transactional()
  async deleteSingle(id: number) {
    const canBeDeleted = await this.checkSubjectCanBeDeleted(id);

    if (!canBeDeleted)
      throw new ExpectationFailedExc({
        message: 'common.exc.badRequest',
        params: { id },
      });

    const subject = await this.subjectRepo.findOneOrThrowNotFoundExc({
      where: { id },
    });
    const { affected } = await this.subjectRepo.softDelete({
      id,
    });

    if (!affected) throw new NotFoundExc({ message: 'common.exc.notFound' });
    // delete subject detail
    const subjectDetailIds =
      await this.subjectDetailService.getSubjectDetailIds(subject);
    await this.subjectDetailService.deleteMulti(subjectDetailIds, id);
  }

  @Transactional()
  async deleteMultiples(dto: DeleteSubjectsAdminReqDto) {
    const { ids } = dto;

    for (const id of ids) {
      const subject = await this.subjectRepo.findOneOrThrowNotFoundExc({
        where: { id },
      });
      const canBeDeleted = await this.checkSubjectCanBeDeleted(id);

      if (!canBeDeleted)
        throw new ExpectationFailedExc({
          message: 'common.exc.badRequest',
          params: { id },
        });
      const subjectDetailIds =
        await this.subjectDetailService.getSubjectDetailIds(subject);
      await this.subjectDetailService.deleteMulti(subjectDetailIds, id);
    }

    const { affected } = await this.subjectRepo.softDelete({
      id: In(ids),
    });
    if (affected !== ids.length)
      throw new NotFoundExc({ message: 'common.exc.notFound' });
  }

  async checkSubjectCanBeDeleted(subjectId: number) {
    const isExisted = await this.newsRepo.findFirst({
      where: { newsToSubjects: { subjectId: subjectId } },
    });

    if (isExisted) return false;
    return true;
  }

  async getSubjectIds() {
    const existedSubject = await this.subjectRepo.find();

    return existedSubject.map((subject) => subject.id);
  }
}

import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { In } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import {
  ConflictExc,
  NotFoundExc,
} from '../../../common/exceptions/custom.exception';
import {
  CreateSubjectDetailAdminReqDto,
  UpdateSubjectDetailAdminReqDto,
} from '../../dtos/admin/req/subject-detail.admin.req.dto';
import { SubjectDetailResDto } from '../../dtos/common/res/subject-detail.res.dto';
import { SubjectDetail } from '../../entities/subject-detail.entity';
import { Subject } from '../../entities/subject.entity';
import { SubjectDetailRepository } from '../../repositories/subject-detail.repository';

@Injectable()
export class SubjectDetailAdminService {
  constructor(private subjectDetailRepo: SubjectDetailRepository) {}

  @Transactional()
  async createMultiSubjectDetail(
    createSubjectDetailReqDtos: CreateSubjectDetailAdminReqDto[],
    subjectId: number,
    existedIds: number[],
  ) {
    const subjectDetails = await Promise.all(
      createSubjectDetailReqDtos.map(async (createSubjectDetailReqDto) => {
        const isExisted = await this.subjectDetailRepo.findOne({
          where: {
            subjectId: In(existedIds),
            lang: createSubjectDetailReqDto.lang,
            name: createSubjectDetailReqDto.name,
          },
        });

        if (isExisted) {
          throw new ConflictExc({ message: 'subject.isExisted' });
        }

        return this.subjectDetailRepo.create({
          ...createSubjectDetailReqDto,
          slug: slugify(createSubjectDetailReqDto.name, {
            locale: 'vi',
          }),
          subjectId,
        });
      }),
    );

    await this.subjectDetailRepo.save(subjectDetails);

    return subjectDetails.map((subjectDetail) => {
      return SubjectDetailResDto.forAdmin({ data: subjectDetail });
    });
  }

  @Transactional()
  async updateSubjectDetail(
    createOrUpdateSubjectDetailDto: UpdateSubjectDetailAdminReqDto[],
    subjectId: number,
  ) {
    const updateSubjectDetails = createOrUpdateSubjectDetailDto.map(
      (subjectDetail) => {
        if (!subjectDetail.id)
          throw new NotFoundExc({ message: 'subject.notFoundSubjectDetail' });

        this.subjectDetailRepo.update(subjectDetail.id, {
          ...subjectDetail,
          slug: slugify(subjectDetail.name, {
            locale: 'vi',
          }),
        });
      },
    );
  }

  @Transactional()
  async delete(id: number) {
    const { affected } = await this.subjectDetailRepo.softDelete(id);

    if (!affected) throw new NotFoundExc({ message: 'common.exc.notFound' });
  }

  @Transactional()
  async deleteMulti(ids: number[], subjectId: number) {
    const { affected } = await this.subjectDetailRepo
      .createQueryBuilder()
      .softDelete()
      .from(SubjectDetail)
      .whereInIds(ids)
      .andWhere({ subjectId })
      .execute();

    if (!affected) throw new NotFoundExc({ message: 'common.exc.notFound' });
  }

  async getSubjectDetailIds(subject: Subject) {
    const subjectDetails = await this.subjectDetailRepo.find({
      where: { subjectId: subject.id },
    });
    return subjectDetails.map((subjectDetail) => subjectDetail.id);
  }
}

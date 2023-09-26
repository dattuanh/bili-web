import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import {
  ConflictExc,
  NotFoundExc,
} from '../../../common/exceptions/custom.exception';
import { SubjectDetailResDto } from '../../dtos/common/res/subject-detail.res.dto';
import {
  CreateSubjectDetailAdminReqDto,
  UpdateSubjectDetailAdminReqDto,
} from '../../dtos/admin/req/subject-detail.admin.req.dto';
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
            id: In(existedIds),
            lang: createSubjectDetailReqDto.lang,
            name: createSubjectDetailReqDto.name,
          },
        });

        if (isExisted) {
          throw new ConflictExc({ message: 'subject.isExisted' });
        }
        return this.subjectDetailRepo.create({
          ...createSubjectDetailReqDto,
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
  async createOrUpdateSubjectDetail(
    createOrUpdateSubjectDetailDto: UpdateSubjectDetailAdminReqDto[],
    subjectId: number,
  ) {
    const updateSubjectDetails = createOrUpdateSubjectDetailDto.map(
      (subjectDetail) => {
        if (!subjectDetail.id)
          return this.subjectDetailRepo.create({
            ...subjectDetail,
            subjectId,
          });
        return subjectDetail;
      },
    );

    const updatedSubjectDetails = await this.subjectDetailRepo.save(
      updateSubjectDetails,
    );

    return updatedSubjectDetails.map((subjectDetail) =>
      SubjectDetailResDto.forAdmin({ data: subjectDetail }),
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

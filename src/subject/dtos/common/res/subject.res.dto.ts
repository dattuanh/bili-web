import { BaseResponseDtoParams } from '../../../../common/dtos/base.res';
import { NewsToSubjectResDto } from '../../../../news/dtos/common/res/news-to-subject.res.dto';
import { Subject } from '../../../entities/subject.entity';
import { SubjectDetailResDto } from './subject-detail.res.dto';

export interface SubjectResDtoParams extends BaseResponseDtoParams {
  data: Subject;
}

export class SubjectResDto {
  id: number;
  priority: number;
  subjectDetails: SubjectDetailResDto[];
  newsToSubject: NewsToSubjectResDto[];

  static mapProperty(dto: SubjectResDto, { data }: SubjectResDtoParams) {
    dto.id = data.id;
    dto.priority = data.priority;
  }

  static forCustomer(params: SubjectResDtoParams) {
    const { data, resOpts } = params;

    if (!data) return null;
    const result = new SubjectResDto();

    this.mapProperty(result, params);

    result.subjectDetails = data.subjectDetails
      ?.map((subjectDetail) => {
        return SubjectDetailResDto.forCustomer({ data: subjectDetail });
      })
      .filter(Boolean);

    result.newsToSubject = data.newsToSubjects
      ?.map((news) => {
        return NewsToSubjectResDto.forCustomer({ data: news });
      })
      .filter(Boolean);

    return result;
  }

  static forAdmin(params: SubjectResDtoParams) {
    const { data, resOpts } = params;

    if (!data) return null;
    const result = new SubjectResDto();

    this.mapProperty(result, params);

    result.subjectDetails = data.subjectDetails
      ?.map((subjectDetail) => {
        return SubjectDetailResDto.forAdmin({
          data: subjectDetail,
          resOpts,
        });
      })
      .filter(Boolean);

    return result;
  }

}

import { BaseResponseDtoParams } from '../../../../common/dtos/base.res';
import { NewsToSubject } from '../../../entities/news-to-subject.entity';
import { NewsResDto } from './news.admin.res.dto';

export interface NewsToSubjectResDtoParams extends BaseResponseDtoParams {
  data: NewsToSubject;
}

export class NewsToSubjectResDto {
  id: number;
  news: NewsResDto;
  static mapProperty(
    dto: NewsToSubjectResDto,
    { data }: NewsToSubjectResDtoParams,
  ) {
    dto.id = data.id;
  }

  static forCustomer(params: NewsToSubjectResDtoParams) {
    const { data, resOpts } = params;

    const result = new NewsToSubjectResDto();
    if (!data) return null;

    result.news = NewsResDto.forCustomer({
      data: data.news,
      resOpts,
    });

    this.mapProperty(result, params);

    return result;
  }

  static forAdmin(params: NewsToSubjectResDtoParams) {
    const { data, resOpts } = params;

    if (!data) return null;
    const result = new NewsToSubjectResDto();

    this.mapProperty(result, params);

    return result;
  }
}

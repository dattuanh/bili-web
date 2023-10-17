import { BaseResponseDtoParams } from '../../../../common/dtos/base.res';
import { Language } from '../../../../common/enums/lang.enum';
import { NewsDetail } from '../../../entities/news-detail.entity';

export interface NewsDetailResDtoParams extends BaseResponseDtoParams {
  data: NewsDetail;
}

export class NewsDetailResDto {
  id: number;
  lang: Language;
  content: string;
  description: string;
  author: string;

  static mapProperty(dto: NewsDetailResDto, { data }: NewsDetailResDtoParams) {
    dto.id = data.id;
    dto.lang = data.lang;
    dto.content = data.content;
    dto.description = data.description;
    dto.author = data.author;
  }

  static forCustomer(params: NewsDetailResDtoParams) {
    const { data, resOpts } = params;

    const result = new NewsDetailResDto();
    if (!data) return null;

    this.mapProperty(result, params);

    return result;
  }

  static forAdmin(params: NewsDetailResDtoParams) {
    const { data, resOpts } = params;

    if (!data) return null;
    const result = new NewsDetailResDto();

    this.mapProperty(result, params);

    result.content = data.content;

    return result;
  }
}

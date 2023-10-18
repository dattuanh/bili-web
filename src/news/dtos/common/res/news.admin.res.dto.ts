import { BaseResponseDtoParams } from '../../../../common/dtos/base.res';
import { FileResDto } from '../../../../file/dtos/common/res/file.res.dto';
import { SubjectResDto } from '../../../../subject/dtos/common/res/subject.res.dto';
import { Subject } from '../../../../subject/entities/subject.entity';
import { News } from '../../../entities/news.entity';
import { NewsStatus } from '../../../enums/news.enum';
import { NewsDetailResDto } from './news-detail.res.dto';

export interface NewsResDtoParams extends BaseResponseDtoParams {
  data: News;
  subjects?: Subject[];
}

export class NewsResDto {
  id: number;
  title: string;
  status: NewsStatus;
  newsDetails: NewsDetailResDto[];
  thumbnail: FileResDto;
  subject: SubjectResDto[];
  createdAt: Date;
  updatedAt: Date;

  static mapProperty(dto: NewsResDto, { data }: NewsResDtoParams) {
    dto.id = data.id;
    dto.title = data.title;
    dto.updatedAt = data.updatedAt;
  }

  static forCustomer(params: NewsResDtoParams) {
    const { data, resOpts, subjects } = params;

    if (!data) return null;
    const result = new NewsResDto();

    result.createdAt = data.createdAt;

    this.mapProperty(result, params);

    result.subject = subjects
      ?.map((item) =>
        SubjectResDto.forAdmin({
          data: item,
          resOpts,
        }),
      )
      .filter(Boolean);

    result.thumbnail = FileResDto.forCustomer({
      data: data.newsToFile?.thumbnail,
      resOpts,
    });

    result.newsDetails = data.newsDetails
      ?.map((NewsDetail) => {
        return NewsDetailResDto.forCustomer({ data: NewsDetail });
      })
      .filter(Boolean);

    return result;
  }

  static forAdmin(params: NewsResDtoParams) {
    const { data, resOpts, subjects } = params;
    if (!data) return null;
    const result = new NewsResDto();

    this.mapProperty(result, params);

    result.status = data.status;
    result.createdAt = data.createdAt;

    result.thumbnail = FileResDto.forAdmin({
      data: data.newsToFile?.thumbnail,
      resOpts,
    });

    result.subject = subjects
      ?.map((item) =>
        SubjectResDto.forAdmin({
          data: item,
          resOpts,
        }),
      )
      .filter(Boolean);

    result.newsDetails = data.newsDetails
      ?.map((NewsDetail) => {
        return NewsDetailResDto.forAdmin({
          data: NewsDetail,
          resOpts,
        });
      })
      .filter(Boolean);

    return result;
  }
}

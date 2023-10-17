import { BaseResponseDtoParams } from '../../../../common/dtos/base.res';
import { FileResDto } from '../../../../file/dtos/common/res/file.res.dto';
import { File } from '../../../../file/entities/file.entity';
import { SubjectResDto } from '../../../../subject/dtos/common/res/subject.res.dto';
import { SubjectDetail } from '../../../../subject/entities/subject-detail.entity';
import { Subject } from '../../../../subject/entities/subject.entity';
import { NewsDetail } from '../../../entities/news-detail.entity';
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

  static forPagination(news, detailJson, subjectsJson) {
    const result = new NewsResDto();

    const detailArray = JSON.parse(`[${detailJson}]`);
    const subjectArray = JSON.parse(`[${subjectsJson}]`);

    const subjects = subjectArray.map((subjectJson) => {
      const subject = new Subject();
      const subjectDetail = new SubjectDetail();

      subject.id = subjectJson.id;
      subject.priority = subjectJson.priority;

      subjectDetail.id = subjectJson.subject_detail_id;
      subjectDetail.lang = subjectJson.lang;
      subjectDetail.name = subjectJson.name;

      subject.subjectDetails = [subjectDetail];

      return subject;
    });

    const newsDetails = detailArray.map((detail) => {
      const newsDetail = new NewsDetail();

      newsDetail.id = detail.id;
      newsDetail.lang = detail.lang;
      newsDetail.content = detail.content;
      newsDetail.description = detail.description;
      newsDetail.author = detail.author;

      return newsDetail;
    });

    const fileDetail = new File();

    fileDetail.id = news.thumbid;
    fileDetail.key = news.thumbkey;
    fileDetail.type = news.thumbtype;
    fileDetail.size = news.thumbsize;
    fileDetail.uploaderId = news.thumbuploader;

    this.mapProperty(result, { data: news });

    result.status = news.status;
    result.createdAt = news.createdAt;

    result.thumbnail = FileResDto.forAdmin({
      data: fileDetail,
    });

    result.subject = subjects
      ?.map((item) =>
        SubjectResDto.forAdmin({
          data: item,
        }),
      )
      .filter(Boolean);

    result.newsDetails = newsDetails
      ?.map((NewsDetail) => {
        return NewsDetailResDto.forAdmin({
          data: NewsDetail,
        });
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

import { BaseResponseDtoParams } from '../../../../common/dtos/base.res';
import { FileResDto } from '../../../../file/dtos/common/res/file.res.dto';
import { File } from '../../../../file/entities/file.entity';
import { NewsToSubjectResDto } from '../../../../news/dtos/common/res/news-to-subject.res.dto';
import { NewsDetail } from '../../../../news/entities/news-detail.entity';
import { NewsToFile } from '../../../../news/entities/news-to-file.entity';
import { NewsToSubject } from '../../../../news/entities/news-to-subject.entity';
import { News } from '../../../../news/entities/news.entity';
import { SubjectDetail } from '../../../entities/subject-detail.entity';
import { Subject } from '../../../entities/subject.entity';
import { SubjectDetailResDto } from './subject-detail.res.dto';

export interface SubjectResDtoParams extends BaseResponseDtoParams {
  data: Subject;
}

export class SubjectResDto {
  id: number;
  priority: number;
  thumbnail: FileResDto;
  subjectDetails: SubjectDetailResDto[];
  newsToSubject: NewsToSubjectResDto[];

  static mapProperty(dto: SubjectResDto, { data }: SubjectResDtoParams) {
    dto.id = data.id;
    dto.priority = data.priority;
  }

  static forCustomer(subject, length) {
    const subjectWithRelation = [];
    let subjectDetailList;
    let newsToSubjectList;
    let check = true;
    let result;

    for (let i = 0; i < length; i++) {
      if (check === true) {
        // create new Subject
        result = new SubjectResDto();
        subjectDetailList = [];
        newsToSubjectList = [];

        const newSubject = new Subject();
        newSubject.id = subject[i].subject_id;
        newSubject.priority = subject[i].subject_priority;
        this.mapProperty(result, { data: newSubject });

        const subjectDetail = new SubjectDetail();
        subjectDetail.id = subject[i].subject_detail_id;
        subjectDetail.name = subject[i].subject_detail_name;
        subjectDetail.lang = subject[i].subject_detail_lang;

        subjectDetailList.push(subjectDetail);
        check = false;
      }

      // map relation
      const news = new News();
      news.id = subject[i].news_id;
      news.title = subject[i].title;
      news.createdAt = subject[i].created_at;

      const newsDetail = new NewsDetail();
      newsDetail.id = subject[i].news_detail_id;
      newsDetail.author = subject[i].news_detail_author;
      newsDetail.lang = subject[i].news_detail_lang;
      newsDetail.description = subject[i].news_detail_description;
      news.newsDetails = [newsDetail];

      const thumbnail = new File();
      thumbnail.id = subject[i].file_id;
      thumbnail.key = subject[i].file_key;
      thumbnail.url = subject[i].file_url;
      thumbnail.type = subject[i].file_type;
      thumbnail.size = subject[i].file_size;

      const newsToFile = new NewsToFile();
      newsToFile.id = subject[i].news_to_file_id;

      news.newsToFile = newsToFile;
      news.newsToFile.thumbnail = thumbnail;

      const newsToSubject = new NewsToSubject();
      newsToSubject.id = subject[i].news_to_subject_id;
      newsToSubject.news = news;

      newsToSubjectList.push(newsToSubject);

      // check same id to change to new subject to add relation
      if (
        i === length - 1 ||
        subject[i].subject_id !== subject[i + 1].subject_id
      ) {
        result.subjectDetails = subjectDetailList
          .map((detail) => {
            return SubjectDetailResDto.forCustomer({ data: detail });
          })
          .filter(Boolean);

        result.newsToSubject = newsToSubjectList
          .map((newsToSub) => {
            return NewsToSubjectResDto.forCustomer({ data: newsToSub });
          })
          .filter(Boolean);

        subjectWithRelation.push(result);
        check = true;
      }
    }
    return subjectWithRelation;
  }

  static forAdmin(params: SubjectResDtoParams) {
    const { data, resOpts } = params;

    if (!data) return null;
    const result = new SubjectResDto();

    this.mapProperty(result, params);

    result.thumbnail = FileResDto.forCustomer({
      data: data.thumbnail,
      resOpts,
    });

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

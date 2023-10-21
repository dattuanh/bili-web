import { Injectable } from '@nestjs/common';
import { dataSource } from '../../../../data-source';
import { Language } from '../../../common/enums/lang.enum';
import { NewsStatus } from '../../../news/enums/news.enum';
import { NewsRepository } from '../../../news/repositories/news.repository';
import { GetListSubjectReqDto } from '../../dtos/common/req/subject.req.dto';
import { SubjectResDto } from '../../dtos/common/res/subject.res.dto';
import { SubjectRepository } from '../../repositories/subject.repository';

@Injectable()
export class SubjectService {
  constructor(
    private readonly subjectRepo: SubjectRepository,
    private newsRepo: NewsRepository,
  ) {}

  async getListCommonTable(dto: GetListSubjectReqDto) {
    const { numberOfSubject, newsCountPerSubject } = dto;
    const subjectPriority = 1;

    const subject_cte = this.subjectRepo
      .createQueryBuilder('subject')
      .innerJoinAndSelect('subject.subjectDetails', 'subject_detail')
      .where('subject.priority = :numPriority', {
        numPriority: subjectPriority,
      })
      .andWhere('subject_detail.lang = :language', { language: Language.EN })
      .orderBy('subject.createdAt', 'DESC')
      .limit(numberOfSubject);

    const news_cte = this.newsRepo
      .createQueryBuilder('news')
      .select([
        'ROW_NUMBER() OVER (PARTITION BY news_to_subject.subject_id) AS rownum',
        '*',
      ])
      .innerJoinAndSelect('news.newsDetails', 'news_detail')
      .innerJoinAndSelect('news.newsToFile', 'news_to_file')
      .innerJoinAndSelect('news_to_file.thumbnail', 'file')
      .innerJoinAndSelect('news.newsToSubjects', 'news_to_subject')
      .innerJoinAndSelect(
        'subject_cte',
        'subject_cte',
        'subject_cte.subject_id = news_to_subject.subject_id',
      )
      .where('news_detail.lang = :language', { language: Language.EN })
      .andWhere('news.status = :status', { status: NewsStatus.ACTIVE });

    const qb = await dataSource
      .createQueryBuilder()
      .from('news_cte', 'news_cte')
      .addCommonTableExpression(subject_cte, 'subject_cte')
      .addCommonTableExpression(news_cte, 'news_cte')
      .where('news_cte.rownum <= :numOfNews', {
        numOfNews: newsCountPerSubject,
      })
      .orderBy('news_cte.news_to_subject_subject_id', 'DESC')
      .addOrderBy('news_cte.news_to_subject_news_id', 'DESC')
      .getRawMany();

    // return qb.getQuery();

    const subjectsWithCorrectOrder = SubjectResDto.forCustomer(qb, qb.length);

    return subjectsWithCorrectOrder;
  }

  async getListCommonTableVer2(dto: GetListSubjectReqDto) {
    const { numberOfSubject, newsCountPerSubject } = dto;
    const subjectPriority = 1;

    const subject_cte = this.subjectRepo
      .createQueryBuilder('subject')
      .innerJoinAndSelect('subject.subjectDetails', 'subject_detail')
      .where('subject.priority = :numPriority', {
        numPriority: subjectPriority,
      })
      .andWhere('subject_detail.lang = :language', { language: Language.EN })
      .orderBy('subject.createdAt', 'DESC')
      .limit(numberOfSubject);

    const news_subquery = this.newsRepo
      .createQueryBuilder('news')
      .innerJoinAndSelect('news.newsToSubjects', 'news_to_subject')
      .where('news_to_subject.subject_id = subject_cte.subject_id')
      .andWhere('news.status = :status', { status: NewsStatus.ACTIVE })
      .orderBy('news.createdAt', 'DESC')
      .limit(newsCountPerSubject)
      .getQuery();

    const qb = await dataSource
      .createQueryBuilder()
      .select(['subject_cte.*'])
      .from('subject_cte', 'subject_cte')
      .addCommonTableExpression(subject_cte, 'subject_cte')
      .innerJoinAndSelect(
        (query) => {
          query.getQuery = () => `LATERAL (${news_subquery})`;
          return query;
        },
        'getNewsForSubject',
        'true',
      )
      .innerJoinAndSelect(
        'news_detail',
        'news_detail',
        'news_detail.news_id = "getNewsForSubject".news_id',
      )
      .innerJoinAndSelect(
        'news_to_file',
        'news_to_file',
        'news_to_file.news_id = "getNewsForSubject".news_id',
      )
      .innerJoinAndSelect('news_to_file.thumbnail', 'file')
      .andWhere('news_detail.lang = :language', { language: Language.EN })
      .orderBy('subject_cte.subject_id')
      .getRawMany();

    // return qb.getQueryAndParameters();

    const subjectsWithCorrectOrder = SubjectResDto.forCustomer(qb, qb.length);

    return subjectsWithCorrectOrder;
  }
}

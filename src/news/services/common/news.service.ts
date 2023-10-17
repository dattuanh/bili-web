import { Injectable } from '@nestjs/common';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { GetListNewsBySubjectReqDto } from '../../../subject/dtos/common/req/subject.req.dto';
import { NewsResDto } from '../../dtos/common/res/news.admin.res.dto';
import { NewsStatus } from '../../enums/news.enum';
import { NewsDetailRepository } from '../../repositories/news-detail.repository';
import { NewsToSubjectRepository } from '../../repositories/news-to-subject.repository';
import { NewsRepository } from '../../repositories/news.repository';

@Injectable()
export class NewsService {
  constructor(
    private newsRepo: NewsRepository,
    private newsToSubjectRepo: NewsToSubjectRepository,
    private NewsDetailRepo: NewsDetailRepository,
  ) {}

  async getOne(slug: string) {
    const news = await this.newsRepo.findOneOrThrowNotFoundExc({
      where: {
        status: NewsStatus.ACTIVE,
        newsDetails: {
          slug: slug,
        },
      },
      relations: {
        newsDetails: true,
        newsToFile: { thumbnail: true },
      },
    });

    const newsToSubject = await this.newsToSubjectRepo.find({
      where: { newsId: news.id },
      relations: { subject: { subjectDetails: true } },
    });
    const subjects = newsToSubject.map((item) => item.subject);

    return NewsResDto.forCustomer({ data: news, subjects: subjects });
  }

  async getListNewsBySubjectSlug(
    slug: string,
    dto: GetListNewsBySubjectReqDto,
  ) {
    const { limit, page } = dto;

    const paginateById = this.newsRepo
      .createQueryBuilder('news')
      .innerJoin('news.newsToSubjects', 'newsToSubjects')
      .innerJoin('newsToSubjects.subject', 'subject')
      .innerJoin('subject.subjectDetails', 'subjectDetails')
      .where('subjectDetails.slug = :slug', { slug })
      .select('news.id')
      .orderBy('news.createdAt', 'DESC');

    const { items, meta } = await paginate(paginateById, { limit, page });

    const ids = items.map((item) => item.id);

    if (ids.length === 0) ids[0] = 0;

    const newsDetailSubQuery = await this.NewsDetailRepo.createQueryBuilder(
      'newsDetails',
    )
      .select('newsDetails.news_id')
      .addSelect(
        `
        string_agg(
          jsonb_build_object(
            'id', newsDetails.id,
            'lang', newsDetails.lang,
            'description', newsDetails.description,
            'author', newsDetails.author, 
            'content', newsDetails.content  
          )::text, ','
        )`,
        'detail',
      )
      .groupBy('newsDetails.news_id');

    const getNewsToSubject = await this.newsToSubjectRepo
      .createQueryBuilder('newsToSubjects')
      .innerJoin('newsToSubjects.subject', 'subject')
      .innerJoin('subject.subjectDetails', 'subjectDetails')
      .select('newsToSubjects.news_id')
      .addSelect(
        `
        string_agg(
          jsonb_build_object(
            'id', subject.id,
            'priority', subject.priority,
            'subject_detail_id', subjectDetails.id,
            'lang', subjectDetails.lang, 
            'name', subjectDetails.name  
          )::text, ','
        )`,
        'subjects',
      )
      .groupBy('newsToSubjects.news_id');

    const qb = await this.newsRepo
      .createQueryBuilder('news')
      .innerJoin('news.newsToFile', 'newsToFile')
      .innerJoin('newsToFile.thumbnail', 'thumbnail')
      .innerJoin(
        '(' + newsDetailSubQuery.getQuery() + ')',
        'newsDetail',
        'news.id = "newsDetail".news_id',
      )
      .innerJoin(
        '(' + getNewsToSubject.getQuery() + ')',
        'sub',
        'news.id = sub.news_id',
      )
      .select([
        'news.*',
        'subjects',
        'detail',
        'thumbnail.id as thumbid',
        'thumbnail.key as thumbkey',
        'thumbnail.type as thumbtype',
        'thumbnail.size as thumbsize',
        'thumbnail.uploader_id as thumbuploader',
      ])
      .where('news.status = :status', { status: NewsStatus.ACTIVE })
      .andWhere('news.id IN (:...ids)', { ids })
      .getRawMany();

    const news = [];

    for (let i = 0; i < ids.length; i++) {
      const newsItem = NewsResDto.forPagination(
        qb[i],
        qb[i].detail,
        qb[i].subjects,
      );
      news.push(newsItem);
    }

    return new Pagination(news, meta);
  }
}

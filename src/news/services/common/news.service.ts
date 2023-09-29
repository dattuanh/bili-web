import { Injectable } from '@nestjs/common';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { GetListNewsReqDto } from '../../dtos/common/req/news.req.dto';
import { NewsResDto } from '../../dtos/common/res/news.admin.res.dto';
import { NewsStatus } from '../../enums/news.enum';
import { NewsToSubjectRepository } from '../../repositories/news-to-subject.repository';
import { NewsRepository } from '../../repositories/news.repository';

@Injectable()
export class NewsService {
  constructor(
    private newsRepo: NewsRepository,
    private newsToSubjectRepo: NewsToSubjectRepository,
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
        newsToSubjects: { subject: { subjectDetails: true } },
      },
    });

    const newsToSubject = await this.newsToSubjectRepo.find({
      where: { newsId: news.id },
      relations: { subject: { subjectDetails: true } },
    });
    const subjects = newsToSubject.map((item) => item.subject);
    return NewsResDto.forCustomer({ data: news, subjects: subjects });
  }

  async getAll(dto: GetListNewsReqDto) {
    const { fromDate, limit, page, subjectIds, title, toDate, ids } = dto;
    const qb = this.newsRepo
      .createQueryBuilder('news')
      .innerJoin('news.newsDetails', 'newsDetails')
      .innerJoin('news.newsToFile', 'newsToFile')
      .innerJoin('newsToFile.thumbnail', 'thumbnail')
      .innerJoin('news.newsToSubjects', 'newsToSubjects')
      .innerJoin('newsToSubjects.subject', 'subject')
      .innerJoin('subject.subjectDetails', 'subjectDetails')
      .where('news.status = :status', { status: NewsStatus.ACTIVE })
      .select('news.id')
      .groupBy('news.id')
      .orderBy('news.createdAt', 'DESC');

    if (title) {
      qb.andWhere('news.title ILIKE :title', { title: `%${title}%` });
    }
    if (fromDate) {
      qb.andWhere('news.createdAt >= :fromDate', { fromDate: fromDate });
    }
    if (toDate) {
      qb.andWhere('news.createdAt <= :toDate', { toDate: toDate });
    }
    if (subjectIds) {
      qb.andWhere('subject.id IN (:...subjectIds)', { subjectIds: subjectIds });
    }
    if (ids?.length) {
      qb.andWhere('news.id IN (:...ids)', { ids });
    }

    const { items, meta } = await paginate(qb, { limit, page });

    const news = await Promise.all(
      items.map(async (item) => {
        const existedNews = await this.newsRepo.findOne({
          where: { id: item.id },
          relations: {
            newsDetails: true,
            newsToFile: { thumbnail: true },
          },
        });

        const newsToSubject = await this.newsToSubjectRepo.find({
          where: { newsId: existedNews.id },
          relations: { subject: { subjectDetails: true } },
        });
        const subjects = newsToSubject.map((item) => item.subject);

        return NewsResDto.forCustomer({
          data: existedNews,
          subjects: subjects,
        });
      }),
    );

    return new Pagination(news, meta);
  }
}

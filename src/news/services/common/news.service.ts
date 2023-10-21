import { Injectable } from '@nestjs/common';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Language } from '../../../common/enums/lang.enum';
import {
  GetListNewsBySubjectReqDto,
  GetNumberOfLatestNewsDto,
} from '../../../subject/dtos/common/req/subject.req.dto';
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

    const qb = this.newsRepo
      .createQueryBuilder('news')
      .innerJoin('news.newsDetails', 'newsDetails')
      .innerJoin('news.newsToFile', 'newsToFile')
      .innerJoin('newsToFile.thumbnail', 'thumbnail')
      .innerJoin('news.newsToSubjects', 'newsToSubjects')
      .innerJoin('newsToSubjects.subject', 'subject')
      .innerJoin('subject.subjectDetails', 'subjectDetails')
      .where('news.status = :status', { status: NewsStatus.ACTIVE })
      .andWhere('subjectDetails.slug = :slug', { slug })
      .select('news.id')
      .groupBy('news.id')
      .orderBy('news.createdAt', 'DESC');

    const { items, meta } = await paginate(qb, { limit, page });

    const news = await Promise.all(
      items.map(async (item) => {
        const existedNews = await this.newsRepo.findOne({
          where: {
            id: item.id,
            newsDetails: { lang: Language.EN },
          },
          relations: {
            newsDetails: true,
            newsToFile: { thumbnail: true },
          },
        });

        const newsToSubject = await this.newsToSubjectRepo.find({
          where: {
            newsId: existedNews.id,
            subject: {
              subjectDetails: { slug: slug },
            },
          },
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

  async getNumberOfLatestNews(num: GetNumberOfLatestNewsDto) {
    const { numberOfNews } = num;

    const qb = await this.newsRepo.find({
      where: { newsDetails: { lang: Language.EN } },
      relations: {
        newsDetails: true,
        newsToFile: { thumbnail: true },
      },
      order: { createdAt: 'DESC' },
      take: numberOfNews,
    });

    const news = await Promise.all(
      qb.map(async (item) => {
        return NewsResDto.forCustomer({ data: item });
      }),
    );

    return news;
  }
}

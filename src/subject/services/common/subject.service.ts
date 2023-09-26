import { Injectable } from '@nestjs/common';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { In } from 'typeorm';
import { NewsStatus } from '../../../news/enums/news.enum';
import { NewsToSubjectRepository } from '../../../news/repositories/news-to-subject.repository';
import { NewsRepository } from '../../../news/repositories/news.repository';
import { SubjectResDto } from '../../dtos/common/res/subject.res.dto';
import { GetListNewsBySubjectReqDto, GetListSubjectReqDto } from '../../dtos/common/req/subject.req.dto';
import { Subject } from '../../entities/subject.entity';
import { SubjectDetailRepository } from '../../repositories/subject-detail.repository';
import { SubjectRepository } from '../../repositories/subject.repository';
import { NewsResDto } from '../../../news/dtos/common/res/news.admin.res.dto';

@Injectable()
export class SubjectService {
  constructor(
    private readonly subjectRepo: SubjectRepository,
    private newsRepo: NewsRepository,
    private subjectDetailRepo: SubjectDetailRepository,
    private newsToSubjectRepo: NewsToSubjectRepository,
  ) {}

  async getList(dto: GetListSubjectReqDto) {
    const { limit, page, newsCountPerSubject } = dto;

    const qb = this.subjectRepo
      .createQueryBuilder('subject')
      .groupBy('subject.id')
      .orderBy('subject.priority', 'ASC')
      .addOrderBy('subject.createdAt', 'DESC');

    const { items, meta, links } = await paginate(qb, { limit, page });

    const subjects = await this.subjectRepo.find({
      where: { id: In(items.map((item) => item.id)) },
      relations: { subjectDetails: true },
    });

    const subjectMap: Record<number, Subject> = {};

    const subjectPromises = subjects.map(async (subject) => {
      const newsToSubjects = await this.newsToSubjectRepo.find({
        where: { subjectId: subject.id, news: { status: NewsStatus.ACTIVE } },
        relations: {
          news: { newsToFile: { thumbnail: true }, newsDetails: true },
        },
        take: newsCountPerSubject,
        order: { createdAt: 'DESC' },
      });
      subject.newsToSubjects = newsToSubjects;
      subjectMap[subject.id] = subject;
    });

    // Chạy tất cả các promise truy vấn cùng một lúc bằng Promise.all
    await Promise.all(subjectPromises);

    const subjectsWithCorrectOrder = items.map((item) =>
      SubjectResDto.forCustomer({ data: subjectMap[item.id] }),
    );
    return new Pagination(subjectsWithCorrectOrder, meta, links);
  }

  async getOne(id: number, dto: GetListNewsBySubjectReqDto) {
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
      .andWhere('subject.id = :id', { id: id})
      .select('news.id')
      .groupBy('news.id')
      .orderBy('news.createdAt', 'DESC');

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

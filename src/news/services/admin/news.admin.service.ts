import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { In } from 'typeorm';
import { runOnTransactionCommit, Transactional } from 'typeorm-transactional';
import { User } from '../../../auth/entities/user.entity';
import {
  BadRequestExc,
  NotFoundExc,
} from '../../../common/exceptions/custom.exception';
import { SubjectRepository } from '../../../subject/repositories/subject.repository';
import { NewsResDto } from '../../dtos/common/res/news.admin.res.dto';
import {
  CreateNewsAdminReqDto,
  DeleteMultipleNewsAdminReqDto,
  GetListNewsAdminReqDto,
  UpdateNewsAdminReqDto,
} from '../../dtos/admin/news.admin.req.dto';
import { NewsToSubject } from '../../entities/news-to-subject.entity';
import { NewsToFileRepository } from '../../repositories/news-to-file.repository';
import { NewsToSubjectRepository } from '../../repositories/news-to-subject.repository';
import { NewsRepository } from '../../repositories/news.repository';
import { NewsDetailAdminService } from './news-detail.admin.service';
import { AdminRepository } from '../../../auth/repositories/admin.repository';
import { UserRepository } from '../../../auth/repositories/user.repository';

@Injectable()
export class NewsAdminService {
  constructor(
    private eventEmitter: EventEmitter2,

    private subjectRepo: SubjectRepository,
    private newsRepo: NewsRepository,
    private newsToFileRepo: NewsToFileRepository,
    private newsToSubjectRepo: NewsToSubjectRepository,
    private newsDetailService: NewsDetailAdminService,
    private adminRepo: AdminRepository,
    private userRepo: UserRepository,
  ) {}

  @Transactional()
  async create(dto: CreateNewsAdminReqDto, user: User) {
    const { title, thumbnailId, subjectIds, status, newsDetails } = dto;
    
    const news = this.newsRepo.create({
      title: title,
      status: status,
      ownerId: user.id,
    });

    await this.newsRepo.save(news);

    const newsToFile = this.newsToFileRepo.create({
      newsId: news.id,
      thumbnailId: thumbnailId,
    });
    await this.newsToFileRepo.save(newsToFile);

    const newsToSubjects = await Promise.all(
      subjectIds.map(async (subjectId) => {
        const subject = await this.subjectRepo.findOneByOrThrowNotFoundExc({
          id: subjectId,
        });
        const newsToSubject = this.newsToSubjectRepo.create({
          newsId: news.id,
          subjectId: subjectId,
        });
        return await this.newsToSubjectRepo.save(newsToSubject);
      }),
    );

    news.newsToSubjects = newsToSubjects;
    news.newsToFile = newsToFile;
    const existedIds = await this.getNewsIds(user);
    await this.newsDetailService.createMultiNewsDetail(
      newsDetails,
      news,
      existedIds,
    );

    return await this.getOne(news.id);
  }

  async getOne(id: number) {
    const news = await this.newsRepo.findOneOrThrowNotFoundExc({
      where: { id: id }, //owner: { id: user.id } },
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
    return NewsResDto.forAdmin({ data: news, subjects: subjects });
  }

  async getNewsIds(user: User) {
    const AdminUserId = await this.adminRepo.getId(user.admin);

    const existedNews = await this.newsRepo.find({
      where: { owner: { id: AdminUserId } },
    });

    return existedNews.map((news) => news.id);
  }

  async getAll(dto: GetListNewsAdminReqDto) {
    const { fromDate, limit, newsStatus, page, subjectIds, title, toDate } =
      dto;
    
    const qb = this.newsRepo
      .createQueryBuilder('news')
      .innerJoin('news.newsDetails', 'newsDetails')
      .innerJoin('news.newsToFile', 'newsToFile')
      .innerJoin('newsToFile.thumbnail', 'thumbnail')
      .innerJoin('news.newsToSubjects', 'newsToSubjects')
      .innerJoin('newsToSubjects.subject', 'subject')
      .innerJoin('subject.subjectDetails', 'subjectDetails')
      .select('news.id')
      .groupBy('news.id');

    if (title) {
      qb.andWhere('news.title ILIKE :title', { title: `%${title}%` });
    }

    if (newsStatus) {
      qb.andWhere('news.status = :status', { status: newsStatus });
    }

    if (fromDate) {
      qb.andWhere('news.createdAt >= :fromDate', { fromDate: fromDate });
    }

    if (toDate) {
      qb.andWhere('news.createdAt <= :toDate', { toDate: toDate });
    }

    if (subjectIds?.length) {
      qb.andWhere('subject.id IN (:...subjectIds)', {
        subjectIds,
      });
    }

    qb.orderBy('news.createdAt', 'DESC');
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

        return NewsResDto.forAdmin({
          data: existedNews,
          subjects: subjects,
        });
      }),
    );

    return new Pagination(news, meta);
  }

  @Transactional()
  async deleteSingle(id: number) {

    const news = await this.newsRepo.findOneOrThrowNotFoundExc({
      where: { id },
    });
    const { affected } = await this.newsRepo.softDelete({
      id,
      //ownerId: AdminUserId,
    });

    if (!affected) throw new NotFoundExc({ message: 'common.exc.notFound' });
    // delete news detail
    const newsDetailIds = await this.newsDetailService.getNewsDetailIds(news);
    await this.newsDetailService.deleteMulti(newsDetailIds, id);

    // delete relation
    await this.newsToFileRepo.softDelete({ newsId: id });
    await this.newsToSubjectRepo.softDelete({ newsId: id });

  }

  @Transactional()
  async deleteMultiples(dto: DeleteMultipleNewsAdminReqDto) {
    const { ids } = dto;
    
    
    for (const id of ids) {
      const news = await this.newsRepo.findOneOrThrowNotFoundExc({
        where: { id },
      });

      const newsDetailIds = await this.newsDetailService.getNewsDetailIds(news);
      await this.newsDetailService.deleteMulti(newsDetailIds, id);
      await this.newsToFileRepo.softDelete({ newsId: id });
      await this.newsToSubjectRepo.softDelete({ newsId: id });
    }

    const { affected } = await this.newsRepo.softDelete({
      id: In(ids),
      //ownerId: AdminUserId,
    });

    if (affected !== ids.length)
      throw new NotFoundExc({ message: 'common.exc.notFound' });

  }

  @Transactional()
  async update(updateNewsDto: UpdateNewsAdminReqDto) {
    const { id, thumbnailId, subjectIds, title, status } = updateNewsDto;

    const existedNews = await this.newsRepo.findOneOrThrowNotFoundExc({
      where: { id },
      relations: {
        newsDetails: true,
        newsToSubjects: { subject: { subjectDetails: true } },
        newsToFile: true,
      },
    });
    await this.newsRepo.update(id, { title, status });

    //Check News Details
    if (
      existedNews.newsDetails.length === 0 &&
      updateNewsDto.newsDetails.length === 0
    )
      throw new BadRequestExc({ message: 'common.exc.badRequest' });

    //Filter News Detail dont have in updateNewsDto
    const deleteNewsDetails = existedNews.newsDetails.filter((newsDetail) => {
      if (!newsDetail.id) return;
      return !updateNewsDto.newsDetails.find((updateNewsDetails) => {
        return newsDetail.id === updateNewsDetails.id;
      });
    });

    //Delete news Detail
    if (deleteNewsDetails.length > 0)
      await this.newsDetailService.deleteMulti(
        deleteNewsDetails.map((deleteSubjectDetail) => deleteSubjectDetail.id),
        id,
      );

    //Create or update news Detail
    await this.newsDetailService.createOrUpdateNewsDetail(
      updateNewsDto.newsDetails,
      existedNews,
    );

    // update relation
    await this.updateRelationOnNews(
      thumbnailId,
      subjectIds,
      existedNews.id
    );
    return await this.getOne(updateNewsDto.id);
  }

  private async updateRelationOnNews(
    thumbnailId: number,
    subjectIds: number[],
    exitstedNewsId: number,
  ) {
    // update news to file
    const existedThumbnail = await this.newsToFileRepo.findOneBy({
      newsId: exitstedNewsId,
    });
    if (thumbnailId !== existedThumbnail.id) {
      await this.newsToFileRepo.update(existedThumbnail.id, {
        thumbnailId: thumbnailId,
      });
    }
    const newsToSubjects = await this.newsToSubjectRepo.find({
      where: {
        newsId: exitstedNewsId,
      },
    });
    await this.saveNewsSubject(
      exitstedNewsId,
      newsToSubjects,
      subjectIds,
    );
    //  update news to subject
  }

  private async saveNewsSubject(
    newsId: number,
    newsToSubjects: NewsToSubject[],
    subjectIds: number[],
  ) {
    const newsSubjectToInsert: NewsToSubject[] = [];
    const newsSubjectToRemove: number[] = [];

    for (const newsToSubject of newsToSubjects) {
      const isExistInDto = subjectIds.some(
        (item) => item === newsToSubject.subjectId,
      );

      if (!isExistInDto) newsSubjectToRemove.push(newsToSubject.id);
    }

    await Promise.all(
      subjectIds.map(async (subjectId) => {
        const isExistInDb = newsToSubjects.some(
          (item) => item.subjectId === subjectId,
        );

        if (!isExistInDb) {
          const subject = await this.subjectRepo.findOneOrThrowNotFoundExc({
            where: { id: subjectId }, //ownerId },
          });

          newsSubjectToInsert.push(
            this.newsToSubjectRepo.create({ newsId, subjectId }),
          );
        }
      }),
    );

    await Promise.all([
      newsSubjectToRemove.length &&
        this.newsToSubjectRepo.softDelete(newsSubjectToRemove),
      newsSubjectToInsert.length &&
        this.newsToSubjectRepo.insert(newsSubjectToInsert),
    ]);
  }
}

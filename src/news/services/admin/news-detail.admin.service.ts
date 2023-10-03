import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { In } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import {
  ConflictExc,
  NotFoundExc,
} from '../../../common/exceptions/custom.exception';
import {
  CreateNewsDetailAdminReqDto,
  UpdateNewsDetailAdminReqDto,
} from '../../dtos/admin/news.admin.req.dto';
import { NewsDetailResDto } from '../../dtos/common/res/news-detail.res.dto';
import { NewsDetail } from '../../entities/news-detail.entity';
import { News } from '../../entities/news.entity';
import { NewsDetailRepository } from '../../repositories/news-detail.repository';

@Injectable()
export class NewsDetailAdminService {
  constructor(private newsDetailRepo: NewsDetailRepository) {}

  @Transactional()
  async createMultiNewsDetail(
    createNewsDetailReqDtos: CreateNewsDetailAdminReqDto[],
    news: News,
  ) {
    const existedIds = await this.getListNewsDetailId();

    const newsDetails = await Promise.all(
      createNewsDetailReqDtos.map(async (createNewsDetailReqDto) => {
        const isExisted = await this.newsDetailRepo.findOne({
          where: {
            id: In(existedIds),
            lang: createNewsDetailReqDto.lang,
            content: createNewsDetailReqDto.content,
          },
        });

        if (isExisted) {
          throw new ConflictExc({ message: 'news.isExisted' });
        }

        return this.newsDetailRepo.create({
          ...createNewsDetailReqDto,
          newsId: news.id,
          title: news.title,
          slug: slugify(news.title, {
            locale: 'vi',
          }),
        });
      }),
    );

    await this.newsDetailRepo.save(newsDetails);

    return newsDetails.map((newsDetail) => {
      return NewsDetailResDto.forAdmin({ data: newsDetail });
    });
  }

  @Transactional()
  async deleteMulti(ids: number[], newsId: number) {
    const { affected } = await this.newsDetailRepo
      .createQueryBuilder()
      .softDelete()
      .from(NewsDetail)
      .whereInIds(ids)
      .andWhere({ newsId })
      .execute();

    if (!affected) throw new NotFoundExc({ message: 'common.exc.notFound' });
  }

  async getListNewsDetailId() {
    const existedNewsDetail = await this.newsDetailRepo.find();

    return existedNewsDetail.map((news) => news.id);
  }

  async getNewsDetailIds(news: News) {
    const newsDetails = await this.newsDetailRepo.find({
      where: { newsId: news.id },
    });
    return newsDetails.map((newsDetail) => newsDetail.id);
  }

  @Transactional()
  async updateNewsDetail(
    updateNewsDetailDto: UpdateNewsDetailAdminReqDto[],
    news: News,
  ) {
    const updateNewsDetails = updateNewsDetailDto.map((newsDetail) => {
      if (!newsDetail.id)
        throw new NotFoundExc({ message: 'news.notFoundNewsDetail' });

      this.newsDetailRepo.update(newsDetail.id, {
        ...newsDetail,
        title: news.title,
        slug: slugify(news.title, {
          locale: 'vi',
        }),
      });
    });

    return updateNewsDetails;
  }
}

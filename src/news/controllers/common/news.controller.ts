import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrefixType } from '../../../common/constants/global.constant';
import { PaginationResponse } from '../../../common/decorators/swagger.decorator';
import {
  GetListNewsBySubjectReqDto,
  GetNumberOfLatestNewsDto,
} from '../../../subject/dtos/common/req/subject.req.dto';
import { SubjectResDto } from '../../../subject/dtos/common/res/subject.res.dto';
import { NewsService } from '../../services/common/news.service';

@Controller(`${PrefixType.CUSTOMER}/news`)
@ApiTags('News')
export class NewsController {
  constructor(private readonly newsCustomerService: NewsService) {}

  @Get(':slug')
  getOne(@Param('slug') slug: string) {
    return this.newsCustomerService.getOne(slug);
  }

  @Get('/newsPerSubject/:slug')
  @PaginationResponse(SubjectResDto)
  getList(
    @Param('slug') slug: string,
    @Query() query: GetListNewsBySubjectReqDto,
  ) {
    return this.newsCustomerService.getListNewsBySubjectSlug(slug, query);
  }

  @Get('/numberOfNews/:num')
  getListNews(@Query() query: GetNumberOfLatestNewsDto) {
    return this.newsCustomerService.getNumberOfLatestNews(query);
  }
}

import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrefixType } from '../../../common/constants/global.constant';
import { PaginationResponse } from '../../../common/decorators/swagger.decorator';
import { GetListNewsReqDto } from '../../dtos/common/req/news.req.dto';
import { NewsResDto } from '../../dtos/common/res/news.admin.res.dto';
import { NewsService } from '../../services/common/news.service';

@Controller(`${PrefixType.CUSTOMER}/news`)
@ApiTags('News')
export class NewsController {
  constructor(private readonly newsCustomerService: NewsService) {}

  @Get(':slug')
  getOne(@Param('slug') slug: string) {
    return this.newsCustomerService.getOne(slug);
  }

  @Get()
  @PaginationResponse(NewsResDto)
  getList(@Query() query: GetListNewsReqDto) {
    return this.newsCustomerService.getAll(query);
  }
}

import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrefixType } from '../../../common/constants/global.constant';
import { PaginationResponse } from '../../../common/decorators/swagger.decorator';
import { NewsResDto } from '../../dtos/common/res/news.admin.res.dto';
import { GetListNewsReqDto } from '../../dtos/common/req/news.req.dto';
import { NewsService } from '../../services/common/news.service';

@Controller(`${PrefixType.CUSTOMER}/news`)
@ApiTags('News')
export class NewsController {
  constructor(private readonly newsCustomerService: NewsService) { }

  @Get(':id')
  getOne(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.newsCustomerService.getOne(id);
  }

  @Get()
  @PaginationResponse(NewsResDto)
  getList(
    @Query() query: GetListNewsReqDto,
  ) {
    return this.newsCustomerService.getAll(query);
  }
}

import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrefixType } from '../../../common/constants/global.constant';
import { PaginationResponse } from '../../../common/decorators/swagger.decorator';
import {
  GetListNewsBySubjectReqDto,
  GetListSubjectReqDto,
} from '../../dtos/common/req/subject.req.dto';
import { SubjectResDto } from '../../dtos/common/res/subject.res.dto';
import { SubjectService } from '../../services/common/subject.service';

@Controller(`${PrefixType.CUSTOMER}/subject`)
@ApiTags('Subject')
export class SubjectController {
  constructor(private readonly subjectCustomerService: SubjectService) {}

  @Get()
  @PaginationResponse(SubjectResDto)
  get(@Query() query: GetListSubjectReqDto) {
    return this.subjectCustomerService.getList(query);
  }

  @Get(':slug')
  @PaginationResponse(SubjectResDto)
  getOne(
    @Param('slug') slug: string,
    @Query() query: GetListNewsBySubjectReqDto,
  ) {
    return this.subjectCustomerService.getOne(slug, query);
  }
}

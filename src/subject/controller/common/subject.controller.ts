import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrefixType } from '../../../common/constants/global.constant';
import { PaginationResponse } from '../../../common/decorators/swagger.decorator';
import { SubjectResDto } from '../../dtos/common/res/subject.res.dto';
import { GetListNewsBySubjectReqDto, GetListSubjectReqDto } from '../../dtos/common/req/subject.req.dto';
import { SubjectService } from '../../services/common/subject.service';

@Controller(`${PrefixType.CUSTOMER}/subject`)
@ApiTags('Subject')
export class SubjectController {
  constructor(
    private readonly subjectCustomerService: SubjectService,
  ) { }

  @Get()
  @PaginationResponse(SubjectResDto)
  get(
    @Query() query: GetListSubjectReqDto,
  ) {
    return this.subjectCustomerService.getList(query);
  }

  @Get(':id')
  @PaginationResponse(SubjectResDto)
  getOne(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: GetListNewsBySubjectReqDto,
  ) {
    return this.subjectCustomerService.getOne(id, query);
  }
}

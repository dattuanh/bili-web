import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrefixType } from '../../../common/constants/global.constant';
import { GetListSubjectReqDto } from '../../dtos/common/req/subject.req.dto';
import { SubjectService } from '../../services/common/subject.service';

@Controller(`${PrefixType.CUSTOMER}/subject`)
@ApiTags('Subject')
export class SubjectController {
  constructor(private readonly subjectCustomerService: SubjectService) {}

  @Get()
  getCommonTable(@Query() query: GetListSubjectReqDto) {
    return this.subjectCustomerService.getListCommonTable(query);
    // return this.subjectCustomerService.getListCommonTableVer2(query);
  }
}

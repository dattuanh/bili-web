import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../../../auth/entities/user.entity';
import { PrefixType } from '../../../common/constants/global.constant';
import {
  AuthenticateAdmin,
  CurrentAuthData,
} from '../../../common/decorators/auth.decorator';
import { PaginationResponse } from '../../../common/decorators/swagger.decorator';
import { SubjectResDto } from '../../dtos/common/res/subject.res.dto';
import {
  CreateSubjectAdminReqDto,
  DeleteSubjectsAdminReqDto,
  GetListSubjectAdminReqDto,
  UpdateSubjectAdminReqDto,
} from '../../dtos/admin/req/subject.admin.req.dto';
import { SubjectAdminService } from '../../services/admin/subject.admin.service';

@Controller(`${PrefixType.ADMIN}/subject`)
@AuthenticateAdmin()
@ApiTags('Subject Admin')
export class SubjectAdminController {
  constructor(
    private readonly subjectAdminService: SubjectAdminService,
  ) {}

  @Get()
  @PaginationResponse(SubjectResDto)
  get(
    @Query() query: GetListSubjectAdminReqDto,
  ) {
    return this.subjectAdminService.getList(query);
  }

  @Get(':id')
  getOne(@CurrentAuthData() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.subjectAdminService.getOne(id);
  }

  @Post()
  create(
    @CurrentAuthData() user: User,
    @Body() createSubjectDto: CreateSubjectAdminReqDto,
  ) {
    return this.subjectAdminService.create(user, createSubjectDto);
  }

  @Patch()
  update(
    @Body() updateSubjectDto: UpdateSubjectAdminReqDto,
  ) {
    return this.subjectAdminService.update(updateSubjectDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.subjectAdminService.deleteSingle(Number(id));
  }

  @Delete()
  deleteSubjects(
    @Body() body: DeleteSubjectsAdminReqDto,
  ) {
    return this.subjectAdminService.deleteMultiples(body);
  }
}

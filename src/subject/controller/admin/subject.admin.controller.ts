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
    @CurrentAuthData() user: User,
    @Query() query: GetListSubjectAdminReqDto,
  ) {
    return this.subjectAdminService.getList(user, query);
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
    @CurrentAuthData() user: User,
    @Body() updateSubjectDto: UpdateSubjectAdminReqDto,
  ) {
    return this.subjectAdminService.update(user, updateSubjectDto);
  }

  @Delete(':id')
  delete(@CurrentAuthData() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.subjectAdminService.deleteSingle(user, Number(id));
  }

  @Delete()
  deleteSubjects(
    @CurrentAuthData() user: User,
    @Body() body: DeleteSubjectsAdminReqDto,
  ) {
    return this.subjectAdminService.deleteMultiples(user, body);
  }
}

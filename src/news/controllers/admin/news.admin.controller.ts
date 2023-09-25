import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
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
import { NewsResDto } from '../../dtos/common/res/news.admin.res.dto';
import {
  CreateNewsAdminReqDto,
  DeleteMultipleNewsAdminReqDto,
  GetListNewsAdminReqDto,
  UpdateNewsAdminReqDto,
} from '../../dtos/admin/news.admin.req.dto';
import { NewsAdminService } from '../../services/admin/news.admin.service';

@Controller(`${PrefixType.ADMIN}/news`)
@AuthenticateAdmin()
@ApiTags('News Admin')
export class NewsAdminController {
  constructor(private readonly newsMerchantService: NewsAdminService) { }

  @Get(':id')
  getOne(
    //@CurrentAuthData() user: User,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.newsMerchantService.getOne(id);
  }

  @Post()
  create(
    @CurrentAuthData() user: User,
    @Body() createSubjectDto: CreateNewsAdminReqDto,
  ) {
    return this.newsMerchantService.create(createSubjectDto, user);
  }

  @Get()
  @PaginationResponse(NewsResDto)
  getList(
    //@CurrentAuthData() user: User,
    @Query() query: GetListNewsAdminReqDto,
  ) {
    return this.newsMerchantService.getAll(query);
  }

  @Delete(':id')
  delete(
    //@CurrentAuthData() user: User,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.newsMerchantService.deleteSingle(Number(id));
  }

  @Delete()
  deleteSubjects(
    //@CurrentAuthData() user: User,
    @Body() body: DeleteMultipleNewsAdminReqDto,
  ) {
    return this.newsMerchantService.deleteMultiples(body);
  }

  @Put()
  update(
    //@CurrentAuthData() user: User,
    @Body() body: UpdateNewsAdminReqDto,
  ) {
    return this.newsMerchantService.update(body);
  }
}

// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   Param,
//   Patch,
//   Post,
//   Query,
// } from '@nestjs/common';
// import { ApiTags } from '@nestjs/swagger';
// import { PrefixType } from '../../../common/constants/global.constant';
// import {
//   AuthenticateAdmin,
//   // AuthorizeAdmin,
//   CurrentAuthData,
// } from '../../../common/decorators/auth.decorator';
// import { PaginationResponse } from '../../../common/decorators/swagger.decorator';
// import { DeleteMultipleByIdNumberReqDto } from '../../../common/dtos/delete-multiple.dto';
// import { Action, Resource } from '../../../common/enums/casl.enum';
// import {
//   CreateAdminReqDto,
//   ListAdminReqDto,
//   UpdateAdminReqDto,
// } from '../../dtos/admin/req/admin.admin.req.dto';
// import { AdminResDto } from '../../dtos/common/res/admin.res.dto';
// import { User } from '../../entities/user.entity';
// import { AdminAdminService } from '../../services/admin/admin.admin.service';

// @Controller(`${PrefixType.ADMIN}/admin`)
// @AuthenticateAdmin()
// @ApiTags('Manage Admin')
// export class AdminAdminController {
//   constructor(private adminAdminService: AdminAdminService) {}  

//   @Get()
//   @PaginationResponse(AdminResDto)
//   getListAdmin(@Query() body: ListAdminReqDto, @CurrentAuthData() user: User) {
//     return this.adminAdminService.getList(body, user);
//   }

//   @Get(':id')
//   getAdminDetail(@Param('id') id: number, @CurrentAuthData() user: User) {
//     return this.adminAdminService.getDetail(id, user);
//   }

// }

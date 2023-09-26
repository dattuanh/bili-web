import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { PrefixType } from "../../../common/constants/global.constant";
import { ApiTags } from "@nestjs/swagger";
import { ContactAdminService } from "../../services/admin/contact.admin.service";
import { DeleteMultipleContactAdminReqDto, GetListContactAdminReqDto, UpdateContactAdminReqDto } from "../../dto/admin/contact.admin.req.dto";
import { AuthenticateAdmin } from "../../../common/decorators/auth.decorator";
import { PaginationResDto } from "../../../common/dtos/pagination.dto";
import { PaginationResponse } from "../../../common/decorators/swagger.decorator";
import { ContactResDto } from "../../dto/common/res/contact.res.dto";

@Controller(`${PrefixType.ADMIN}/contact`)
@AuthenticateAdmin()
@ApiTags('Contact Admin')
export class ContactAdminController {
    constructor(private readonly contactService: ContactAdminService) { }

    @Get()
    @PaginationResponse(ContactResDto)
    getList(@Query() query: GetListContactAdminReqDto) {
        return this.contactService.getAll(query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: string) {
        return this.contactService.getOne(+id);
    }

    @Patch()
    update(@Body() updateContactDto: UpdateContactAdminReqDto) {
        return this.contactService.update(updateContactDto);
    }

    @Delete(':id')
    deleteSingle(@Param('id', ParseIntPipe) id: number) {
        return this.contactService.deleteSingle(Number(id));
    }

    @Delete()
    deleteMultiple(@Body() body: DeleteMultipleContactAdminReqDto) {
        return this.contactService.deleteMultiple(body);
    }
}
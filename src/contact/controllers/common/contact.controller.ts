import { Controller, Get, Post, Body } from '@nestjs/common';
import { ContactService } from '../../services/common/contact.service';
import { PrefixType } from '../../../common/constants/global.constant';
import { CreateContactReqDto } from '../../dto/common/req/contact.req.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller(`${PrefixType.CUSTOMER}/contact`)
@ApiTags('Contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  create(@Body() createContactDto: CreateContactReqDto) {
    return this.contactService.create(createContactDto);
  }

}

import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrefixType } from '../../../common/constants/global.constant';
import { CreateContactReqDto } from '../../dto/common/req/contact.req.dto';
import { ContactService } from '../../services/common/contact.service';

@Controller(`${PrefixType.CUSTOMER}/contact`)
@ApiTags('Contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  create(@Body() createContactDto: CreateContactReqDto) {
    return this.contactService.create(createContactDto);
  }
}

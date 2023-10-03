import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { CreateContactReqDto } from '../../dto/common/req/contact.req.dto';
import { ContactRepository } from '../../repositories/contact.repository';

@Injectable()
export class ContactService {
  constructor(private contactRepo: ContactRepository) {}

  @Transactional()
  async create(dto: CreateContactReqDto) {
    const { name, phoneNumber, email, company, message } = dto;

    const contact = this.contactRepo.create({
      name: name,
      phoneNumber: phoneNumber,
      email: email,
      company: company,
      message: message,
    });

    await this.contactRepo.save(contact);

    return contact;
  }
}

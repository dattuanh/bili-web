import { Injectable } from '@nestjs/common';
import { CreateContactReqDto } from '../../dto/common/req/contact.req.dto';
import { ContactRepository } from '../../repositories/contact.repository';
import { Transactional } from 'typeorm-transactional';
import { ContactResDto } from '../../dto/common/res/contact.res.dto';

@Injectable()
export class ContactService {
  constructor(private contactRepo: ContactRepository) { }

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

    return await this.getOne(contact.id);
  }

  async getOne(id: number) {
    const contact = await this.contactRepo.findOneOrThrowNotFoundExc({
      where: { id: id },
    });

    return ContactResDto.forAdmin({ data: contact });
  }

}

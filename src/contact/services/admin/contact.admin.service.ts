import { Injectable } from "@nestjs/common";
import { DeleteMultipleContactAdminReqDto, GetListContactAdminReqDto, UpdateContactAdminReqDto } from "../../dto/admin/contact.admin.req.dto";
import { ContactRepository } from "../../repositories/contact.repository";
import { Pagination, paginate } from "nestjs-typeorm-paginate";
import { ContactResDto } from "../../dto/common/res/contact.res.dto";
import { Transactional } from "typeorm-transactional";
import { NotFoundExc } from "../../../common/exceptions/custom.exception";
import { In } from "typeorm";

@Injectable()
export class ContactAdminService {
    constructor(private contactRepo: ContactRepository) { }

    async getAll(dto: GetListContactAdminReqDto) {
        const { name, phoneNumber, email, company, fromDate, toDate, page, limit } = dto;

        const qb = this.contactRepo
            .createQueryBuilder('contact')
            .select('contact.id')
            .groupBy('contact.id')
            .orderBy('contact.createdAt', 'DESC')

        if (name) {
            qb.andWhere('contact.name ILIKE :name', { name: `%${name}%` });
        }

        if (phoneNumber) {
            qb.andWhere('contact.phoneNumber ILIKE :phone_number', { phoneNumber: `%${phoneNumber}%` });
        }

        if (email) {
            qb.andWhere('contact.email ILIKE :email', { email: `%${email}%` });
        }

        if (company) {
            qb.andWhere('contact.company ILIKE :company', { company: `%${company}%` });
        }

        if (fromDate) {
            qb.andWhere('contact.createdAt >= :fromDate', { fromDate: fromDate });
        }

        if (toDate) {
            qb.andWhere('contact.createdAt <= :toDate', { toDate: toDate });
        }

        const { items, meta } = await paginate(qb, { page, limit });

        const contact = await Promise.all(
            items.map(async (item) => {
                const existedContact = await this.contactRepo.findOne({
                    where: { id: item.id },
                });

                return ContactResDto.forAdmin({ data: existedContact });
            }),
        )

        return new Pagination(contact, meta);

    }

    async getOne(id: number) {
        const contact = await this.contactRepo.findOneOrThrowNotFoundExc({
            where: { id: id },
        });

        return ContactResDto.forAdmin({ data: contact });
    }

    async update(updateContactDto: UpdateContactAdminReqDto) {
        const { id, name, phoneNumber, email, company, message } = updateContactDto;

        const existedContact = await this.contactRepo.findOneOrThrowNotFoundExc({
            where: { id: id }
        });

        await this.contactRepo.update(id, { name, phoneNumber, email, company, message });

        return await this.getOne( updateContactDto.id );
    }

    @Transactional()
    async deleteSingle(id: number) {
        const contact = await this.contactRepo.findOneOrThrowNotFoundExc({
            where: { id: id }
        });

        const { affected } = await this.contactRepo.softDelete({
            id: contact.id,
        });

        if(!affected){
            throw new NotFoundExc({ message: 'common.exc.notFound' })
        }
    }

    @Transactional()
    async deleteMultiple(dto: DeleteMultipleContactAdminReqDto) {
        const { ids } = dto;

        const { affected } = await this.contactRepo.softDelete({
            id: In(ids),
        });

        if(affected !== ids.length) {
            throw new NotFoundExc({ message: 'common.exc.notFound' });
        }
    }

}
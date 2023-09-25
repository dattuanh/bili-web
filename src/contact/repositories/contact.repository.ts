import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../../common/repositories/base.repositories";
import { Contact } from "../entities/contact.entity";
import { I18nPath } from "../../i18n/i18n.generated";
import { DataSource } from "typeorm";

@Injectable()
export class ContactRepository extends BaseRepository<Contact> {
    entityNameI18nKey: I18nPath;
    constructor(dataSource: DataSource) {
        super(Contact, dataSource);
        this.entityNameI18nKey = 'common.word.contact';
    }
}
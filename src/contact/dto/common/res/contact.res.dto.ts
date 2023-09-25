import { BaseResponseDtoParams } from "../../../../common/dtos/base.res";
import { Contact } from "../../../entities/contact.entity";

export interface ContactResDtoParams extends BaseResponseDtoParams {
    data: Contact;
}

export class ContactResDto {
    id: number; 
    name: string;
    phoneNumber: string;
    email: string;
    company: string;
    message: string;
    createdAt: Date;
    updatedAt: Date;

    static mapProperty(dto: ContactResDto, { data }: ContactResDtoParams) {
        dto.id = data.id;
        dto.name = data.name;
        dto.phoneNumber = data.phoneNumber;
        dto.email = data.email;
        dto.createdAt = data.createdAt;
        dto.updatedAt = data.updatedAt;
    }


    static forAdmin(param: ContactResDtoParams) {
        if(!param) return null;
        const result = new ContactResDto();

        this.mapProperty(result, param);

        return result;
    }

}
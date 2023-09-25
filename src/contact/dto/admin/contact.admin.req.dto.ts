import { Transform } from "class-transformer";
import { IsValidArrayNumber, IsValidDate, IsValidEmail, IsValidNumber, IsValidText } from "../../../common/decorators/custom-validator.decorator";
import { getPhoneE164 } from "../../../common/utils";
import { PaginationReqDto } from "../../../common/dtos/pagination.dto";


export class UpdateContactAdminReqDto {
    @IsValidNumber({ required: false })
    id: number;

    @IsValidText({ maxLength: 30 })
    name: string;

    @IsValidText({
        message: 'auth.customer.wrongPhoneNumber',
        minLength: 12,
        maxLength: 12,
    })
    @Transform(({ value }) => getPhoneE164(value))
    phoneNumber: string;

    @IsValidEmail()
    email: string;

    @IsValidText({ required: false })
    company?: string;

    @IsValidText({ required: false })
    message?: string;
}

export class GetListContactAdminReqDto extends PaginationReqDto {
    @IsValidText({ maxLength: 30, required: false })
    name?: string;

    @IsValidText({ required: false })
    @Transform(({ value }) => getPhoneE164(value))
    phoneNumber?: string;

    @IsValidEmail({ required: false })
    email?: string;

    @IsValidText({ required: false })
    company?: string;

    @IsValidDate({ required: false})
    fromDate?: Date;

    @IsValidDate({ required: false})
    toDate?: Date;  
}

export class DeleteMultipleContactAdminReqDto {
    @IsValidArrayNumber({ required: true, unique: true, minSize: 1 })
    ids: number[];
}
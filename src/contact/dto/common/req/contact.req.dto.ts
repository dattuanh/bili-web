import { Transform } from "class-transformer";
import { IsValidEmail, IsValidText } from "../../../../common/decorators/custom-validator.decorator";
import { getPhoneE164 } from "../../../../common/utils";

export class CreateContactReqDto {
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
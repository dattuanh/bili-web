import {
  IsValidEnum,
  IsValidNumber,
  IsValidText,
} from '../../../../common/decorators/custom-validator.decorator';
import { Language } from '../../../../common/enums/lang.enum';

class SaveSubjectDetailAdminReqDto {
  @IsValidEnum({ enum: Language, required: true })
  lang: Language;

  @IsValidText({ trim: true, required: true })
  name: string;
}

export class CreateSubjectDetailAdminReqDto extends SaveSubjectDetailAdminReqDto {}

export class UpdateSubjectDetailAdminReqDto extends SaveSubjectDetailAdminReqDto {
  @IsValidNumber({ required: false })
  id?: number;
}

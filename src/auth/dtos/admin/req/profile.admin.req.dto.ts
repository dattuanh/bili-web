import {
  IsValidNumber,
  IsValidText,
} from '../../../../common/decorators/custom-validator.decorator';

export class UpdateProfileAdminReqDto {
  @IsValidText({ required: false })
  name?: string;

  @IsValidNumber({ min: 1, required: false })
  avatarId?: number;
}

export class ChangePasswordAdminReqDto {
  @IsValidText()
  password: string;

  @IsValidText()
  newPassword: string;
}

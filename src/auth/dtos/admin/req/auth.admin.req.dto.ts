import { IsValidText } from '../../../../common/decorators/custom-validator.decorator';

export class AdminLoginReqDto {
  @IsValidText()
  username: string;

  @IsValidText()
  password: string;
}

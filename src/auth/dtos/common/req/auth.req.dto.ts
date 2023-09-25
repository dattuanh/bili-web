import { IsValidText } from '../../../../common/decorators/custom-validator.decorator';

export class RefreshTokenReqDto {
  @IsValidText()
  refreshToken: string;
}

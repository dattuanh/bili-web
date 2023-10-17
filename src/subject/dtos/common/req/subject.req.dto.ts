import { IsValidNumber } from '../../../../common/decorators/custom-validator.decorator';
import { PaginationReqDto } from '../../../../common/dtos/pagination.dto';

export class GetListSubjectReqDto {
  @IsValidNumber()
  numberOfSubject: number;

  @IsValidNumber()
  newsCountPerSubject: number;
}

export class GetListNewsBySubjectReqDto extends PaginationReqDto {}

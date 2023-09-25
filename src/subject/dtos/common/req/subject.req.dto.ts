import { IsValidNumber } from '../../../../common/decorators/custom-validator.decorator';
import { PaginationReqDto } from '../../../../common/dtos/pagination.dto';

export class GetListSubjectReqDto extends PaginationReqDto {
  @IsValidNumber()
  newsCountPerSubject: number;
}

export class GetListNewsBySubjectReqDto extends PaginationReqDto {}
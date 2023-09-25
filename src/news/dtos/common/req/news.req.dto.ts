import {
  IsValidArrayNumber,
  IsValidDate,
  IsValidText,
} from '../../../../common/decorators/custom-validator.decorator';
import { PaginationReqDto } from '../../../../common/dtos/pagination.dto';

export class GetListNewsReqDto extends PaginationReqDto {
  @IsValidArrayNumber({ required: false, unique: true, minSize: 1 })
  subjectIds?: number[];

  @IsValidText({ required: false })
  title?: string;

  @IsValidDate({ required: false })
  fromDate?: Date;

  @IsValidDate({ required: false })
  toDate?: Date;

  @IsValidArrayNumber({ minValue: 1, required: false })
  ids?: number[];
}

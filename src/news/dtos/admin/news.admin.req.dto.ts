import { MAX_LENGTH_HTML_CONTENT } from '../../../common/constants/global.constant';
import {
  IsValidArrayNumber,
  IsValidArrayObject,
  IsValidDate,
  IsValidEnum,
  IsValidNumber,
  IsValidText,
} from '../../../common/decorators/custom-validator.decorator';
import { PaginationReqDto } from '../../../common/dtos/pagination.dto';
import { Language } from '../../../common/enums/lang.enum';
import { IsArrayObjUniqueProperty } from '../../../common/validators/is-array-unique-property.validator';
import { NewsStatus } from '../../enums/news.enum';

export class SaveNewsDetailAdminReqDto {
  @IsValidEnum({ enum: Language })
  lang: Language;

  @IsValidText({ maxLength: MAX_LENGTH_HTML_CONTENT })
  content: string;

  @IsValidText()
  author: string;

  @IsValidText()
  description: string;
}

export class CreateNewsDetailAdminReqDto extends SaveNewsDetailAdminReqDto {}

export class UpdateNewsDetailAdminReqDto extends SaveNewsDetailAdminReqDto {
  @IsValidNumber({ required: false })
  id: number;
}

export class SaveNewsAdminReqDto {
  @IsValidText()
  title: string;

  @IsValidNumber()
  thumbnailId: number;

  @IsValidArrayNumber({ unique: true, minSize: 1 })
  subjectIds: number[];

  @IsValidEnum({ enum: NewsStatus })
  status: NewsStatus;
}

export class CreateNewsAdminReqDto extends SaveNewsAdminReqDto {
  @IsValidArrayObject({}, CreateNewsDetailAdminReqDto)
  @IsArrayObjUniqueProperty(['lang'])
  newsDetails: CreateNewsDetailAdminReqDto[];
}

export class UpdateNewsAdminReqDto extends SaveNewsAdminReqDto {
  @IsValidNumber({ required: false })
  id?: number;

  @IsValidArrayObject({}, UpdateNewsDetailAdminReqDto)
  @IsArrayObjUniqueProperty(['lang'])
  newsDetails: UpdateNewsDetailAdminReqDto[];
}

export class GetListNewsAdminReqDto extends PaginationReqDto {
  @IsValidEnum({ enum: NewsStatus, required: false })
  newsStatus?: NewsStatus;

  @IsValidArrayNumber({ required: false, unique: true, minSize: 1 })
  subjectIds?: number[];

  @IsValidText({ required: false })
  title?: string;

  @IsValidDate({ required: false })
  fromDate?: Date;

  @IsValidDate({ required: false })
  toDate?: Date;
}

export class DeleteMultipleNewsAdminReqDto {
  @IsValidArrayNumber({ required: true, unique: true, minSize: 1 })
  ids: number[];
}

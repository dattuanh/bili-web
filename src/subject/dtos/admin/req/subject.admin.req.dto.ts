import {
  IsValidArrayNumber,
  IsValidArrayObject,
  IsValidNumber,
} from '../../../../common/decorators/custom-validator.decorator';
import { PaginationReqDto } from '../../../../common/dtos/pagination.dto';
import { IsArrayObjUniqueProperty } from '../../../../common/validators/is-array-unique-property.validator';
import {
  CreateSubjectDetailAdminReqDto,
  UpdateSubjectDetailAdminReqDto,
} from './subject-detail.admin.req.dto';

class SaveSubjectAdminReqDto {
  @IsValidNumber({ min: 1, required: false })
  priority?: number;
}

export class CreateSubjectAdminReqDto extends SaveSubjectAdminReqDto {
  @IsValidArrayObject(
    { minSize: 1, required: true },
    CreateSubjectDetailAdminReqDto,
  )
  @IsArrayObjUniqueProperty(['lang'])
  subjectDetails: CreateSubjectDetailAdminReqDto[];
}

export class UpdateSubjectAdminReqDto extends SaveSubjectAdminReqDto {
  @IsValidNumber({ min: 1 })
  id: number;

  @IsValidArrayObject(
    { minSize: 1, required: true },
    UpdateSubjectDetailAdminReqDto,
  )
  @IsArrayObjUniqueProperty(['lang'])
  subjectDetails: UpdateSubjectDetailAdminReqDto[];
}

export class DeleteSubjectsAdminReqDto {
  @IsValidArrayNumber({ minSize: 1, required: true })
  ids: number[];
}

export class GetListSubjectAdminReqDto extends PaginationReqDto {}

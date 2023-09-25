import { BaseResponseDtoParams } from '../../../../common/dtos/base.res';
import { Language } from '../../../../common/enums/lang.enum';
import { SubjectDetail } from '../../../entities/subject-detail.entity';

export interface SubjectDetailResDtoParams extends BaseResponseDtoParams {
  data: SubjectDetail;
}

export class SubjectDetailResDto {
  id: number;
  lang: Language;
  name: string;

  static mapProperty(
    dto: SubjectDetailResDto,
    { data }: SubjectDetailResDtoParams,
  ) {
    dto.id = data.id;
    dto.lang = data.lang;
    dto.name = data.name;
  }

  static forCustomer(params: SubjectDetailResDtoParams) {
    const { data, resOpts } = params;

    const result = new SubjectDetailResDto();
    if (!data) return null;

    this.mapProperty(result, params);

    return result;
  }

  static forAdmin(params: SubjectDetailResDtoParams) {
    const { data, resOpts } = params;

    if (!data) return null;
    const result = new SubjectDetailResDto();

    this.mapProperty(result, params);

    return result;
  }
}

import { ResOptionDto } from '../../../../common/dtos/base.res';
import { User } from '../../../entities/user.entity';
import { UserType } from '../../../enums/user.enum';
import { AdminResDto } from './admin.res.dto';
//import { CustomerResDto } from './customer.res.dto';

export type UserResDtoParams = {
  data?: User;
  resOpts?: ResOptionDto;
};

export class UserResDto {
  id: number;
  type: UserType;
  // customer: CustomerResDto;
  admin: AdminResDto;

  static mapProperty(dto: UserResDto, params: UserResDtoParams) {
    const { data } = params;
    dto.id = data.id;
    dto.type = data.type;
  }

  static forAdmin(params: UserResDtoParams) {
    const { data, resOpts } = params;

    const result = new UserResDto();
    if (!data) return null;

    this.mapProperty(result, params);

    // result.type = data.type;

    //result.admin = AdminResDto.forAdmin({ data: data.admin });

    return result;
  }
}

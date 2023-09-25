import { BaseResponseDtoParams } from '../../../../common/dtos/base.res';
import { FileResDto } from '../../../../file/dtos/common/res/file.res.dto';
import { Admin } from '../../../entities/admin.entity';
import { AdminStatus } from '../../../enums/admin.enum';
import { UserResDto } from './user.res.dto';

export interface AdminResDtoParams extends BaseResponseDtoParams {
  data: Admin;
}

export class AdminResDto {
  id: number;
  username: string;
  status: AdminStatus;
  name: string;
  avatar: FileResDto;
  user: UserResDto;

  private static mapProperty(dto: AdminResDto, { data }: AdminResDtoParams) {
    dto.id = data.id;
    dto.name = data.name;
    dto.username = data.username;
  }

  static forAdmin(params: AdminResDtoParams) {
    const { data, resOpts } = params;

    if (!data) return null;
    const result = new AdminResDto();

    this.mapProperty(result, params);

    result.status = data.status;
    result.avatar = FileResDto.forAdmin({ data: data.avatar, resOpts });
    result.user = UserResDto.forAdmin({ data: data.user, resOpts });

    return result;
  }

}

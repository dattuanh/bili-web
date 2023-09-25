// import { BaseResponseDtoParams } from '../../../../common/dtos/base.res';
// import { UserGroup } from '../../../entities/user-group.entity';
// import { UserGroupStatus } from '../../../enums/user-group.enum';
// import { UserGroupToUserResDto } from './user-group-to-user.res.dto';

// interface UserGroupResDtoParams extends BaseResponseDtoParams {
//   data: UserGroup;
// }

// export class UserGroupResDto {
//   id: number;
//   name: string;
//   description: string;
//   status: UserGroupStatus;
//   ownerId: number;
//   userGroupToUsers: UserGroupToUserResDto[];

//   static mapProperty(dto: UserGroupResDto, { data }: UserGroupResDtoParams) {
//     dto.id = data.id;
//     dto.name = data.name;
//     dto.description = data.description;
//     dto.status = data.status;
//     dto.ownerId = data.ownerId;
//   }

//   static forMerchant(params: UserGroupResDtoParams) {
//     const { data } = params;

//     if (!data) return null;
//     const result = new UserGroupResDto();

//     this.mapProperty(result, params);

//     result.userGroupToUsers = data.userGroupToUsers?.map((item) =>
//       UserGroupToUserResDto.forMerchant({ data: item }),
//     );

//     return result;
//   }

//   static forAdmin(params: UserGroupResDtoParams) {
//     const { data } = params;

//     if (!data) return null;
//     const result = new UserGroupResDto();

//     this.mapProperty(result, params);

//     result.userGroupToUsers = data.userGroupToUsers?.map((item) =>
//       UserGroupToUserResDto.forMerchant({ data: item }),
//     );

//     return result;
//   }
// }

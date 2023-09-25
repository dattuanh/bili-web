// import { BaseResponseDtoParams } from '../../../../common/dtos/base.res';
// import { UserGroupToUser } from '../../../entities/user-group-to-user.entity';

// interface UserGroupToUserResDtoParams extends BaseResponseDtoParams {
//   data: UserGroupToUser;
// }

// export class UserGroupToUserResDto {
//   id: number;
//   userGroupId: number;
//   userId: number;

//   static mapProperty(
//     dto: UserGroupToUserResDto,
//     { data }: UserGroupToUserResDtoParams,
//   ) {
//     dto.id = data.id;
//     dto.userGroupId = data.userGroupId;
//     dto.userId = data.userId;
//   }

//   static forMerchant(params: UserGroupToUserResDtoParams) {
//     const { data } = params;

//     if (!data) return null;
//     const result = new UserGroupToUserResDto();

//     this.mapProperty(result, params);
//     return result;
//   }
// }

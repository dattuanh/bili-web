// import { Injectable } from '@nestjs/common';
// import { paginate, Pagination } from 'nestjs-typeorm-paginate';
// import { In, IsNull, Not } from 'typeorm';
// import { Transactional } from 'typeorm-transactional';
// // import { UserToGroupPolicy } from '../../../casl/entities/user-to-group-policy.entity';
// // import { GroupPolicyRepository } from '../../../casl/repositories/group-policy.repository';
// // import { UserToGroupPolicyRepository } from '../../../casl/repositories/user-to-group-policy.repository';
// import { DeleteMultipleByIdNumberReqDto } from '../../../common/dtos/delete-multiple.dto';
// import {
//   ExpectationFailedExc,
//   NotFoundExc,
// } from '../../../common/exceptions/custom.exception';
// import { EncryptService } from '../../../utils/services/encrypt.service';
// import {
//   CreateAdminReqDto,
//   ListAdminReqDto,
//   UpdateAdminReqDto,
// } from '../../dtos/admin/req/admin.admin.req.dto';
// import { AdminResDto } from '../../dtos/common/res/admin.res.dto';
// import { User } from '../../entities/user.entity';
// import { AdminStatus } from '../../enums/admin.enum';
// import { UserType } from '../../enums/user.enum';
// import { AdminRepository } from '../../repositories/admin.repository';
// import { UserRepository } from '../../repositories/user.repository';

// @Injectable()
// export class AdminAdminService {
//   constructor(
//     private adminRepo: AdminRepository,
//     private userRepo: UserRepository,
//     // private groupPolicyRepo: GroupPolicyRepository,
//     // private userToGroupPolicyRepo: UserToGroupPolicyRepository,
//     private encryptService: EncryptService,
//   ) {}

//   async getList(dto: ListAdminReqDto, user: User) {
//     const { limit, page, status } = dto;
//     let { searchText } = dto;

//     console.log(user);

//     const queryBuilder = this.adminRepo
//       .createQueryBuilder('admin')
//       .orderBy('admin.id')
//       .where('admin.userId != :userId', { userId: user.id });

//     if (searchText) {
//       searchText = `%${searchText}%`;
//       queryBuilder.where('admin.username ILIKE :searchText', { searchText });
//     }

//     if (status) queryBuilder.where('admin.status = :status', { status });

//     const { items, meta } = await paginate(queryBuilder, { page, limit });

//     const admins = items.map((item) => AdminResDto.forAdmin({ data: item }));
//     return new Pagination(admins, meta);
//   }

//   async getDetail(id: number, user: User) {
//     const admin = await this.adminRepo.findOne({
//       where: { id, userId: Not(user.id) },
//       relations: { user: true },
//     });

//     if (!admin) throw new NotFoundExc({ message: 'auth.admin.adminNotFound' });
//     return AdminResDto.forAdmin({ data: admin });
//   }

//   // @Transactional()
//   // async create(dto: CreateAdminReqDto, currentUser: User) {
//   //   const { username, password, groupPolicyIds } = dto;
//   //   const encryptedPassword = this.encryptService.encryptText(password);

//   //   const user = await this.userRepo.save({ type: UserType.ADMIN });

//   //   await Promise.all(
//   //     groupPolicyIds.map(async (item) => {
//   //       const groupPolicy =
//   //         await this.groupPolicyRepo.findOneByOrThrowNotFoundExc({
//   //           id: item,
//   //         });

//   //       await this.userToGroupPolicyRepo.save({
//   //         groupPolicy,
//   //         user,
//   //       });
//   //     }),
//   //   );

//   //   const admin = this.adminRepo.create({
//   //     username,
//   //     password: encryptedPassword,
//   //     user,
//   //     status: AdminStatus.ACTIVE,
//   //   });
//   //   await this.adminRepo.save(admin);

//   //   return this.getDetail(admin.id, currentUser);
//   // }

//   @Transactional()
//   async update(dto: UpdateAdminReqDto, user: User) {
//     const { adminId, status, groupPolicyIds } = dto;

//     let admin = await this.adminRepo.findOne({
//       where: { id: adminId, userId: Not(user.id) },
//       relations: { user: true },
//     });
//     if (!admin) throw new NotFoundExc({ message: 'auth.admin.adminNotFound' });

//     admin = { ...admin, status };

//     await Promise.all([
//       this.adminRepo.save(admin),
//     ]);

//     return this.getDetail(admin.id, user);
//   }

//   @Transactional()
//   async deleteList(dto: DeleteMultipleByIdNumberReqDto, user: User) {
//     const { ids } = dto;
//     const { affected } = await this.adminRepo.softDelete({
//       id: In(ids),
//       userId: Not(user.id),
//       deletedAt: IsNull(),
//     });

//     if (affected !== ids.length)
//       throw new ExpectationFailedExc({
//         message: 'auth.common.deleteMultipleError',
//       });
//   }

//   @Transactional()
//   async deleteSingle(id: number, user: User) {
//     const { affected } = await this.adminRepo.softDelete({
//       id,
//       userId: Not(user.id),
//     });
//     if (!affected)
//       throw new NotFoundExc({ message: 'auth.admin.adminNotFound' });
//   }

//   // private async updateAdminToGroupPolicies(
//   //   user: User,
//   //   groupPolicyIds: number[],
//   // ) {
//   //   const removeUserGroupPolicies: UserToGroupPolicy[] = [];
//   //   const addUserGroupPolicies: UserToGroupPolicy[] = [];

//   //   user.userToGroupPolicies.filter((item) => {
//   //     const isExisted = groupPolicyIds.includes(item.groupPolicyId);
//   //     if (isExisted) return true;

//   //     removeUserGroupPolicies.push(item);
//   //     return false;
//   //   });

//   //   groupPolicyIds.forEach((groupPolicyId) => {
//   //     const isExisted = user.userToGroupPolicies.some(
//   //       (item) => item.groupPolicyId === groupPolicyId,
//   //     );
//   //     if (isExisted) return;

//   //     const userGroupPolicy = this.userToGroupPolicyRepo.create({
//   //       groupPolicyId,
//   //       userId: user.id,
//   //     });
//   //     addUserGroupPolicies.push(userGroupPolicy);
//   //     user.userToGroupPolicies.push(userGroupPolicy);
//   //   });

//   //   await Promise.all([
//   //     this.userToGroupPolicyRepo.softRemove(removeUserGroupPolicies),
//   //     this.userToGroupPolicyRepo.save(addUserGroupPolicies),
//   //   ]);
//   // }
// }

// import {
//   Column,
//   Entity,
//   JoinColumn,
//   ManyToOne,
//   OneToMany,
//   PrimaryGeneratedColumn,
// } from 'typeorm';
// import { User } from '../../auth/entities/user.entity';
// import { BaseEntity } from '../../common/entities/base.entity';
// import { UserGroupStatus } from '../enums/user-group.enum';
// import { UserGroupToUser } from './user-group-to-user.entity';

// @Entity({ name: 'user_group' })
// export class UserGroup extends BaseEntity {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   name: string;

//   @Column()
//   description: string;

//   @Column({ type: 'enum', enum: UserGroupStatus })
//   status: UserGroupStatus;

//   // join merchant user id
//   @Column({ name: 'owner_id' })
//   ownerId: number;

//   @ManyToOne(() => User, (user) => user.userGroups, { persistence: false })
//   @JoinColumn({ name: 'owner_id' })
//   owner: User;
//   //end join merchant user id

//   @OneToMany(
//     () => UserGroupToUser,
//     (userGroupToUser) => userGroupToUser.userGroup,
//   )
//   userGroupToUsers: UserGroupToUser[];

// }

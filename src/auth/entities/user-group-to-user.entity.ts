import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { BaseEntity } from '../../common/entities/base.entity';
import { UserGroup } from './user-group.entity';

@Entity({ name: 'user_group_to_user' })
export class UserGroupToUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // join userGroup
  @Column()
  userGroupId: number;

  @ManyToOne(() => UserGroup, (userGroup) => userGroup.userGroupToUsers, {
    persistence: false,
  })
  @JoinColumn()
  userGroup: UserGroup;
  //end join userGroup

  // join customer user id
  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.userGroupToUsers, {
    persistence: false,
  })
  @JoinColumn()
  user: User;
  //end join customer user id
}

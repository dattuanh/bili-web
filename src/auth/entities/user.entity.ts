import { BaseEntity } from 'src/common/entities/base.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { File } from '../../file/entities/file.entity';
import { News } from '../../news/entities/news.entity';
import { Subject } from '../../subject/entities/subject.entity';
import { UserType } from '../enums/user.enum';
import { Admin } from './admin.entity';
// import { UserGroupToUser } from './user-group-to-user.entity';
// import { UserGroup } from './user-group.entity';

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: UserType })
  type: UserType;

  @OneToOne(() => Admin, (admin) => admin.user, { persistence: false })
  admin: Admin;

  @OneToMany(() => File, (file) => file.uploader, { persistence: false })
  files: File[];

  // @OneToMany(() => UserGroupToUser, (userGroupToUse) => userGroupToUse.user, {
  //   persistence: false,
  // })
  // userGroupToUsers: UserGroupToUser[];

  // @OneToMany(() => UserGroup, (userGroup) => userGroup.owner, {
  //   persistence: false,
  // })
  // userGroups: UserGroup[];

  @OneToMany(() => News, (n) => n.owner, { persistence: false })
  news: News[];

  @OneToMany(() => Subject, (s) => s.owner, { persistence: false })
  subjects: Subject[];

}

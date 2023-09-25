import { BaseEntity } from 'src/common/entities/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UniqueWithSoftDelete } from '../../common/decorators/typeorm.decorator';
import { File } from '../../file/entities/file.entity';
import { AdminStatus } from '../enums/admin.enum';
import { User } from './user.entity';

@Entity('admin')
export class Admin extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @UniqueWithSoftDelete()
  username: string;

  @Column({ select: false })
  password: string;

  @Column({ enum: AdminStatus, type: 'enum' })
  status: AdminStatus;

  @Column({ length: 255, nullable: true })
  name: string;

  // Join file
  @Column({ nullable: true })
  avatarId: number;

  @ManyToOne(() => File, { persistence: false })
  @JoinColumn({ name: 'avatar_id' })
  avatar: File;
  // End join file

  // Join user
  @Column({ name: 'user_id' })
  userId: number;

  @OneToOne(() => User, (user) => user.admin, { persistence: false })
  @JoinColumn({ name: 'user_id' })
  user: User;
  // End join user
}

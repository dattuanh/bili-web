import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { UniqueWithSoftDelete } from '../../common/decorators/typeorm.decorator';
import { BaseEntityWithoutUpdate } from '../../common/entities/base.entity';
import { ConstraintName } from '../../common/enums/constraint-name.enum';
import { SupportFileType } from '../../common/enums/file.enum';
import { NewsToFile } from '../../news/entities/news-to-file.entity';

@Entity('file')
@Check(
  ConstraintName.CHECK_ONE_OF_KEY_OR_URL,
  `
  (
    COALESCE((key IS NOT NULL)::INTEGER, 0)
    +
    COALESCE((url IS NOT NULL)::INTEGER, 0)
  ) = 1
  `,
)
export class File extends BaseEntityWithoutUpdate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  @UniqueWithSoftDelete()
  key: string;

  @Column({ nullable: true })
  url: string;

  @Column({ enum: SupportFileType })
  type: SupportFileType;

  @Column({ default: 0 })
  size: number;

  // Join user
  @Column({ name: 'uploader_id' })
  uploaderId: number;

  @ManyToOne(() => User, (user) => user.files, { persistence: false })
  @JoinColumn({ name: 'uploader_id' })
  uploader: User;
  // End join user

  @OneToOne(() => NewsToFile, (news) => news.thumbnail, { persistence: false })
  newsToFile: NewsToFile;
}

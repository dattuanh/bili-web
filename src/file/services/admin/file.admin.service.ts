import { PutObjectCommand, PutObjectRequest, S3 } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { Transactional } from 'typeorm-transactional';
import { User } from '../../../auth/entities/user.entity';
import { AppConfig } from '../../../common/config/app.config';
import { MapFilePathSupport } from '../../../common/constants/global.constant';
import { EventEmitterName } from '../../../common/enums/event.enum';
import { InternalServerErrorExc } from '../../../common/exceptions/custom.exception';
import { UuidService } from '../../../utils/services/uuid.service';
import { PresignedUrlReqDto } from '../../dtos/common/req/presigned-url.req.dto';
import { PresignedUrlResDto } from '../../dtos/common/res/presigned-url.res.dto';
import { FileRepository } from '../../repositories/file.repository';
import { SupportFileType } from '../../../common/enums/file.enum';

@Injectable()
export class FileAdminService {
  private s3Client: S3;
  constructor(
    private fileRepo: FileRepository,
    private configService: ConfigService<AppConfig>,
    private uuidService: UuidService,
  ) {
    this.s3Client = new S3({
      credentials: {
        accessKeyId: configService.getOrThrow('aws.accessKeyId'),
        secretAccessKey: configService.getOrThrow('aws.accessKeySecret'),
      },
      region: configService.getOrThrow('aws.region'),
    });
  }

  @OnEvent(EventEmitterName.CUSTOMER_DELETED)
  @Transactional()
  async deleteFileWhenCustomerDeleted(user: User) {
    await Promise.all([this.fileRepo.softDelete({ uploaderId: user.id })]);
  }

  async createPresignUrl(
    dto: PresignedUrlReqDto,
    user: User,
  ): Promise<PresignedUrlResDto> {
    const { type } = dto;

    // Check if type is in name folder, We need to check type, to detect file from image/video/pdf
    const fileType = MapFilePathSupport.find((obj) => obj.types.includes(type));
    if (!fileType) throw new InternalServerErrorExc({ message: 'common' });

    // generate unique file name
    const key = this.genFileKey(fileType.key, user.id, type);

    const file = this.fileRepo.create({
      key: key,
      size: 0,
      type,
      uploaderId: user.id,
    });
    await this.fileRepo.save(file);

    const bucket = this.configService.getOrThrow('aws.s3.bucketName');

    // define the S3 location
    const command = new PutObjectCommand({ Bucket: bucket, Key: key });

    const presignedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 3600,
    });

    return PresignedUrlResDto.forAdmin({ file, presignedUrl });
  }

  @Transactional()
  async uploadFile(
    data: PutObjectRequest['Body'],
    type: SupportFileType,
    userId: number,
    fileName?: string,
  ) {
    const fileType = MapFilePathSupport.find((obj) => obj.types.includes(type));
    const key = this.genFileKey(fileType.key, userId, type, fileName);

    const file = this.fileRepo.create({ key, type, uploaderId: userId });
    await this.fileRepo.save(file);

    const command = new PutObjectCommand({
      Bucket: this.configService.get('aws.s3.bucketName'),
      Key: key,
      Body: data,
    });

    await this.s3Client.send(command);

    return file;
  }

  private genFileKey(
    fileType: string,
    userId: number,
    type: string,
    fileName?: string,
  ) {
    const randomStr = this.uuidService.genRandomStr();
    if (fileName) {
      return `${fileType}/${userId}/${randomStr}/${fileName}.${type}`;
    }
    return `${fileType}/${userId}/${randomStr}.${type}`;
  }
}

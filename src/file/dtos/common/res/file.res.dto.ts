import { BaseResponseDtoParams } from '../../../../common/dtos/base.res';
import { SupportFileType } from '../../../../common/enums/file.enum';
import { File } from '../../../entities/file.entity';
import { S3ResizeImageDataIntDto } from '../../int/s3-resize-image-data.int.dto';

export interface FileResDtoParams extends BaseResponseDtoParams {
  data: File;
}

export class FileResDto {
  id: number;
  key: string;
  type: SupportFileType;
  size: number;
  uploaderId: number;
  url: string;

  static mapProperty(dto: FileResDto, { data, resOpts }: FileResDtoParams) {
    dto.id = data.id;
    dto.key = data.key;
    dto.type = data.type;
    dto.url = data.url;

    if (!resOpts?.fileOpts) return;

    const resizeData = S3ResizeImageDataIntDto.default(
      { bucket: resOpts.fileOpts.bucket, key: data.key },
      { height: resOpts.fileOpts.height, width: resOpts.fileOpts.width },
    );
    const base64Data = Buffer.from(JSON.stringify(resizeData)).toString(
      'base64',
    );

    dto.url = `${resOpts.fileOpts.s3Domain}/${base64Data}`;
  }

  static forCustomer(params: FileResDtoParams) {
    const { data } = params;

    if (!data) return null;
    const result = new FileResDto();

    this.mapProperty(result, params);

    return result;
  }

  static forAdmin(params: FileResDtoParams) {
    const { data } = params;

    const result = new FileResDto();
    if (!data) return null;

    this.mapProperty(result, params);

    result.size = data.size;
    result.uploaderId = data.uploaderId;

    return result;
  }
}

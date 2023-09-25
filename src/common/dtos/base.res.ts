import { IMAGE_SIZE } from '../constants/response.constant';

export interface BaseResponseDtoParams {
  resOpts?: ResOptionDto;
}

interface ResOptionDtoParams {
  bucket: string;
  s3Domain: string;
  imageSizeKey: keyof typeof IMAGE_SIZE;
}

export class ResOptionDto {
  fileOpts: { width: number; height: number; bucket: string; s3Domain: string };

  static mapProperty(
    dto: ResOptionDto,
    { bucket, imageSizeKey, s3Domain }: ResOptionDtoParams,
  ) {
    dto.fileOpts = {
      height: IMAGE_SIZE[imageSizeKey].height,
      width: IMAGE_SIZE[imageSizeKey].width,
      bucket,
      s3Domain,
    };
  }

  static forMobileList({
    bucket,
    s3Domain,
  }: Omit<ResOptionDtoParams, 'imageSizeKey'>) {
    const result = new ResOptionDto();

    this.mapProperty(result, { bucket, s3Domain, imageSizeKey: 'MD' });
    return result;
  }

  static forMobileDetail({
    bucket,
    s3Domain,
  }: Omit<ResOptionDtoParams, 'imageSizeKey'>) {
    const result = new ResOptionDto();

    this.mapProperty(result, { bucket, s3Domain, imageSizeKey: 'MD' });
    return result;
  }

  static forCustom(params: ResOptionDtoParams) {
    const { bucket, s3Domain, imageSizeKey } = params;

    const result = new ResOptionDto();

    this.mapProperty(result, { bucket, s3Domain, imageSizeKey });
    return result;
  }
}

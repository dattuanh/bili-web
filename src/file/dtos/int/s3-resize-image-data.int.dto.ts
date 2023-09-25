export class S3ResizeImageDataIntDto {
  bucket: string;
  key: string;
  edits: {
    resize: {
      width: number;
      height: number;
      fit: 'fill' | 'cover' | 'contain' | 'inside' | 'outside';
    };
  };

  static default(
    fileData: Omit<S3ResizeImageDataIntDto, 'edits'>,
    size: { width: number; height: number },
  ) {
    const { bucket, key } = fileData;
    const { height, width } = size;

    const result = new S3ResizeImageDataIntDto();
    result.bucket = bucket;
    result.key = key;
    result.edits = { resize: { height, width, fit: 'fill' } };

    return result;
  }
}

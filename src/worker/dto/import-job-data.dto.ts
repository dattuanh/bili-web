import { NonFunctionProperties } from '../../common/types/utils.type';

export class ImportJobDataDto {
  requestImportId: number;

  constructor({ requestImportId }: NonFunctionProperties<ImportJobDataDto>) {
    this.requestImportId = requestImportId;
  }
}

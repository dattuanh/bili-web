import { Column, ColumnOptions, Index, IndexOptions } from 'typeorm';
import { DecimalColumnTransformer } from '../helpers/typeorm.helper';

export function ColumnString(options?: ColumnOptions): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    Column({
      ...options,
      nullable: options?.nullable || false,
      length: options?.length || 255,
    })(target, propertyKey);
  };
}

export function ColumnDate(options?: ColumnOptions): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    Column({
      ...options,
      nullable: options?.nullable || false,
      type: 'timestamptz',
    })(target, propertyKey);
  };
}

export function UniqueWithSoftDelete(
  softDeletePropertyKey = 'deleted_at',
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    Index({ unique: true, where: `${softDeletePropertyKey} is null` })(
      target,
      propertyKey,
    );
  };
}

export function PartialIndexWithSoftDelete(
  fields: string[],
  options: Omit<IndexOptions, 'where'>,
  softDeletePropertyKey = 'deleted_at',
): ClassDecorator {
  return function (target: any): void {
    Index(fields, { ...options, where: `${softDeletePropertyKey} is null` })(
      target,
    );
  };
}

export function DecimalColumn({
  precision,
  scale,
  name,
  ...other
}: ColumnOptions) {
  return function (target: any, propertyKey: string | symbol): void {
    Column({
      ...other,
      type: 'decimal',
      precision,
      scale,
      name,
      transformer: new DecimalColumnTransformer(),
    })(target, propertyKey);
  };
}

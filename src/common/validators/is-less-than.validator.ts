import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { isNullOrUndefined } from '../utils';

export function IsLessThan(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsLessThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [propertyToCompare] = args.constraints;
          const valueToCompare = (args.object as any)[propertyToCompare];

          if (isNullOrUndefined(valueToCompare)) return true;

          return value < valueToCompare;
        },
        defaultMessage(args: ValidationArguments) {
          return `${propertyName} must less than ${property}`;
        },
      },
    });
  };
}

export function IsNumberLessThanOrEqual(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsNumberLessThanOrEqual',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [propertyToCompare] = args.constraints;
          const valueToCompare = (args.object as any)[propertyToCompare];

          if (typeof value !== 'number' || typeof valueToCompare !== 'number')
            return false;

          return value <= valueToCompare;
        },
        defaultMessage(args: ValidationArguments) {
          return `${propertyName} must less than or equal ${property}`;
        },
      },
    });
  };
}

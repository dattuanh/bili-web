import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsAfter(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsAfter',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const valueToCompare = (args.object as any)[property];

          return value > valueToCompare;
        },
        defaultMessage(args: ValidationArguments) {
          return `${propertyName} must less than ${property}`;
        },
      },
    });
  };
}

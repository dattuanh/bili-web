import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

type IsArrayMatchConstraintParams = {
  fieldName: string;
  validationOptions?: ValidationOptions;
  errorIfEmpty?: boolean;
  handler: (items: any[], field: any) => boolean;
};

export function IsArrayMatchConstraint({
  fieldName,
  errorIfEmpty = true,
  validationOptions,
  handler,
}: IsArrayMatchConstraintParams) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsArrayMatchConstraint',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!Array.isArray(value)) return false;

          if (value.length === 0) return errorIfEmpty ? false : true;

          const property = args.object[fieldName];
          return handler(value, property);
        },
        defaultMessage(args: ValidationArguments) {
          return `${propertyName} does not contain ${fieldName}`;
        },
      },
    });
  };
}

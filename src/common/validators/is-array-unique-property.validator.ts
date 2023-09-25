import { BadRequestException } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { get } from '../utils';

/**
 * @param properties List object's property to check unique
 */
export function IsArrayObjUniqueProperty(
  properties: string[],
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsArrayObjUniquePropertyValidator',
      target: object.constructor,
      propertyName: propertyName,
      constraints: properties,
      options: validationOptions,
      validator: {
        validate(
          data: Record<any, any>[],
          validationArguments?: ValidationArguments,
        ): boolean {
          const constraints = validationArguments?.constraints as string[];

          if (!Array.isArray(data))
            throw new BadRequestException(
              'IsArrayObjUniquePropertyValidator must be used on array',
            );

          if (!constraints?.length)
            throw new BadRequestException(
              'Property to check unique must be supply',
            );

          for (const constraint of constraints) {
            const list: any[] = [];

            for (const item of data) {
              const value = item[constraint];

              if (!value) {
                console.log(`wrong properties on IsArrayObjUniqueProperty`);
              }

              if (list.includes(item[constraint])) return false;

              list.push(item[constraint]);
            }
          }

          return true;
        },

        defaultMessage(validationArguments?: ValidationArguments): string {
          const property = validationArguments?.property || '<unknown>';
          const constraints = validationArguments?.constraints;

          return `Duplicate ${constraints[0]} on ${property}`;
        },
      },
    });
  };
}

/**
 * Check some unique object in an array. Exp: 
    ```
    let a = [
      { lang: 'a', color: 'red', size: 'M' },
      { lang: 'a', color: 'red', size: 'L' },
    ]
    ``` 
    ==> Validate fail if 
    ```
    options = [{ properties: ['lang', 'color'] }]
    ```
    But succeed if 
    ```
    options = [{ properties: ['lang', 'color', 'size'] }]
    ```
 */
export function IsArrayObjUniquePropertyV2(
  options: IsArrayObjUniquePropertyV2Options,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsArrayObjUniquePropertyValidatorV2',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(data: Record<any, any>[]): boolean {
          if (!Array.isArray(data))
            throw new BadRequestException(
              'IsArrayObjUniquePropertyValidatorV2 must be used on array',
            );

          if (!options?.length)
            throw new BadRequestException(
              'Property to check unique must be supply',
            );

          for (const option of options) {
            const existingValues: any[] = [];

            for (const dataItem of data) {
              for (const existingValue of existingValues) {
                let isExisted = true;

                for (const propertyPath of option.propertyPaths) {
                  if (
                    get(existingValue, propertyPath) !==
                    get(dataItem, propertyPath)
                  ) {
                    isExisted = false;
                    break;
                  }
                }

                if (isExisted) return false;
              }

              existingValues.push(dataItem);
            }
          }

          return true;
        },

        defaultMessage(validationArguments?: ValidationArguments): string {
          const property = validationArguments?.property || '<unknown>';
          const constraints = validationArguments?.constraints;

          return `Duplicate ${constraints[0]} on ${property}`;
        },
      },
    });
  };
}

export type IsArrayObjUniquePropertyV2Options = Array<{
  propertyPaths: string[];
}>;

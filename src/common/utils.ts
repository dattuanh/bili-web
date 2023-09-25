import { parsePhoneNumber } from 'awesome-phonenumber';
import crypto from 'crypto';
import { DeepReadonly } from 'ts-essentials';
import { ALPHABET_NUMERIC_CHARSET } from './constants/global.constant';
import secureRandom = require('random-number-csprng');

/**
 * Fisher-Yates Shuffle.
 * Warning: Array input will be restructured randomly
 */
export const shuffle = <T = any>(array: T[]) => {
  let currentIndex = array.length;
  let randomIndex: number;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    const temp = array[randomIndex];
    array[randomIndex] = array[currentIndex];
    array[currentIndex] = temp;
  }

  return array;
};

/**
 * Generate random number in range, inclusive min and max
 */
export const genSecureRandomNumber = (min: number, max: number) => {
  return secureRandom(min, max);
};

/**
 * Generate random number in range, inclusive min, exclusive max
 */
export function genRandomNumber(min: number, max: number, isDecimal?: boolean) {
  let result = Math.random() * (max - min) + min;
  if (!isDecimal) result = Math.floor(result);
  return result;
}

export function getCurrentUnixTimestamp(date?: Date) {
  if (date) {
    return Math.floor(date.valueOf() / 1000);
  } else {
    return Math.floor(Date.now() / 1000);
  }
}

/**
 * @param amount amount number to generate
 * @param min lower limit, inclusive
 * @param max upper limit, exclusive
 * @returns list of random unique numbers
 */
export function genListUniqueRandomNumber(
  params: GenListUniqueRandomNumberParams,
) {
  const { amount, min, max } = params;
  let { maxRetryTime } = params;

  if (!maxRetryTime) maxRetryTime = amount + 1000;
  const result = new Set<number>();

  for (let i = 0; i < maxRetryTime; i++) {
    const randomNumb = genRandomNumber(min, max, false);
    result.add(randomNumb);
    if (result.size == amount) break;
    if (result.size > amount)
      throw new Error(`result size is greater than amount`);
  }

  return result;
}

export const camelToSnakeCase = (str: string) => {
  return (
    str[0].toLowerCase() +
    str.slice(1).replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
  );
};

export function isNullOrUndefined(obj: any) {
  if (typeof obj === 'undefined' || obj === null) return true;
  return false;
}

export function getPhoneE164(
  phone: string,
  regionCode = 'VN',
): string | undefined {
  const phoneNumber = parsePhoneNumber(phone, { regionCode });

  return phoneNumber.possible ? phoneNumber.number.e164 : undefined;
}

/**
 * Synchronize sortArr's order to originArr's order in-place
 */
export function syncArrayPos(
  originArr: object[],
  sortArr: object[],
  field = 'id',
) {
  sortArr.sort((a, b) =>
    originArr.findIndex((item) => item[field] === a[field]) <
    originArr.findIndex((item) => item[field] === b[field])
      ? -1
      : 1,
  );
}

// Split array to smaller arrays
// Exp: [1,2,3,4] => [ [1,2] , [3,4] ]
export function chunk<T = any>(input: DeepReadonly<T[]>, size: number): T[][] {
  return input.reduce((arr, item, idx) => {
    return idx % size === 0
      ? [...arr, [item]]
      : [...arr.slice(0, -1), [...arr.slice(-1)[0], item]];
  }, []);
}

export function tryParseJson(json: string) {
  try {
    return JSON.parse(json);
  } catch (error) {
    return json;
  }
}

export function randomEnum<T>(_enum: T): T[keyof T] {
  const enumValues = Object.values(_enum) as unknown as T[keyof T][];
  const randomIndex = Math.floor(Math.random() * enumValues.length);
  return enumValues[randomIndex];
}

export function genRandomAlphabetToken(bytes = 48) {
  return crypto.randomBytes(bytes).toString('base64').replace(/\W/g, '');
}

export function randomArray<T>(arr: T[]) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

// Mã hoá chuỗi thành Base64
export function encodeStringToBase64(str: string): string {
  const buffer = Buffer.from(str);
  return buffer.toString('base64');
}

// Giải mã chuỗi từ Base64
export function decodeBase64ToString(base64Str: string): string {
  const buffer = Buffer.from(base64Str, 'base64');
  return buffer.toString();
}

export function genRandomAlphabetNumeric(size: number): string {
  let result = '';
  const charsetLength = ALPHABET_NUMERIC_CHARSET.length;

  for (let i = 0; i < size; i++) {
    const idx = Math.floor(Math.random() * charsetLength);
    result += ALPHABET_NUMERIC_CHARSET[idx];
  }

  return result;
}

/**
 * @param obj Object to get property from
 * @param path Path of property. Exp: color[0].hex.text
 * @param defaultValue Default value if property value is invalid. Exp: #fff
 * @returns Property value
 */
export const get = <T = any>(
  obj: object,
  path: string,
  defaultValue?: T,
): T => {
  const travel = (regexp: RegExp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce(
        (res: object, key: string) =>
          res !== null && res !== undefined ? res[key] : res,
        obj,
      );
  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
  return result === undefined || result === obj ? defaultValue : result;
};

/**
 * @param time Time to pause, in miliseconds
 */
export const sleep = async (time: number) => {
  return new Promise<void>((res) => {
    setTimeout(res, time);
  });
};

type GenListUniqueRandomNumberParams = {
  amount: number;
  min: number;
  max: number;
  maxRetryTime?: number;
};

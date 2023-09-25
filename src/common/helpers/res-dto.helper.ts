import { Language } from '../enums/lang.enum';

/**
 *
 * @param langs List of language to get item. Precedent by array index
 * @param items list item
 * @returns Item
 * @example findItemByLanguage([Lang.VN], [{a: 1, lang: EN}, {b: 2, lang: VN}]) = {b: 2, lang: VN}
 */
export const findItemByLanguage = <T extends { lang: Language }>(
  langs: Language[],
  items: T[],
): T => {
  const result: T[] = [];

  for (const item of items) {
    const idx = langs.find((lang) => lang === item.lang);
    if (!idx) continue;

    result[idx] = item;
  }

  for (const item of result) {
    if (item) return item;
  }

  return items?.[0];
};

import { DayOfWeek, MapDayOfWeekToDayjs } from '../enums/date-type.enum';

/**
 * sort in place
 */
export const sortDayOfWeek = (
  dayOfWeeks: DayOfWeek[],
  type: 'ASC' | 'DESC' = 'ASC',
) => {
  dayOfWeeks.sort((item1, item2) => {
    if (type === 'ASC') {
      return MapDayOfWeekToDayjs[item1] > MapDayOfWeekToDayjs[item2] ? 1 : -1;
    } else {
      return MapDayOfWeekToDayjs[item1] > MapDayOfWeekToDayjs[item2] ? -1 : 1;
    }
  });
};

/**
 * sort in place
 */
export const sortDayOfMonth = (
  dayOfMonths: number[],
  type: 'ASC' | 'DESC' = 'ASC',
) => {
  dayOfMonths.sort((item1, item2) => {
    if (type === 'ASC') {
      return item1 > item2 ? 1 : -1;
    } else {
      return item1 > item2 ? -1 : 1;
    }
  });
};

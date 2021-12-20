export interface Timestamp {
  date: string;
  time: string;
  year: number;
  month: number;
  day: number;
  weekday: number;
  hour: number;
  minute: number;
  doy: number;
  workweek: number;
  hasDay: boolean;
  hasTime: boolean;
  past: boolean;
  current: boolean;
  future: boolean;
  disabled: boolean;
}

export type TimestampArray = Timestamp[]
export type TimestampOrNull = Timestamp | null

export type TimestampFormatter = (timestamp: Timestamp, short: boolean) => string;
export type TimestampFormatOptions = (timestamp: Timestamp, short: boolean) => TimestampFormatter;
export type TimestampMoveOperation = (timestamp: Timestamp) => Timestamp;

export interface TimeObject {
  hour: number,
  minute: number
}

export type TimeObjectOrNumberOrString = TimeObject | number | string

export interface AddToDateOptions {
  year?: number | string,
  month?: number | string,
  day?: number | string,
  hour?: number | string,
  minute?: number | string,
}

export interface WeekdayFormatter {
  weekday: string,
  type?: string,
  locale?: string
}

export interface MonthFormatter {
  month: number,
  type?: string,
  locale?: string
}

export interface ColumnObject {
  id?: number | string,
  key?: number | string
}

export type ColumnObjectArray = ColumnObject[]

export interface ResourceObject {
  label?: string,
  height?: number,
  expanded?: boolean,
  children?: ResourceObjectArray
}

export type ResourceObjectArray = ResourceObject[]

export interface TaskObject {
  label?: string,
  height?: number,
  expanded?: boolean,
  children?: TaskObjectArray
}

export type TaskObjectArray = TaskObject[]

export interface TitleObject {
  label?: string
}

export type TitleObjectArray = TitleObject[]

export interface FooterObject {
  label?: string
}

export type FooterObjectArray = FooterObject[]


export type NumberArray = number[]
export type StringArray = string[]

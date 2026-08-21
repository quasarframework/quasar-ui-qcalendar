import type { CalendarSystem } from '@timestamp-js/core'
import { hebrewCalendar } from '@timestamp-js/calendar-hebrew'
import { islamicCivilCalendar } from '@timestamp-js/calendar-islamic'
import { persianCalendar } from '@timestamp-js/calendar-persian'
import { indianNationalCalendar } from '@timestamp-js/calendar-saka'

export interface CalendarAdapterCase {
  name: string
  calendar: CalendarSystem
  nativeDate: string
  previousDate: string
  nextDate: string
  monthStart: string
  monthEnd: string
  nextMonthStart: string
  weekStart: string
  weekEnd: string
  gregorianDate: string
  epochDay: number
  locale: string
  direction: 'ltr' | 'rtl'
  weekdays: readonly number[]
  monthLabel: string
  localizedMonthLabel: string
}

export const calendarAdapterCases: readonly CalendarAdapterCase[] = [
  {
    name: 'Islamic Civil',
    calendar: islamicCivilCalendar,
    nativeDate: '1445-09-01',
    previousDate: '1445-08-29',
    nextDate: '1445-09-02',
    monthStart: '1445-09-01',
    monthEnd: '1445-09-30',
    nextMonthStart: '1445-10-01',
    weekStart: '1445-08-28',
    weekEnd: '1445-09-05',
    gregorianDate: '2024-03-11',
    epochDay: 19793,
    locale: 'ar',
    direction: 'rtl',
    weekdays: [6, 0, 1, 2, 3, 4, 5],
    monthLabel: 'Ramadan',
    localizedMonthLabel: 'رمضان',
  },
  {
    name: 'Indian National',
    calendar: indianNationalCalendar,
    nativeDate: '1946-01-01',
    previousDate: '1945-12-30',
    nextDate: '1946-01-02',
    monthStart: '1946-01-01',
    monthEnd: '1946-01-31',
    nextMonthStart: '1946-02-01',
    weekStart: '1945-12-27',
    weekEnd: '1946-01-03',
    gregorianDate: '2024-03-21',
    epochDay: 19803,
    locale: 'hi-IN',
    direction: 'ltr',
    weekdays: [0, 1, 2, 3, 4, 5, 6],
    monthLabel: 'Chaitra',
    localizedMonthLabel: 'चैत्र',
  },
  {
    name: 'Hebrew',
    calendar: hebrewCalendar,
    nativeDate: '5785-01-01',
    previousDate: '5784-13-29',
    nextDate: '5785-01-02',
    monthStart: '5785-01-01',
    monthEnd: '5785-01-30',
    nextMonthStart: '5785-02-01',
    weekStart: '5784-13-26',
    weekEnd: '5785-01-03',
    gregorianDate: '2024-10-03',
    epochDay: 19999,
    locale: 'he-IL',
    direction: 'rtl',
    weekdays: [0, 1, 2, 3, 4, 5, 6],
    monthLabel: 'Tishri',
    localizedMonthLabel: 'תשרי',
  },
  {
    name: 'Persian',
    calendar: persianCalendar,
    nativeDate: '1403-01-01',
    previousDate: '1402-12-29',
    nextDate: '1403-01-02',
    monthStart: '1403-01-01',
    monthEnd: '1403-01-31',
    nextMonthStart: '1403-02-01',
    weekStart: '1402-12-26',
    weekEnd: '1403-01-03',
    gregorianDate: '2024-03-20',
    epochDay: 19802,
    locale: 'fa-IR',
    direction: 'rtl',
    weekdays: [6, 0, 1, 2, 3, 4, 5],
    monthLabel: 'Farvardin',
    localizedMonthLabel: 'فروردین',
  },
]

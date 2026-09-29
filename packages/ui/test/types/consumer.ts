import { expectTypeOf } from 'vitest'
import { useTemplateRef, type GlobalComponents } from 'vue'
import type * as Root from '@quasar/quasar-ui-qcalendar'
import type { QCalendar as SubCalendar } from '@quasar/quasar-ui-qcalendar/QCalendar'
import type { QCalendarAgenda as SubAgenda } from '@quasar/quasar-ui-qcalendar/QCalendarAgenda'
import type { QCalendarDay as SubDay } from '@quasar/quasar-ui-qcalendar/QCalendarDay'
import type { QCalendarMonth as SubMonth } from '@quasar/quasar-ui-qcalendar/QCalendarMonth'
import type { QCalendarResource as SubResource } from '@quasar/quasar-ui-qcalendar/QCalendarResource'
import type { QCalendarScheduler as SubScheduler } from '@quasar/quasar-ui-qcalendar/QCalendarScheduler'
import type { QCalendarTask as SubTask } from '@quasar/quasar-ui-qcalendar/QCalendarTask'

type Subpaths = {
  QCalendar: typeof SubCalendar
  QCalendarAgenda: typeof SubAgenda
  QCalendarDay: typeof SubDay
  QCalendarMonth: typeof SubMonth
  QCalendarResource: typeof SubResource
  QCalendarScheduler: typeof SubScheduler
  QCalendarTask: typeof SubTask
}
type Names = keyof Subpaths
type RootInstances = { [Name in Names]: InstanceType<(typeof Root)[Name]> }
type SubpathInstances = { [Name in Names]: InstanceType<Subpaths[Name]> }
type GlobalInstances = { [Name in Names]: InstanceType<GlobalComponents[Name]> }

// Check the declarations selected by package.json, rather than importing src/ files.
type AnyInstances = { [Name in Names]: 0 extends 1 & RootInstances[Name] ? true : false }
expectTypeOf<AnyInstances>().toEqualTypeOf<Record<Names, false>>()
expectTypeOf<RootInstances>().toEqualTypeOf<SubpathInstances>()
expectTypeOf<RootInstances>().toEqualTypeOf<GlobalInstances>()

type ModelValues = { [Name in Names]: RootInstances[Name]['$props']['modelValue'] }
expectTypeOf<ModelValues>().toEqualTypeOf<Record<Names, string | undefined>>()
expectTypeOf<RootInstances['QCalendar']['$props']['hour24Format']>().toEqualTypeOf<
  boolean | undefined
>()
expectTypeOf<RootInstances['QCalendarDay']['$props']['hour24Format']>().toEqualTypeOf<
  boolean | undefined
>()

type PropsWithUnknownNames = {
  [Name in Names]: string extends keyof RootInstances[Name]['$props'] ? true : false
}
expectTypeOf<PropsWithUnknownNames>().toEqualTypeOf<Record<Names, false>>()

type DaySlot = NonNullable<RootInstances['QCalendarDay']['$slots']['day-body']>
type DayScope = Parameters<DaySlot>[0]['scope']
expectTypeOf<DayScope['timestamp']['date']>().toEqualTypeOf<string>()
expectTypeOf<RootInstances['QCalendarDay']['$emit']>().not.toBeAny()

type DayProps = RootInstances['QCalendarDay']['$props']
const dayCallbacks: Pick<DayProps, 'dragEnterFunc' | 'weekdayClass'> = {
  dragEnterFunc(event) {
    expectTypeOf(event).toEqualTypeOf<DragEvent>()
    return event.dataTransfer !== null
  },
  weekdayClass: () => ({ highlighted: true }),
}
type TitleSlot = NonNullable<RootInstances['QCalendarTask']['$slots']['title-task']>
type Title = Parameters<TitleSlot>[0]['scope']['title']
expectTypeOf<string>().toMatchTypeOf<Title>()
expectTypeOf<{ label: string }>().toMatchTypeOf<Title>()
void dayCallbacks

type Navigation = { [Name in Names]: RootInstances[Name]['prev'] }
expectTypeOf<Navigation>().toEqualTypeOf<Record<Names, (_amount?: number) => void>>()

expectTypeOf<ReturnType<SubDay['timeStartPos']>>().toEqualTypeOf<number | false>()
expectTypeOf<ReturnType<SubDay['scrollToTime']>>().toEqualTypeOf<boolean>()
expectTypeOf<ReturnType<SubResource['timeStartPosX']>>().toEqualTypeOf<number | false>()
expectTypeOf<ReturnType<SubResource['scrollToTimeX']>>().toEqualTypeOf<boolean>()
expectTypeOf<ReturnType<Root.QCalendar['timeStartPos']>>().toEqualTypeOf<number | false | void>()
expectTypeOf<ReturnType<Root.QCalendar['timeDurationHeight']>>().toEqualTypeOf<number | void>()
expectTypeOf<ReturnType<Root.QCalendar['scrollToTime']>>().toEqualTypeOf<void>()

const legacyRef = useTemplateRef<Root.QCalendar>('calendar')
legacyRef.value?.prev()
const dayRef = useTemplateRef<InstanceType<typeof SubDay>>('day')
dayRef.value?.scrollToTime('09:00')

// @ts-expect-error Navigation accepts a number, not a string.
legacyRef.value?.prev('tomorrow')
// @ts-expect-error Model values are date strings.
const invalidModel: RootInstances['QCalendar']['$props'] = { modelValue: 123 }
// @ts-expect-error Boolean props must not degrade to any at the package root.
const invalidHourFormat: GlobalInstances['QCalendarDay']['$props'] = { hour24Format: 'yes' }
// @ts-expect-error Unknown props must not be accepted by the public component subpath.
const unknownProp: SubpathInstances['QCalendarMonth']['$props'] = { misspelledProp: true }
void [invalidModel, invalidHourFormat, unknownProp]

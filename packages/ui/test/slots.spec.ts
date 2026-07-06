import { describe, expectTypeOf, it } from 'vitest'
import type { Timestamp } from '@timestamp-js/core'
import type { Ref } from 'vue'

import type { ColumnObject } from '../src/composables/useColumn'
import type { Resource } from '../src/composables/useInterval'
import type { Task } from '../src/composables/useTask'
import type {
  QCalendarAgendaSlots,
  QCalendarResourceSlots,
  QCalendarSchedulerSlots,
  QCalendarTaskSlots,
} from '../src/slots'

type SlotScope<Slot> = NonNullable<Slot> extends { scope: infer Scope } ? Scope : never

describe('[QCALENDAR] slot payload contracts', () => {
  it('keeps agenda column and day slot scopes typed', () => {
    type HeadColumnScope = SlotScope<QCalendarAgendaSlots['head-column']>
    type DayScope = SlotScope<QCalendarAgendaSlots['day']>

    expectTypeOf<HeadColumnScope['column']>().toEqualTypeOf<ColumnObject>()
    expectTypeOf<HeadColumnScope['index']>().toEqualTypeOf<number>()
    expectTypeOf<HeadColumnScope['days']>().toEqualTypeOf<Timestamp[]>()

    expectTypeOf<DayScope['timestamp']>().toEqualTypeOf<Timestamp>()
    expectTypeOf<DayScope['columnIndex']>().toEqualTypeOf<number>()
    expectTypeOf<DayScope['timeStartPos']>().toMatchTypeOf<(_time: string) => number | false>()
  })

  it('keeps scheduler day slot scopes typed', () => {
    type DayScope = SlotScope<QCalendarSchedulerSlots['day']>

    expectTypeOf<DayScope['timestamp']>().toEqualTypeOf<Timestamp>()
    expectTypeOf<DayScope['columnIndex']>().toEqualTypeOf<number>()
    expectTypeOf<DayScope['resource']>().toEqualTypeOf<Resource>()
    expectTypeOf<DayScope['resourceIndex']>().toEqualTypeOf<number>()
    expectTypeOf<DayScope['activeDate']>().toEqualTypeOf<boolean>()
    expectTypeOf<DayScope['droppable']>().toEqualTypeOf<boolean | string>()
  })

  it('keeps resource header and task day slot scopes typed', () => {
    type ResourceHeadScope = SlotScope<QCalendarResourceSlots['head-resources']>
    type TaskDayScope = SlotScope<QCalendarTaskSlots['day']>

    expectTypeOf<ResourceHeadScope['timestamps']>().toEqualTypeOf<
      Ref<Timestamp[][]> | Timestamp[]
    >()
    expectTypeOf<ResourceHeadScope['resources']>().toEqualTypeOf<Resource[] | undefined>()

    expectTypeOf<TaskDayScope['timestamp']>().toEqualTypeOf<Timestamp>()
    expectTypeOf<TaskDayScope['task']>().toEqualTypeOf<Task>()
    expectTypeOf<TaskDayScope['activeDate']>().toEqualTypeOf<boolean>()
    expectTypeOf<TaskDayScope['droppable']>().toEqualTypeOf<boolean | string>()
  })
})

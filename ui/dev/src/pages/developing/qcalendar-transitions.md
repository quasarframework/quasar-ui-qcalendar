---
title: QCalendar Transitions
desc: Using QCalendar Transitions
keys: All about QCalendar
---

Transitions allows your calendar component to be animated when the view changes (ie: next/prev day, week, month, etc). It is turned on with the use of the `animated` property and works in conjunction with the `transiton-prev` and `transiton-next` properties.

## Transitions

Transition are a way to make your calendar come-alive to your end-user. When a calendar changes to a previous or next week/month, instead of just instantly displaying it, we can use the `animated` property to turn on transitions.

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| animated | Boolean        |              |

Then you can use the `transiton-prev` and `transiton-next` properties to change the default behavior, which is `slide-right` and `slide-left`, respectively.

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| transiton-prev | String   | slide-right (default) |
| transiton-next | String   | slide-left (default)  |

### Transitions types

QCalendar supports the following transition types:

| Roll       | Slide       | Jump       | Misc   |
| ----       | ----        | ----       | ----   |
| roll-right | slide-right | jump-right | fade   |
| roll-left  | slide-left  | jump-left  | scale  |
| roll-up    | slide-up    | jump-up    | rotate |
| roll-down  | slide-down  | jump-down  | spin   |
|            |             |            | flip   |

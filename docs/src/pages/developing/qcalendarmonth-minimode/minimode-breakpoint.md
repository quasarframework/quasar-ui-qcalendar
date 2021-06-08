---
title: MiniMode - Breakpoint
desc: QCalendarMonth (minimode) - Breakpoint
keys: developing
---
This example tests the `mini-mode="auto"` with `breakpoint="sm"` properties, which changes the month calendar into mini-mode.

::: tip
You will have to open your dev tools and change the width of the web page to see this example in action.
:::

::: tip
The calendar will fire the event `@mini-mode` with `true` or `false`. This can be captured if needed. For instance, controlling the `day-height` property.

```js
:day-height="isMiniMode ? 0 : 50"
```

:::

<example-viewer
  title="Breakpoint"
  file="MiniModeBreakpoint"
  codepen-title="QCalendarMonth (mini-mode)"
/>

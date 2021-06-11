---
title: Day - Modify Intervals
desc: QCalendarDay - Modify Intervals
keys: developing
related:
  - /developing/qcalendarday-week/week-modify-intervals
  - /developing/qcalendarresource/resource-modify-intervals
---
Using the proerties `interval-minutes`, `interval-start` and `interval-count`, you can control how the calendar looks in terms of the range of intervals.

This has been a difficult concept for some to grasp.

Basically, think of a base interval as 1, which is 60 minutes. To display a full day, the interval count would be set to 24. Say you want the calendar to start at 06:00 in the morning, so you set interval start to 6. What happens now, is the intervals start at 6am, but the last 6 intervals got pushed into the next day. In this case, you must remove 6 from the count, thereby making interval count 18 (24 - 6).

Now, we change interval minutes to 15 (for 15 minute segmented intervals). That means, there are 4 times the number of intervals to deal with for each hour. A full day would then be 96 (24h x 4). Starting at 06:00 means interval start would be 24 (6h * 4), which also means we need to remove that number off the end to prevent bleed-over onto the next day. The interval count then becomes 72 (96 - 24).

<example-viewer
  title="Modify Intervals"
  file="DayModifyIntervals"
  codepen-title="QCalendarDay"
/>

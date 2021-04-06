---
title: QCalendar (wrapper)
desc: 
keys: developing
---

The QCalendar component is a wrapper around all other calendars. It can take the same properties and has all the same slots -- combined. There are some edge-cases where this would be useful, but in general, avoid using it. Because it wraps ALL calendars, you will get no tree-shaking benefits.

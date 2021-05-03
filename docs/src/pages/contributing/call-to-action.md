---
title: Call to action
desc: Things that need help from the community
keys: Contributing
---

## Helping Out

This **Call to action** page is where items can be listed where community involvement will be greatly appreciated. In this respect, so that more time can be devoted to the components and not the docs site. If you take something on, please coordinate in the [Discussions](https://github.com/quasarframework/quasar-ui-qcalendar/discussions) area so there are not duplicated efforts.

### Docs Site

The Docs site has several empty pages that need to be filled in. If you think you are up to it, pick one and help out. 

### Testing

Only the Timestamp library has some Jest testing done on it. It'd be very welcomed if someone could write up tests for the UI components.

### JSON API

Each calendar component, as well as the Timestamp library, has an associated JSON file. Except for the Timestamp one, they are all missing functionality that needs to be added or updated and reviewed.

### Typescript

The currently typed system is using Vue 2. It needs updating. The types are done by reading in the JSON API and generating the appropriate types from that information. There is a separate library called [quasar-json-api](https://github.com/hawkeye64/quasar-json-api) that does this work. So, it's the library that needs updating. Specifically, the [build-types.js](https://github.com/hawkeye64/quasar-json-api/blob/master/library/src/build.types.js) in the library.

### Examples

A lot of the examples (in the `examples` folder) have been converted to Vue Composition API. Yet, there remains a lot using the Vue Options API. It's preferable to convert these latter ones to the Vue Composition API. And, if you are not quite familiar with the Vue Composition API, this will give you hands-on experience. Just look at another example that has been converted and extrapolate.
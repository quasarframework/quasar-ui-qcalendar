---
title: Call to action
desc: Things that need help from the community
keys: Contributing
related:
  - /designing-with-qcalendar/getting-started
  - /contributing/overview
  - /contributing/sponsor
---

## Helping out

This **Call to action** page is where items can be listed where community involvement will be greatly appreciated. In this respect, so that more time can be devoted to the components and not the docs site. If you take something on, please coordinate in the [Discussions](https://github.com/quasarframework/quasar-ui-qcalendar/discussions) area so there are not duplicated efforts.

### Docs site

The Docs site has several empty pages that need to be filled in. If you think you are up to it, pick one and help out.

In particular, all of the "Getting started" pages (one for each calendar type) need info after the API display component.

### Testing

Only the Timestamp library has some Jest testing done on it. It'd be very welcomed if someone could write up tests for the UI components.

### JSON API

Each calendar component, as well as the Timestamp library, has an associated JSON file. Except for the Timestamp one, they are all missing functionality that needs to be added or updated and reviewed.

### Examples

A lot of the examples (in the `examples` folder) have been converted to Vue Composition API. Yet, there remains a lot using the Vue Options API. It's preferable to convert these latter ones to the Vue Composition API. And, if you are not quite familiar with the Vue Composition API, this will give you hands-on experience. Just look at another example that has been converted and extrapolate.
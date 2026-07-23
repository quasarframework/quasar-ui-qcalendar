<!--
Release drafting notes:
- Lead with changes QCalendar users feel in their apps: component behavior, app-extension behavior, public API, styling, compatibility, install, and migration notes.
- Include docs, CodePen, build tooling, dependency, or release-process changes only when they affect package consumers.
- Fixes should include the short commit id.
- Keep the summary short and concrete.
-->

# QCalendar v5.x.x

Release date: YYYY-MM-DD

## Summary

Short user-facing summary of what changed for QCalendar component/app-extension users.

## What's Changed

**Features:**

- `commitid` Describe new component, app-extension, public API, styling, or integration behavior.

**Fixes:**

- `commitid` Describe the bug, who it affected, and what now works correctly.

**Maintenance:**

- `commitid` Include only consumer-relevant maintenance, such as package prep, compatibility updates, or dependency updates that users may notice.

## Breaking Changes

- None.

## Compatibility

- Node.js: `>=22.13`
- Quasar: `^2.22.0`
- Quasar App Vite target: `@quasar/app-vite@3.2.0`
- Timestamp package: `@timestamp-js/core@0.1.0-rc.5`
- npm dist-tag: `latest`

## Installation

```bash
pnpm add @quasar/quasar-ui-qcalendar
# or
bun add @quasar/quasar-ui-qcalendar
# or
yarn add @quasar/quasar-ui-qcalendar
# or
npm install @quasar/quasar-ui-qcalendar
# or
quasar ext add @quasar/qcalendar
```

Add the appropriate prerelease tag, such as `@beta`, only when publishing under that dist-tag.

For Timestamp helpers used in application code, install the standalone package explicitly:

```bash
pnpm add @timestamp-js/core
```

## Documentation

- Docs: https://qcalendar.netlify.app/
- Installation: https://qcalendar.netlify.app/getting-started/installation
- Upgrade Guide: https://qcalendar.netlify.app/other/upgrade-guide
- Theme Builder: https://qcalendar.netlify.app/getting-started/theme-builder
- Timestamp: https://timestamp-js.netlify.app/

## Full Changelog

https://github.com/quasarframework/quasar-ui-qcalendar/compare/PREVIOUS_TAG...CURRENT_TAG

## Donations

If QCalendar is useful in your workflow and you want to support ongoing maintenance:

- GitHub Sponsors: https://github.com/sponsors/hawkeye64
- PayPal: https://paypal.me/hawkeye64

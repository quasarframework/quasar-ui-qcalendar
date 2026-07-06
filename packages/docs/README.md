# QCalendar Docs

<span class="badge-github-sponsors"><a href="https://github.com/sponsors/hawkeye64" title="Sponsor this project on GitHub"><img src="https://img.shields.io/badge/github-sponsors-ea4aaa.svg?logo=githubsponsors&logoColor=white" alt="GitHub Sponsors button" /></a></span>
<span class="badge-paypal"><a href="https://paypal.me/hawkeye64" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>

[![Discord](https://img.shields.io/badge/discord-join%20server-738ADB?style=for-the-badge&logo=discord&logoColor=738ADB)](https://chat.quasar.dev)
[![X](https://img.shields.io/badge/follow-@jgalbraith64-1DA1F2?style=for-the-badge&logo=x&logoColor=1DA1F2)](https://twitter.com/jgalbraith64)

This package contains the Q-Press documentation site for QCalendar. It owns the public documentation source, live demos, example-viewer content, generated API pages, and static-search output for calendar views, Timestamp calendar adapters, and scheduling examples.

The docs app is a Quasar CLI Vite project inside the monorepo. Production docs should be built from the repository root so the UI package, app extension, generated API data, Q-Press route checks, and static output all describe the same release.

## Development

From the repository root:

```bash
pnpm install
pnpm build:ui
pnpm --filter docs dev
```

## Build

Build the full release set, including docs:

```bash
pnpm build
```

Build only the docs site after the UI package is already current:

```bash
pnpm build:docs
```

The docs package runs `quasar build` and `qpress ssg`; production output is emitted to `packages/docs/dist/spa`.

## Checks

Useful repository-level checks for docs work:

```bash
pnpm api:check
pnpm check:qpress
pnpm --filter docs typecheck
```

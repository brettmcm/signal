# Signal

Signal is Brett McMillin’s public working record for thoughts, experiments,
writing, and standalone HTML artifacts.

## Write a public signal

Create an `.md` or `.mdx` file in `src/content/signals`. The filename becomes
the public URL.

```md
---
title: "A useful title"
description: "A concise description."
signalNumber: "002"
publishedAt: 2026-07-29
tags:
  - Design
draft: false
---

Write here.
```

MDX signals may import components from `src/components`, including `Note` and
`Figure`.

## Add a Capsule

Capsules are small interactive components associated with a Signal. Each one
lives in `src/capsules/<three-digit-signal-number>/<two-digit-capsule-number>/`
so its component, metadata, and local assets stay together.

To add one:

1. Give the parent Signal a permanent, three-digit `signalNumber`.
2. Copy an existing Capsule folder and assign the next number within that
   Signal.
3. Update `meta.ts`, then build the Capsule in `index.astro`.
4. Import the Capsule into the parent Signal's MDX and place it at the point it
   should align with.

Capsules display in a right-hand rail on wide screens and inline in the article
on narrower screens. Signal and Capsule numbers are permanent; do not renumber
existing entries when the index changes.

## Publish standalone HTML

Keep the complete HTML package in a root folder and add its folder name to
`publicHtml` in `signal.config.json`. Its URL will be `/<folder-name>/`.

Standalone packages are public and are included in the static Vercel build.

## Develop

```sh
npm install
npm run dev
```

Run `npm run build` for the production build.

## Deploy with Vercel

Import the GitHub repository into Vercel using the Astro framework preset.
Vercel will build and deploy pushes automatically. Set
`signal.brettmcm.com` as the production domain in the Vercel project.

For a manual production deployment, run:

```sh
npm run deploy
```

# @hooksvue/big-screen

> A lightweight, **zero-UI-dependency Vue 3 big-screen adaptation library** with **dual-technique** support: **JS-driven** & **Pure-CSS**.

[中文 README](./README.md) · [Changelog](./CHANGELOG.md)

- 🎯 **Dual technique** — `ScreenResizer` (JS dynamic control) + `css-only.css` (0 JS / `tan(atan2)`)
- 🎮 **Dual mode** — Global plugin (takes over the whole `#app`) + Container component (local adaptation)
- 🧩 **Vue-decoupled** — The core class is pure JS, also usable in React or vanilla
- 📦 **JS / CSS fully separated** — `style.css` and `css-only.css` are standalone artifacts
- 🛠 **Runtime mutable** — `update()` / `resize()` / `destroy()` exposed
- 🪶 **Tiny** — ESM gzip < 2 KB, pure CSS < 1 KB
- 💻 Stack — Vite 8 / TypeScript 6 / Vue 3.5 / pnpm

---

## Install

```bash
pnpm add @hooksvue/big-screen
```

`vue@^3.5.0` is a peer dependency.

---

## Quick Start

### A. JS technique (recommended)

#### A1. Global plugin — full-page big screen

```ts
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import { createBigScreen } from '@hooksvue/big-screen';
import '@hooksvue/big-screen/style.css';

createApp(App)
  .use(createBigScreen({ el: '#app', width: 1920, height: 1080, mode: 'fit' }))
  .mount('#app');
```

#### A2. Container component — embedded big screen

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { BigScreenContainer } from '@hooksvue/big-screen';
import type { ScaleInfo } from '@hooksvue/big-screen';
import '@hooksvue/big-screen/style.css';

const bsRef = useTemplateRef<{ resize(): void; destroy(): void }>('bs');
const onResize = (i: ScaleInfo) => console.log(i.scaleX);
</script>

<template>
  <BigScreenContainer
    ref="bs"
    :width="1920" :height="1080"
    mode="fit" background="#000"
    @resize="onResize"
  >
    <!-- The content root MUST be width:100%; height:100% -->
    <YourDashboard />
  </BigScreenContainer>
</template>
```

#### A3. Pure JS core (no Vue required)

```ts
import { ScreenResizer } from '@hooksvue/big-screen';

const r = new ScreenResizer({
  target: document.querySelector('#screen')!,
  width: 1920, height: 1080, mode: 'fit',
  onResize: (info) => console.log(info),
});
r.start();
r.update({ mode: 'stretch' });   // mutate at runtime
r.resize();                       // manual recompute
r.destroy();                      // teardown
```

---

### B. Pure-CSS technique (0 JS)

```ts
import '@hooksvue/big-screen/css-only.css';
```

```html
<!-- Viewport mode (vw/vh) -->
<div class="hbs-css-viewport" style="--hbs-w:1920;--hbs-h:1080;">
  <div class="hbs-css-content">…design-canvas content…</div>
</div>

<!-- Container mode (container queries: cqw/cqh) -->
<div class="hbs-css-container" style="--hbs-w:1920;--hbs-h:1080;">
  <div class="hbs-css-content">…</div>
</div>

<!-- Mode modifiers on .hbs-css-content -->
<div class="hbs-css-content hbs-mode-stretch">…</div>
<div class="hbs-css-content hbs-mode-fill-width">…</div>
<div class="hbs-css-content hbs-mode-fill-height">…</div>
```

**How it works**: CSS `tan(atan2(100vw, 1920px))` converts a length ratio into a unit-less number, which is then fed to `transform: scale()`.

**Browser support**: Chrome 111+ / Safari 15.4+ / Firefox 108+.

---

## API

### `<BigScreenContainer />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `number` | `1920` | Design canvas width |
| `height` | `number` | `1080` | Design canvas height |
| `mode` | `ScaleMode` | `'fit'` | Scaling mode |
| `delay` | `number` | `80` | Resize debounce in ms |
| `background` | `string` | `'#000'` | Letterbox color |

| Event | Payload |
|-------|---------|
| `resize` | `ScaleInfo` |

| Exposed via `ref` | Description |
|-------------------|-------------|
| `resize()` | Force a re-scale |
| `destroy()` | Tear down the engine |
| `getResizer()` | Get the underlying `ScreenResizer` |

### `createBigScreen(options)` plugin

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `el` | `string` | `'#app'` | Root selector to take over |
| `width` / `height` | `number` | `1920 / 1080` | Design size |
| `mode` | `ScaleMode` | `'fit'` | Scaling mode |
| `delay` | `number` | `80` | Debounce ms |
| `registerComponent` | `boolean` | `true` | Also register `<BigScreenContainer />` globally |

### `ScreenResizer`

```ts
new ScreenResizer({
  target: HTMLElement,
  parent?: HTMLElement,  // defaults to window
  width?: 1920,
  height?: 1080,
  mode?: 'fit',
  delay?: 80,
  onResize?: (info: ScaleInfo) => void,
});
```

| Method | Description |
|--------|-------------|
| `start()` | Start observers + initial scale |
| `resize()` | Synchronous re-scale |
| `update(opts)` | Mutate width/height/mode/delay/onResize at runtime |
| `destroy()` | Detach observers + restore inline styles |

### Scale modes

| Value | Behavior |
|-------|----------|
| `fit` | Uniform scale, take the smaller ratio (letterbox) — default |
| `stretch` | Non-uniform, fill width and height independently |
| `fillWidth` | Uniform, scale to fill width (may overflow vertically) |
| `fillHeight` | Uniform, scale to fill height (may overflow horizontally) |

---

## Common Pitfalls

### 1. Content root **must** be `width:100%; height:100%`

The library writes the design size to `.hbs-content`. Your content's root must fill it; otherwise, switching design sizes (e.g. to 4K) will leave your content stuck in the top-left corner.

```css
/* ❌ Wrong */
.dashboard { width: 1920px; height: 1080px; }

/* ✅ Correct */
.dashboard { width: 100%; height: 100%; }
```

### 2. Centering algorithm in JS mode

We do **not** use `translate(-50%,-50%) scale()` — its compound math is the root cause of the popup/map offset bugs in libraries like `autofit.js`. Instead we use `transformOrigin: '0 0'` + an explicit `translate(tx, ty)` so coordinates can be reverse-mapped precisely later (popup ignore / map fix).

### 3. ECharts tooltip offset

In JS mode, charts inside a `transform: scale()` container have offset tooltips. Known issue, planned fix in **v0.3** (inverse `1/scale` correction).

---

## Local Development

```bash
pnpm install
pnpm dev          # Start playground (http://localhost:5174)
pnpm build        # Library build → dist/
pnpm build:watch  # Watch mode for linking external projects
pnpm type-check   # vue-tsc
```

The playground at `pnpm dev` is a fully-featured business big-screen demo (Operations Data Command Center) with KPI cards, six echarts charts, a data table, **a live property panel for tweaking every prop**, **a draggable holder to test parent-resize**, and a **JS / Pure-CSS switch tab**.

---

## Repositories

- GitHub: <https://github.com/mhxy13867806343/vue3-Adaptive-Large-Screen-ts>
- Gitee:  <https://gitee.com/fangjiayu/vue3-adaptive-large-screen-ts>

## License

MIT © hooksvue

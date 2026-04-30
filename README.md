# @hooksvue/big-screen

> 一个轻量、零 UI 依赖的 **Vue 3 大屏自适应库**，提供 **JS 计算** 与 **纯 CSS** 双技术方案。

[English README](./README.en.md) · [更新日志 / Changelog](./CHANGELOG.md)

- 🎯 **双技术方案** —— `ScreenResizer`（JS 动态控制） + `css-only.css`（0 JS / `tan(atan2)`）
- 🎮 **双驱动模式** —— 全局插件一键接管 + 容器组件局部适配
- 🧩 **Vue 解耦** —— 核心类纯 JS，可在 React / 原生项目使用
- 📦 **JS 与 CSS 完全分离** —— `style.css` 与 `css-only.css` 独立产物，按需引入
- 🛠 **运行时可调** —— `update()` / `resize()` / `destroy()` 全暴露
- 🪶 **极致轻量** —— ESM gzip < 2 KB，纯 CSS < 1 KB
- 💻 技术栈 —— Vite 8 / TypeScript 6 / Vue 3.5 / pnpm

---

## 安装

```bash
pnpm add @hooksvue/big-screen
# or: npm i / yarn add
```

`vue` 是 peerDependency，需要项目自身已经安装 `vue@^3.5.0`。

---

## 快速上手

### 方式 A：JS 计算模式（推荐）

#### A1. 全局插件 —— 单页大屏一键接管

```ts
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import { createBigScreen } from '@hooksvue/big-screen';
import '@hooksvue/big-screen/style.css';

createApp(App)
  .use(createBigScreen({
    el: '#app',
    width: 1920,
    height: 1080,
    mode: 'fit',
  }))
  .mount('#app');
```

#### A2. 容器组件 —— 局部内嵌大屏

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { BigScreenContainer } from '@hooksvue/big-screen';
import type { ScaleInfo } from '@hooksvue/big-screen';
import '@hooksvue/big-screen/style.css';

const bsRef = useTemplateRef<{ resize(): void; destroy(): void }>('bs');

function onResize(info: ScaleInfo) {
  console.log('当前缩放', info.scaleX, info.parentWidth);
}
</script>

<template>
  <BigScreenContainer
    ref="bs"
    :width="1920"
    :height="1080"
    mode="fit"
    background="#000"
    @resize="onResize"
  >
    <!-- 内容根节点必须 width:100%; height:100% -->
    <YourDashboard />
  </BigScreenContainer>
</template>
```

#### A3. 纯 JS 内核（脱离 Vue）

```ts
import { ScreenResizer } from '@hooksvue/big-screen';

const r = new ScreenResizer({
  target: document.querySelector('#screen')!,
  width: 1920,
  height: 1080,
  mode: 'fit',
  onResize: (info) => console.log(info),
});
r.start();

// 运行时改参数
r.update({ mode: 'stretch' });

// 手动触发重算
r.resize();

// 销毁
r.destroy();
```

---

### 方式 B：纯 CSS 模式（0 JS）

```ts
// main.ts 只需引入 CSS，无任何 JS
import '@hooksvue/big-screen/css-only.css';
```

```html
<!-- 全屏：基于 viewport (vw/vh) -->
<div class="hbs-css-viewport" style="--hbs-w:1920;--hbs-h:1080;">
  <div class="hbs-css-content">
    <!-- 设计稿尺寸的内容 -->
  </div>
</div>

<!-- 容器：基于父容器 (container queries: cqw/cqh) -->
<div class="hbs-css-container" style="--hbs-w:1920;--hbs-h:1080;">
  <div class="hbs-css-content">…</div>
</div>

<!-- 切换缩放模式：默认 fit；其他在 .hbs-css-content 上加修饰类 -->
<div class="hbs-css-content hbs-mode-stretch">…</div>
<div class="hbs-css-content hbs-mode-fill-width">…</div>
<div class="hbs-css-content hbs-mode-fill-height">…</div>
```

**原理**：CSS `tan(atan2(100vw, 1920px))` 把长度比转成无单位数字，再喂给 `transform: scale()`。

**浏览器要求**：Chrome 111+ / Safari 15.4+ / Firefox 108+。

---

## API

### `<BigScreenContainer />` Props / Events / Exposed

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `width` | `number` | `1920` | 设计稿宽 |
| `height` | `number` | `1080` | 设计稿高 |
| `mode` | `ScaleMode` | `'fit'` | 缩放模式 |
| `delay` | `number` | `80` | resize 防抖 ms |
| `background` | `string` | `'#000'` | 外层填充色（黑边色） |

| Event | 载荷 |
|-------|------|
| `resize` | `ScaleInfo` |

| 通过 `ref` 暴露的方法 | 说明 |
|-----------------------|------|
| `resize()` | 立即重算缩放 |
| `destroy()` | 销毁底层引擎 |
| `getResizer()` | 获取底层 `ScreenResizer` 实例 |

### `createBigScreen(options)` 全局插件

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `el` | `string` | `'#app'` | 接管的根选择器 |
| `width` / `height` | `number` | `1920` / `1080` | 设计稿尺寸 |
| `mode` | `ScaleMode` | `'fit'` | 缩放模式 |
| `delay` | `number` | `80` | 防抖 ms |
| `registerComponent` | `boolean` | `true` | 是否同时全局注册 `<BigScreenContainer />` |

### `ScreenResizer` 类

```ts
new ScreenResizer({
  target: HTMLElement,    // 必填，被缩放元素
  parent?: HTMLElement,   // 可选，参考容器；不传则用 window
  width?: 1920,
  height?: 1080,
  mode?: 'fit',
  delay?: 80,
  onResize?: (info: ScaleInfo) => void,
});
```

| 方法 | 说明 |
|------|------|
| `start()` | 启动监听并立即缩放一次 |
| `resize()` | 同步触发一次缩放 |
| `update(opts)` | 运行时更新 width/height/mode/delay/onResize |
| `destroy()` | 销毁监听并还原内联样式 |

### 缩放模式 `ScaleMode`

| 值 | 行为 | 典型场景 |
|----|------|---------|
| `fit` | 等比缩放，取宽高比例最小值，留黑边 | 通用大屏（默认） |
| `stretch` | 非等比拉伸，宽高分别撑满 | 接受轻微变形 |
| `fillWidth` | 等比，以宽度为基准撑满 | 强调"满宽"，可垂直滚动 |
| `fillHeight` | 等比，以高度为基准撑满 | 强调"满高" |

---

## 常见陷阱（务必阅读）

### 1. 内容根节点必须 `width:100%; height:100%`

库会把 `.hbs-content` 这一层的宽高设置为设计稿尺寸（如 `1920×1080`），你的内容放进去之后，**根节点必须撑满父级**，否则改设计稿尺寸（如切到 4K）时内容会缩在左上角。

```css
/* ❌ 错误 */
.dashboard { width: 1920px; height: 1080px; }

/* ✅ 正确 */
.dashboard { width: 100%; height: 100%; }
```

### 2. JS 模式的居中算法

不使用 `translate(-50%,-50%) scale()` 这种和 scale 复合误差大的写法（autofit 弹窗/地图偏移的根源）。本库用 `transformOrigin: '0 0'` + `translate(tx, ty)` 显式计算偏移，未来做弹窗/地图修正时坐标可被精确反推。

### 3. echarts 等图表 tooltip 偏移

JS 模式下 `transform: scale()` 容器内的 echarts，鼠标 tooltip 会偏移 —— 这是已知问题，**v0.3 计划修复**（反向 `1/scale` 修正）。

---

## 本地开发

```bash
pnpm install
pnpm dev          # 启动 playground (http://localhost:5174)
pnpm build        # 库构建（输出到 dist/）
pnpm build:watch  # 库 watch 模式（联调外部项目）
pnpm type-check   # vue-tsc 类型检查
```

`pnpm dev` 启动的 playground 是一个完整的商业大屏 demo（运营数据监控中心），包含：

- 顶部标题 + 实时时钟
- 6 张 KPI 卡片
- 6 个 echarts 图表（折线 / 柱状 / 饼图 / 雷达 / 仪表盘 / 横向条形）
- 数据表格
- **右侧属性面板** —— 实时调参 + 方法调用按钮 + API 速查
- **可拖拽缩放的 holder 容器** —— 直观验证父容器变化时的适配能力
- **JS / 纯 CSS 双技术 Tab** —— 一键切换对比

---

## 仓库

- GitHub: <https://github.com/mhxy13867806343/vue3-Adaptive-Large-Screen-ts>
- Gitee:  <https://gitee.com/fangjiayu/vue3-adaptive-large-screen-ts>

## License

MIT © hooksvue

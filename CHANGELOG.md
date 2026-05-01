# Changelog / 更新日志

All notable changes to this project will be documented in this file.

本项目所有重要变更都会记录在此文件。

---

## [0.1.1] — 2026-05-01

### 🇨🇳 中文

#### 新增
- 新增 `v-scale` Vue 指令，支持直接挂载在 echarts 等元素上监听缩放。
- `v-scale` 支持两种用法：
  - `v-scale`：自动写入 `--hbs-adapt-scale / --hbs-adapt-scale-x / --hbs-adapt-scale-y` 并派发 `adapt-scale` 事件。
  - `v-scale="handlerAdaptScale"`：缩放变化后回调 `handlerAdaptScale(el, scale, info)`。
- `createBigScreen()` 默认全局注册 `v-scale`，并新增 `registerDirective` 配置用于关闭自动注册。
- Playground 新增 `v-scale 指令`页签，提供真实 500×400 demo，可实时查看 `scale / scaleX / scaleY / rect`。
- Playground 新增 `Props 数据`页签，展示 `:data=[]` 入参结构。
- Dashboard 支持 `data` prop，数据项结构为 `{ name, value, format? }`，其中 `name` 与 `value` 必传，`format` 可选。
- 新增 GitHub Pages 工作流，推送 `main` 后自动构建 playground 预览。

#### 优化
- `ScreenResizer.resize()` 完成后派发 `hbs-resize` 事件，便于 `v-scale` 在 transform 缩放变化时同步刷新。
- README 补充 `v-scale` 使用方式与指令 API。
- TypeScript 6 下补充 `ignoreDeprecations: "6.0"`，避免 `baseUrl` 弃用提示阻断类型检查。

### 🇬🇧 English

#### Added
- Added the `v-scale` Vue directive for listening to effective element scale, useful for echarts containers.
- `v-scale` supports both plain usage and a handler form: `v-scale="handlerAdaptScale"`.
- `createBigScreen()` now registers `v-scale` by default, with `registerDirective` to opt out.
- Playground now includes live `v-scale` and `Props data` tabs.
- Dashboard now accepts a `data` prop with `{ name, value, format? }` items.
- Added a GitHub Pages workflow to build and publish the playground preview from `main`.

#### Changed
- `ScreenResizer.resize()` now dispatches `hbs-resize` after scaling, allowing directive-based listeners to refresh.
- README documents the new directive API.
- TypeScript config silences the TS 6 `baseUrl` deprecation warning.

---

## [0.1.0] — 2026-04-30

### 🇨🇳 中文

#### 项目初始化
- 使用 **Vite 8 + TypeScript 6 + Vue 3.5 + pnpm** 搭建库工程
- 库模式构建：输出 `ESM / CJS / UMD` 三种格式 + `.d.ts` 类型声明
- **JS 与 CSS 完全分离**：`dist/style.css`（JS 模式基础样式）与 `dist/css-only.css`（纯 CSS 模式）独立产物，按需引入
- `vue` 走 peerDependency，`echarts` 走可选 peer

#### 核心：JS 计算技术
- **`ScreenResizer` 纯 JS 内核**（与 Vue 完全解耦）
  - 4 种缩放模式：`fit / stretch / fillWidth / fillHeight`
  - **`window.resize` + `ResizeObserver(parent)` 双监听**，覆盖窗口缩放与父容器布局变化
  - 内置防抖（默认 80ms，可配置）
  - **居中算法用 `transformOrigin: '0 0'` + `translate(tx, ty)`**，规避 `autofit.js` 那种 `translate(-50%) scale()` 的复合误差，便于后续做弹窗/地图坐标修正
  - `start() / resize() / update() / destroy()` 完整生命周期
- **`<BigScreenContainer />` Vue 容器组件**
  - props 响应式（运行时改 width/height/mode/delay 立即生效）
  - 通过 `defineExpose` 暴露 `resize() / destroy() / getResizer()` 给父组件 ref 调用
  - `@resize` 事件实时回传 `ScaleInfo`
- **`createBigScreen()` 全局插件**
  - `app.use()` 一键接管 `#app`，同时全局注册 `<BigScreenContainer />`
  - 防重复初始化保护

#### 核心：纯 CSS 技术（v0.1.0 新增）
- **`css-only.css` 零 JS 实现**
  - 利用 CSS `tan(atan2(L, L))` 三角函数把长度比转成无单位数字
  - 配合 `@property` 注册 `<number>` 类型让 `min()` 正确推导
  - **viewport 模式**用 `vw/vh`，**container 模式**用 `container-type: size` + `cqw/cqh`
  - 4 种缩放模式通过 `.hbs-mode-stretch / fill-width / fill-height` 修饰类切换
  - 浏览器要求：Chrome 111+ / Safari 15.4+ / Firefox 108+

#### Playground 商业大屏 Demo
- 完整的 **运营数据监控中心** 1920×1080 大屏：
  - 顶部标题栏 + 实时时钟 + 状态指示灯
  - 6 张 KPI 卡片（销售额 / 订单 / 用户 / 转化率 / 客单价 / 退货率）
  - 6 个 echarts 图表（折线 / 柱状 / 饼图 / 雷达 / 仪表盘 / 横向条形）
  - 实时门店销售排行表（含 Top1/2/3 奖牌色）
  - 深色科技蓝主题 + 面板装饰角
- **右侧属性面板（ControlPanel）**：
  - **实现技术 Tab**：JS 计算 ↔ 纯 CSS 一键切换
  - 运行模式切换（容器 / 全局）
  - 设计稿尺寸输入 + 5 个常用预设（1920 / 2K / 4K / 1366 / 竖屏）
  - 缩放模式 4 选 1 单选组
  - resize 防抖滑块（仅 JS 模式）
  - 背景色拾色器（仅容器模式）
  - 实时 `ScaleInfo` 数据卡
  - **可调用方法按钮**：`.resize()` / `.destroy()` / `reset`
  - JS / CSS 模式各自的 API 速查代码块
- **可拖拽缩放的 holder 容器**（`resize: both`）
  - 左上角实时显示父容器尺寸
  - 直观验证 `ResizeObserver` 与 container queries 在父容器变化时的适配
- **双脚本**：`pnpm dev` 启动 playground 网页，`pnpm build:watch` 库 watch 模式

#### 工程
- `vite-plugin-dts@5` 自动生成 `.d.ts`
- `package.json` 标准 `exports` 字段，分别导出 `.` / `./style.css` / `./css-only.css`
- README 完整 API 文档 + 三大常见陷阱说明

---

### 🇬🇧 English

#### Project bootstrap
- Library scaffolded with **Vite 8 + TypeScript 6 + Vue 3.5 + pnpm**
- Library-mode build: emits `ESM / CJS / UMD` + `.d.ts`
- **JS and CSS fully separated**: `dist/style.css` (base for JS mode) and `dist/css-only.css` (pure-CSS mode) ship as standalone artifacts
- `vue` is a peerDep, `echarts` is an optional peerDep

#### Core: JS technique
- **`ScreenResizer` pure-JS engine** (fully decoupled from Vue)
  - 4 modes: `fit / stretch / fillWidth / fillHeight`
  - **Dual listeners**: `window.resize` + `ResizeObserver(parent)` — covers both viewport changes and parent layout changes
  - Built-in debounce (default 80ms, configurable)
  - **Centering uses `transformOrigin: '0 0'` + explicit `translate(tx, ty)`** — avoids the compound math error of `translate(-50%) scale()` (the root cause of popup/map offsets in `autofit.js`-style libs), enabling precise reverse-mapping later
  - Full lifecycle: `start() / resize() / update() / destroy()`
- **`<BigScreenContainer />` Vue component**
  - Reactive props (mutating width/height/mode/delay at runtime takes effect immediately)
  - Exposes `resize() / destroy() / getResizer()` via `defineExpose`
  - Emits `resize` with `ScaleInfo`
- **`createBigScreen()` global plugin**
  - One-line `app.use()` to take over `#app`, also registers `<BigScreenContainer />`
  - Guards against double initialization

#### Core: Pure-CSS technique (new in v0.1.0)
- **`css-only.css` zero-JS implementation**
  - Uses CSS `tan(atan2(L, L))` to convert a length ratio into a unit-less number
  - Pairs with `@property` `<number>` registration so `min()` infers correctly
  - **Viewport mode** uses `vw/vh`; **container mode** uses `container-type: size` + `cqw/cqh`
  - 4 scaling modes via `.hbs-mode-stretch / fill-width / fill-height` modifiers
  - Browser requirements: Chrome 111+ / Safari 15.4+ / Firefox 108+

#### Playground business big-screen demo
- Full 1920×1080 **Operations Data Command Center**:
  - Header with real-time clock + status indicator
  - 6 KPI cards
  - 6 echarts charts (line / bar / pie / radar / gauge / horizontal bar)
  - Real-time store-ranking table with Top1/2/3 medals
  - Dark tech-blue theme with decorated panel corners
- **Right-side property panel** with:
  - **Technique tab**: JS ↔ Pure-CSS instant switch
  - Mode switch (container / global)
  - Design-size inputs + 5 presets (1920 / 2K / 4K / 1366 / portrait)
  - Mode radio group
  - Resize-debounce slider (JS only)
  - Background color picker (container only)
  - Live `ScaleInfo` card
  - **Method-invoke buttons**: `.resize()` / `.destroy()` / `reset`
  - Per-technique API cheatsheet code blocks
- **Draggable holder** (`resize: both`)
  - Top-left badge shows live parent dimensions
  - Visually verify `ResizeObserver` and container queries adapting to parent resize
- **Dual scripts**: `pnpm dev` starts the playground, `pnpm build:watch` watches the library

#### Tooling
- `vite-plugin-dts@5` auto-generates `.d.ts`
- `package.json` `exports` field maps `.` / `./style.css` / `./css-only.css`
- README ships full API reference + three common-pitfall sections

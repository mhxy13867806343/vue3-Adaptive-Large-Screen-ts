<script setup lang="ts">
import { ref } from 'vue';
import type { ScaleInfo, ScaleMode } from '../../src/core/types';

defineProps<{
  /** 实现技术js=ScreenResizer／css=纯 CSS */
  technique: 'js' | 'css';
  /** 当前模式（容器/全局） */
  mode: 'container' | 'global';
  /** 设计稿宽 */
  width: number;
  /** 设计稿高 */
  height: number;
  /** 缩放模式 */
  scaleMode: ScaleMode;
  /** 防抖延迟 */
  delay: number;
  /** 背景色（仅容器模式） */
  background: string;
  /** 当前 scale 信息 */
  info: ScaleInfo | null;
}>();

const emit = defineEmits<{
  (e: 'update:technique', v: 'js' | 'css'): void;
  (e: 'update:mode', v: 'container' | 'global'): void;
  (e: 'update:width', v: number): void;
  (e: 'update:height', v: number): void;
  (e: 'update:scaleMode', v: ScaleMode): void;
  (e: 'update:delay', v: number): void;
  (e: 'update:background', v: string): void;
  (e: 'invoke-resize'): void;
  (e: 'invoke-destroy'): void;
  (e: 'reset'): void;
}>();

const collapsed = ref(false);

const PRESETS: Array<{ label: string; w: number; h: number }> = [
  { label: '1920 × 1080', w: 1920, h: 1080 },
  { label: '2560 × 1440', w: 2560, h: 1440 },
  { label: '3840 × 2160 (4K)', w: 3840, h: 2160 },
  { label: '1366 × 768', w: 1366, h: 768 },
  { label: '竖屏 1080 × 1920', w: 1080, h: 1920 },
];

const SCALE_MODES: Array<{ value: ScaleMode; label: string; desc: string }> = [
  { value: 'fit', label: 'fit', desc: '等比 · 留黑边' },
  { value: 'stretch', label: 'stretch', desc: '非等比 · 填满' },
  { value: 'fillWidth', label: 'fillWidth', desc: '等比 · 满宽' },
  { value: 'fillHeight', label: 'fillHeight', desc: '等比 · 满高' },
];

function applyPreset(p: { w: number; h: number }) {
  emit('update:width', p.w);
  emit('update:height', p.h);
}
</script>

<template>
  <aside :class="['ctrl-panel', { collapsed }]">
    <button class="toggle" @click="collapsed = !collapsed" :title="collapsed ? '展开' : '收起'">
      {{ collapsed ? '◀' : '▶' }}
    </button>

    <div v-if="!collapsed" class="ctrl-inner">
      <h2 class="ctrl-title">
        <span class="dot" />
        属性面板
        <small>Property Inspector</small>
      </h2>

      <!-- 技术选择 -->
      <section class="sec tech-sec">
        <div class="sec-title">实现技术</div>
        <div class="tech-tabs">
          <button
            :class="['tech-tab', { on: technique === 'js' }]"
            @click="emit('update:technique', 'js')"
          >
            <b>JS 计算</b>
            <small>ScreenResizer 动态控制</small>
          </button>
          <button
            :class="['tech-tab', { on: technique === 'css' }]"
            @click="emit('update:technique', 'css')"
          >
            <b>纯 CSS</b>
            <small>0 JS / tan(atan2)</small>
          </button>
        </div>
      </section>

      <!-- 模式切换 -->
      <section class="sec">
        <div class="sec-title">运行模式</div>
        <div class="seg">
          <button
            :class="{ on: mode === 'container' }"
            @click="emit('update:mode', 'container')"
          >容器模式</button>
          <button
            :class="{ on: mode === 'global' }"
            @click="emit('update:mode', 'global')"
          >全局模式</button>
        </div>
        <p class="hint">
          <template v-if="mode === 'container'">
            &lt;BigScreenContainer /&gt; — 父容器为 .holder
          </template>
          <template v-else>
            ScreenResizer 直接接管 viewport
          </template>
        </p>
      </section>

      <!-- 设计稿尺寸 -->
      <section class="sec">
        <div class="sec-title">设计稿尺寸</div>
        <div class="row">
          <label>width</label>
          <input
            type="number"
            :value="width"
            @input="emit('update:width', Number(($event.target as HTMLInputElement).value) || 0)"
            step="10"
            min="100"
          />
          <span class="suf">px</span>
        </div>
        <div class="row">
          <label>height</label>
          <input
            type="number"
            :value="height"
            @input="emit('update:height', Number(($event.target as HTMLInputElement).value) || 0)"
            step="10"
            min="100"
          />
          <span class="suf">px</span>
        </div>
        <div class="presets">
          <button
            v-for="p in PRESETS"
            :key="p.label"
            :class="{ on: width === p.w && height === p.h }"
            @click="applyPreset(p)"
          >{{ p.label }}</button>
        </div>
        <p class="tip">
          💡 内部内容请用 <code>width:100%;height:100%</code> 跟随该尺寸，<br>
          不要硬编码像素，否则切换尺寸时内容会缩在左上角。
        </p>
      </section>

      <!-- 缩放模式 -->
      <section class="sec">
        <div class="sec-title">缩放模式 (mode)</div>
        <div class="radio-list">
          <label v-for="m in SCALE_MODES" :key="m.value" :class="{ on: scaleMode === m.value }">
            <input
              type="radio"
              :value="m.value"
              :checked="scaleMode === m.value"
              @change="emit('update:scaleMode', m.value)"
            />
            <span class="r-name">{{ m.label }}</span>
            <span class="r-desc">{{ m.desc }}</span>
          </label>
        </div>
      </section>

      <!-- 防抖（仅 JS 模式需要） -->
      <section v-if="technique === 'js'" class="sec">
        <div class="sec-title">resize 防抖</div>
        <div class="row">
          <input
            type="range"
            :value="delay"
            @input="emit('update:delay', Number(($event.target as HTMLInputElement).value))"
            min="0"
            max="500"
            step="10"
          />
          <span class="val">{{ delay }} ms</span>
        </div>
      </section>
      <section v-else class="sec">
        <div class="sec-title">resize 防抖</div>
        <p class="hint">纯 CSS 模式不需要防抖 — 由浏览器原生重绘机制接管</p>
      </section>

      <!-- 背景色（仅容器模式） -->
      <section v-if="mode === 'container'" class="sec">
        <div class="sec-title">背景色 (background)</div>
        <div class="row color-row">
          <input
            type="color"
            :value="background"
            @input="emit('update:background', ($event.target as HTMLInputElement).value)"
          />
          <input
            type="text"
            :value="background"
            @input="emit('update:background', ($event.target as HTMLInputElement).value)"
          />
        </div>
      </section>

      <!-- 实时信息 -->
      <section class="sec">
        <div class="sec-title">运行时信息 (ScaleInfo)</div>
        <div v-if="info" class="kv">
          <div><span>scaleX</span><b>{{ info.scaleX.toFixed(4) }}</b></div>
          <div><span>scaleY</span><b>{{ info.scaleY.toFixed(4) }}</b></div>
          <div><span>设计稿</span><b>{{ info.width }} × {{ info.height }}</b></div>
          <div><span>父容器</span><b>{{ info.parentWidth }} × {{ info.parentHeight }}</b></div>
        </div>
        <div v-else class="empty">— 等待首次 resize —</div>
      </section>

      <!-- 暴露的方法（仅 JS 模式） -->
      <section v-if="technique === 'js'" class="sec">
        <div class="sec-title">可调用方法 (Exposed Methods)</div>
        <div class="actions">
          <button class="m-btn" @click="emit('invoke-resize')">
            <code>.resize()</code>
            <small>立即重算缩放</small>
          </button>
          <button class="m-btn warn" @click="emit('invoke-destroy')">
            <code>.destroy()</code>
            <small>销毁实例</small>
          </button>
          <button class="m-btn" @click="emit('reset')">
            <code>reset</code>
            <small>恢复默认参数</small>
          </button>
        </div>
      </section>
      <section v-else class="sec">
        <div class="sec-title">可调用方法</div>
        <p class="hint">纯 CSS 模式无 JS API — 修改 CSS 变量即可</p>
        <button class="m-btn" @click="emit('reset')">
          <code>reset</code>
          <small>恢复默认参数</small>
        </button>
      </section>

      <!-- API 速查 -->
      <section class="sec">
        <div class="sec-title">API 速查</div>
        <pre v-if="technique === 'js'" class="code"><code>// 容器组件
&lt;BigScreenContainer
  :width="1920" :height="1080"
  mode="fit" :delay="80"
  background="#000"
  @resize="onResize"
/&gt;

// 通过 ref 调用方法
const ref = useTemplateRef('big')
ref.value.resize()
ref.value.destroy()
ref.value.getResizer()

// 纯 JS 内核
const r = new ScreenResizer({
  target, parent,
  width, height, mode, delay,
  onResize,
})
r.start()
r.update({ mode: 'stretch' })
r.resize()
r.destroy()</code></pre>
        <pre v-else class="code"><code>// 1) 引入纯 CSS
import '@hooksvue/big-screen/css-only.css'

&lt;!-- 2) 全局模式（vw/vh） --&gt;
&lt;div class="hbs-css-viewport"
     style="--hbs-w:1920;--hbs-h:1080;"&gt;
  &lt;div class="hbs-css-content"&gt;
    … 设计稿内容 …
  &lt;/div&gt;
&lt;/div&gt;

&lt;!-- 3) 容器模式（container queries） --&gt;
&lt;div class="hbs-css-container"
     style="--hbs-w:1920;--hbs-h:1080;"&gt;
  &lt;div class="hbs-css-content"&gt;...&lt;/div&gt;
&lt;/div&gt;

&lt;!-- 4) 切换缩放模式 --&gt;
.hbs-css-content.hbs-mode-stretch
.hbs-css-content.hbs-mode-fill-width
.hbs-css-content.hbs-mode-fill-height

// 要求: Chrome 111+/Safari 15.4+
//        Firefox 108+
// 原理: tan(atan2(L,L)) → 无单位比值</code></pre>
      </section>
    </div>
  </aside>
</template>

<style scoped>
.ctrl-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 320px;
  height: 100vh;
  background: rgba(10, 14, 28, 0.96);
  border-left: 1px solid rgba(79, 140, 255, 0.25);
  backdrop-filter: blur(8px);
  z-index: 9998;
  transition: width 0.25s ease;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
  color: #e6f0ff;
  font-size: 13px;
}
.ctrl-panel.collapsed { width: 24px; }

.toggle {
  position: absolute;
  top: 50%;
  left: -14px;
  width: 24px;
  height: 56px;
  transform: translateY(-50%);
  background: #4f8cff;
  border: none;
  color: #fff;
  border-radius: 4px 0 0 4px;
  cursor: pointer;
  font-size: 12px;
  box-shadow: -2px 0 12px rgba(79, 140, 255, 0.4);
}
.toggle:hover { background: #5e98ff; }

.ctrl-inner {
  height: 100%;
  overflow-y: auto;
  padding: 16px;
}
.ctrl-inner::-webkit-scrollbar { width: 6px; }
.ctrl-inner::-webkit-scrollbar-thumb { background: rgba(79, 140, 255, 0.3); border-radius: 3px; }

.ctrl-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1px;
}
.ctrl-title .dot {
  width: 6px;
  height: 6px;
  background: #36e8a8;
  border-radius: 50%;
  box-shadow: 0 0 8px #36e8a8;
}
.ctrl-title small {
  margin-left: auto;
  font-size: 11px;
  font-weight: 400;
  color: rgba(230, 240, 255, 0.4);
  letter-spacing: 1px;
}

.sec {
  margin-bottom: 18px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(79, 140, 255, 0.1);
}
.sec:last-child { border: none; }

.sec-title {
  font-size: 12px;
  color: rgba(230, 240, 255, 0.5);
  margin-bottom: 8px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* 分段控件 */
.seg {
  display: flex;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 4px;
  padding: 2px;
}
.seg button {
  flex: 1;
  padding: 6px 0;
  background: transparent;
  border: none;
  color: rgba(230, 240, 255, 0.7);
  cursor: pointer;
  border-radius: 3px;
  font-size: 12px;
  transition: all 0.15s;
}
.seg button.on {
  background: #4f8cff;
  color: #fff;
}
.hint {
  margin: 8px 0 0;
  font-size: 11px;
  color: rgba(230, 240, 255, 0.4);
  font-family: monospace;
}

/* 行 */
.row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.row label {
  width: 60px;
  color: rgba(230, 240, 255, 0.6);
  font-size: 12px;
  font-family: monospace;
}
.row input[type="number"],
.row input[type="text"] {
  flex: 1;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(79, 140, 255, 0.2);
  color: #e6f0ff;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 13px;
  font-family: monospace;
  outline: none;
}
.row input[type="number"]:focus,
.row input[type="text"]:focus { border-color: #4f8cff; }
.row .suf { color: rgba(230, 240, 255, 0.4); font-size: 11px; }
.row .val { color: #4f8cff; font-family: monospace; font-size: 12px; min-width: 56px; text-align: right; }
.row input[type="range"] { flex: 1; accent-color: #4f8cff; }

.color-row input[type="color"] {
  width: 40px;
  height: 32px;
  padding: 0;
  background: none;
  border: 1px solid rgba(79, 140, 255, 0.2);
  border-radius: 4px;
  cursor: pointer;
}

.presets {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}
.presets button {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(79, 140, 255, 0.15);
  color: rgba(230, 240, 255, 0.7);
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 11px;
  cursor: pointer;
  font-family: monospace;
}
.presets button.on {
  background: rgba(79, 140, 255, 0.2);
  border-color: #4f8cff;
  color: #4f8cff;
}

.radio-list { display: flex; flex-direction: column; gap: 4px; }
.radio-list label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border: 1px solid rgba(79, 140, 255, 0.1);
  border-radius: 4px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.02);
  transition: all 0.15s;
}
.radio-list label:hover { background: rgba(79, 140, 255, 0.06); }
.radio-list label.on {
  border-color: #4f8cff;
  background: rgba(79, 140, 255, 0.12);
}
.radio-list input { accent-color: #4f8cff; }
.radio-list .r-name { font-family: monospace; color: #e6f0ff; font-size: 12px; }
.radio-list .r-desc { margin-left: auto; color: rgba(230, 240, 255, 0.4); font-size: 11px; }

.kv {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  padding: 10px 12px;
  font-family: monospace;
  font-size: 12px;
}
.kv > div { display: flex; justify-content: space-between; padding: 3px 0; }
.kv span { color: rgba(230, 240, 255, 0.5); }
.kv b { color: #4f8cff; font-weight: 600; }
.empty { color: rgba(230, 240, 255, 0.3); font-style: italic; padding: 8px 0; }

/* 技术 Tab */
.tech-sec {
  background: rgba(79, 140, 255, 0.06);
  margin: -16px -16px 18px;
  padding: 14px 16px 16px;
  border-bottom: 1px solid rgba(79, 140, 255, 0.2);
}
.tech-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.tech-tab {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(79, 140, 255, 0.2);
  border-radius: 4px;
  cursor: pointer;
  color: #e6f0ff;
  text-align: left;
  transition: all 0.15s;
}
.tech-tab b { font-size: 13px; color: #e6f0ff; }
.tech-tab small { font-size: 10px; color: rgba(230, 240, 255, 0.45); font-family: monospace; }
.tech-tab:hover { background: rgba(79, 140, 255, 0.12); }
.tech-tab.on {
  background: linear-gradient(135deg, #4f8cff 0%, #00e5ff 100%);
  border-color: #4f8cff;
  box-shadow: 0 0 12px rgba(79, 140, 255, 0.4);
}
.tech-tab.on b { color: #fff; }
.tech-tab.on small { color: rgba(255, 255, 255, 0.85); }

.tip {
  margin: 10px 0 0;
  padding: 8px 10px;
  background: rgba(255, 169, 64, 0.08);
  border-left: 2px solid #ffa940;
  border-radius: 2px;
  font-size: 11px;
  line-height: 1.6;
  color: rgba(255, 200, 130, 0.85);
}
.tip code {
  background: rgba(0, 0, 0, 0.3);
  padding: 1px 4px;
  border-radius: 2px;
  color: #ffa940;
}

.actions { display: flex; flex-direction: column; gap: 6px; }
.m-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(79, 140, 255, 0.08);
  border: 1px solid rgba(79, 140, 255, 0.25);
  color: #e6f0ff;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;
}
.m-btn:hover { background: rgba(79, 140, 255, 0.18); }
.m-btn code { color: #4f8cff; font-size: 13px; font-weight: 600; }
.m-btn small { color: rgba(230, 240, 255, 0.5); font-size: 11px; }
.m-btn.warn { border-color: rgba(255, 84, 112, 0.3); }
.m-btn.warn:hover { background: rgba(255, 84, 112, 0.1); }
.m-btn.warn code { color: #ff5470; }

.code {
  background: rgba(0, 0, 0, 0.4);
  color: #b8d4ff;
  padding: 10px;
  border-radius: 4px;
  font-size: 11px;
  line-height: 1.5;
  overflow-x: auto;
  margin: 0;
  font-family: monospace;
  border: 1px solid rgba(79, 140, 255, 0.1);
}
</style>

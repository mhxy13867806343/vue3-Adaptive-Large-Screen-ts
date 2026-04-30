<script setup lang="ts">
import { computed, ref, shallowRef, onBeforeUnmount, onMounted, watch, nextTick, useTemplateRef } from 'vue';
import { BigScreenContainer, ScreenResizer } from '../src';
import type { ScaleInfo, ScaleMode } from '../src/core/types';
import Dashboard from './Dashboard.vue';
import ControlPanel from './components/ControlPanel.vue';

type Technique = 'js' | 'css';
type Mode = 'container' | 'global';

/* ============== 默认参数 ============== */
const DEFAULTS = {
  technique: 'js' as Technique,
  mode: 'container' as Mode,
  width: 1920,
  height: 1080,
  scaleMode: 'fit' as ScaleMode,
  delay: 80,
  background: '#050a1a',
};

const technique = ref<Technique>(DEFAULTS.technique);
const mode = ref<Mode>(DEFAULTS.mode);
const width = ref(DEFAULTS.width);
const height = ref(DEFAULTS.height);
const scaleMode = ref<ScaleMode>(DEFAULTS.scaleMode);
const delay = ref(DEFAULTS.delay);
const background = ref(DEFAULTS.background);
const info = ref<ScaleInfo | null>(null);

/* ============== 容器模式（JS） ============== */
const bsContainerRef = useTemplateRef<{
  resize: () => void;
  destroy: () => void;
  getResizer: () => ScreenResizer | null;
}>('bsContainer');

/* ============== 全局模式（JS） ============== */
const globalTargetRef = ref<HTMLElement | null>(null);
const globalResizer = shallowRef<ScreenResizer | null>(null);

function destroyGlobal() {
  globalResizer.value?.destroy();
  globalResizer.value = null;
}

async function startGlobal() {
  destroyGlobal();
  await nextTick();
  if (!globalTargetRef.value) return;
  globalResizer.value = new ScreenResizer({
    target: globalTargetRef.value,
    width: width.value,
    height: height.value,
    mode: scaleMode.value,
    delay: delay.value,
    onResize: (i) => (info.value = i),
  });
  globalResizer.value.start();
}

watch([technique, mode], async ([t, m]) => {
  destroyGlobal();
  info.value = null;
  if (t === 'js' && m === 'global') await startGlobal();
});

watch([width, height, scaleMode, delay], ([w, h, sm, d]) => {
  if (technique.value === 'js' && mode.value === 'global') {
    globalResizer.value?.update({ width: w, height: h, mode: sm, delay: d });
  }
});

onBeforeUnmount(destroyGlobal);

/* ============== 方法调用 ============== */
function invokeResize() {
  if (mode.value === 'container') bsContainerRef.value?.resize();
  else globalResizer.value?.resize();
}
function invokeDestroy() {
  if (mode.value === 'container') bsContainerRef.value?.destroy();
  else destroyGlobal();
}
function reset() {
  width.value = DEFAULTS.width;
  height.value = DEFAULTS.height;
  scaleMode.value = DEFAULTS.scaleMode;
  delay.value = DEFAULTS.delay;
  background.value = DEFAULTS.background;
}

/* ============== 纯 CSS 模式：动态 class 名 ============== */
const cssModeClass = computed(() => {
  switch (scaleMode.value) {
    case 'stretch': return 'hbs-mode-stretch';
    case 'fillWidth': return 'hbs-mode-fill-width';
    case 'fillHeight': return 'hbs-mode-fill-height';
    default: return '';
  }
});

const cssVars = computed(() => ({
  '--hbs-w': String(width.value),
  '--hbs-h': String(height.value),
  background: background.value,
}));

/* ============== Holder 尺寸实时观测（演示父容器拖拽适配） ============== */
const holderRef = ref<HTMLElement | null>(null);
const holderSize = ref({ w: 0, h: 0 });
let holderObserver: ResizeObserver | null = null;

function attachHolderObserver(el: HTMLElement | null) {
  holderObserver?.disconnect();
  holderObserver = null;
  if (!el) return;
  holderObserver = new ResizeObserver((entries) => {
    const cr = entries[0].contentRect;
    holderSize.value = { w: Math.round(cr.width), h: Math.round(cr.height) };
  });
  holderObserver.observe(el);
}

watch(holderRef, attachHolderObserver);
onMounted(() => attachHolderObserver(holderRef.value));
onBeforeUnmount(() => holderObserver?.disconnect());
</script>

<template>
  <ControlPanel
    :technique="technique"
    :mode="mode"
    :width="width"
    :height="height"
    :scale-mode="scaleMode"
    :delay="delay"
    :background="background"
    :info="info"
    @update:technique="technique = $event"
    @update:mode="mode = $event"
    @update:width="width = $event"
    @update:height="height = $event"
    @update:scale-mode="scaleMode = $event"
    @update:delay="delay = $event"
    @update:background="background = $event"
    @invoke-resize="invokeResize"
    @invoke-destroy="invokeDestroy"
    @reset="reset"
  />

  <!-- ================== JS 模式 ================== -->
  <template v-if="technique === 'js'">
    <!-- 容器 -->
    <div v-if="mode === 'container'" class="container-shell">
      <div ref="holderRef" class="holder">
        <div class="holder-size-tag">
          父容器 <b>{{ holderSize.w }}</b> × <b>{{ holderSize.h }}</b> · 拖右下角缩放 ↘
        </div>
        <BigScreenContainer
          ref="bsContainer"
          :width="width"
          :height="height"
          :mode="scaleMode"
          :delay="delay"
          :background="background"
          @resize="(i: ScaleInfo) => (info = i)"
        >
          <Dashboard />
        </BigScreenContainer>
      </div>
    </div>
    <!-- 全局 -->
    <div v-else ref="globalTargetRef" class="global-target">
      <Dashboard />
    </div>
  </template>

  <!-- ================== 纯 CSS 模式 ================== -->
  <template v-else>
    <!-- 容器 -->
    <div v-if="mode === 'container'" class="container-shell">
      <div ref="holderRef" class="holder">
        <div class="holder-size-tag">
          父容器 <b>{{ holderSize.w }}</b> × <b>{{ holderSize.h }}</b> · 拖右下角缩放 ↘
        </div>
        <div class="hbs-css-container" :style="cssVars">
          <div class="hbs-css-content" :class="cssModeClass">
            <Dashboard />
          </div>
        </div>
      </div>
    </div>
    <!-- 全局：viewport -->
    <div v-else class="hbs-css-viewport" :style="cssVars">
      <div class="hbs-css-content" :class="cssModeClass">
        <Dashboard />
      </div>
    </div>
  </template>
</template>

<style scoped>
/* 给右侧 320 留位 */
.container-shell {
  position: absolute;
  inset: 0;
  right: 320px;
  padding: 24px;
}
.global-target {
  position: absolute;
  left: 0;
  top: 0;
}
</style>

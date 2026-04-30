<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue';
import { ScreenResizer } from '../core/ScreenResizer';
import type { ScaleInfo, ScaleMode } from '../core/types';

interface Props {
  /** 设计稿宽度，默认 1920 */
  width?: number;
  /** 设计稿高度，默认 1080 */
  height?: number;
  /** 缩放模式 */
  mode?: ScaleMode;
  /** resize 防抖延迟 ms */
  delay?: number;
  /** 背景色（外层填充色，常用于大屏黑边） */
  background?: string;
}

const props = withDefaults(defineProps<Props>(), {
  width: 1920,
  height: 1080,
  mode: 'fit',
  delay: 80,
  background: '#000',
});

const emit = defineEmits<{
  (e: 'resize', info: ScaleInfo): void;
}>();

const containerRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
const resizer = shallowRef<ScreenResizer | null>(null);

onMounted(() => {
  if (!containerRef.value || !contentRef.value) return;
  resizer.value = new ScreenResizer({
    target: contentRef.value,
    parent: containerRef.value,
    width: props.width,
    height: props.height,
    mode: props.mode,
    delay: props.delay,
    onResize: (info) => emit('resize', info),
  });
  resizer.value.start();
});

// props 变化时实时同步到底层 resizer
watch(
  () => [props.width, props.height, props.mode, props.delay] as const,
  ([width, height, mode, delay]) => {
    resizer.value?.update({ width, height, mode, delay });
  },
);

onBeforeUnmount(() => {
  resizer.value?.destroy();
  resizer.value = null;
});

/** 立即触发一次缩放 */
function resize() {
  resizer.value?.resize();
}

/** 销毁底层引擎 */
function destroy() {
  resizer.value?.destroy();
  resizer.value = null;
}

/** 获取底层 ScreenResizer 实例（高级用法） */
function getResizer() {
  return resizer.value;
}

defineExpose({ resize, destroy, getResizer });
</script>

<template>
  <div
    ref="containerRef"
    class="hbs-container"
    :style="{ background }"
  >
    <div ref="contentRef" class="hbs-content">
      <slot />
    </div>
  </div>
</template>

/**
 * @hooksvue/big-screen
 * Vue 3 大屏自适应库 —— 全局插件 + 容器组件双驱动模式
 */
export { ScreenResizer } from './core/ScreenResizer';
export type {
  ScaleInfo,
  ScaleMode,
  ScreenResizerOptions,
} from './core/types';

export { default as BigScreenContainer } from './components/BigScreenContainer.vue';
export { createBigScreen } from './plugin';
export type { BigScreenPluginOptions } from './plugin';

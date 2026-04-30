import type { App, Plugin } from 'vue';
import BigScreenContainer from './components/BigScreenContainer.vue';
import { ScreenResizer } from './core/ScreenResizer';
import type { ScaleMode, ScreenResizerOptions } from './core/types';

export interface BigScreenPluginOptions {
  /** 接管的根选择器，默认 '#app' */
  el?: string;
  /** 设计稿宽度，默认 1920 */
  width?: number;
  /** 设计稿高度，默认 1080 */
  height?: number;
  /** 缩放模式，默认 'fit' */
  mode?: ScaleMode;
  /** resize 防抖延迟 ms，默认 80 */
  delay?: number;
  /**
   * 是否注册全局组件 <BigScreenContainer />，默认 true
   */
  registerComponent?: boolean;
}

const PLUGIN_KEY = '__hooksvue_big_screen_resizer__';

/**
 * 全局插件：在 main.ts 中 app.use(createBigScreen({...})) 即可一键接管整个根节点。
 *
 * 同时也会注册全局组件 <BigScreenContainer />（可关闭）。
 */
export function createBigScreen(options: BigScreenPluginOptions = {}): Plugin {
  return {
    install(app: App) {
      if (options.registerComponent !== false) {
        app.component('BigScreenContainer', BigScreenContainer);
      }

      // 仅在浏览器环境启动全局接管逻辑
      if (typeof window === 'undefined' || typeof document === 'undefined') return;

      const startGlobal = () => {
        const selector = options.el ?? '#app';
        const target = document.querySelector<HTMLElement>(selector);
        if (!target) {
          console.warn(`[big-screen] target "${selector}" not found.`);
          return;
        }

        // 防止重复初始化
        const win = window as unknown as Record<string, unknown>;
        if (win[PLUGIN_KEY]) {
          (win[PLUGIN_KEY] as ScreenResizer).destroy();
        }

        const resizerOptions: ScreenResizerOptions = {
          target,
          width: options.width,
          height: options.height,
          mode: options.mode,
          delay: options.delay,
        };
        const resizer = new ScreenResizer(resizerOptions);
        resizer.start();
        win[PLUGIN_KEY] = resizer;
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startGlobal, { once: true });
      } else {
        startGlobal();
      }
    },
  };
}

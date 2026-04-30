import type { ScaleInfo, ScaleMode, ScreenResizerOptions } from './types';

/**
 * 大屏缩放核心引擎（纯 JS / 与 Vue 解耦）
 *
 * 设计要点：
 * 1. 使用 transformOrigin: '0 0' + translate 居中，避免 translate(-50%) 与 scale 的复合误差
 * 2. 同时监听 window.resize 与 ResizeObserver(parent)，覆盖窗口缩放与父容器布局变化两类场景
 * 3. 内置防抖，避免高频 resize 卡顿
 */
export class ScreenResizer {
  private width: number;
  private height: number;
  private mode: ScaleMode;
  private delay: number;
  private readonly target: HTMLElement;
  private readonly parent: HTMLElement | null;
  private onResize?: (info: ScaleInfo) => void;

  private timer: number | null = null;
  private observer: ResizeObserver | null = null;
  private windowResizeHandler: (() => void) | null = null;
  private destroyed = false;

  constructor(options: ScreenResizerOptions) {
    if (!options.target) {
      throw new Error('[ScreenResizer] options.target is required.');
    }
    this.target = options.target;
    this.parent = options.parent ?? null;
    this.width = options.width ?? 1920;
    this.height = options.height ?? 1080;
    this.mode = options.mode ?? 'fit';
    this.delay = options.delay ?? 80;
    this.onResize = options.onResize;
  }

  /** 启动监听 + 立即执行一次缩放 */
  public start(): void {
    if (this.destroyed) return;
    this.applyBaseStyle();
    this.resize();

    this.windowResizeHandler = () => this.scheduleResize();
    window.addEventListener('resize', this.windowResizeHandler);

    if (this.parent && typeof ResizeObserver !== 'undefined') {
      this.observer = new ResizeObserver(() => this.scheduleResize());
      this.observer.observe(this.parent);
    }
  }

  /** 立即执行一次缩放（同步） */
  public resize(): void {
    if (this.destroyed) return;
    const parentWidth = this.parent ? this.parent.clientWidth : window.innerWidth;
    const parentHeight = this.parent ? this.parent.clientHeight : window.innerHeight;

    if (parentWidth <= 0 || parentHeight <= 0) return;

    const rawScaleX = parentWidth / this.width;
    const rawScaleY = parentHeight / this.height;

    let scaleX: number;
    let scaleY: number;
    switch (this.mode) {
      case 'stretch':
        scaleX = rawScaleX;
        scaleY = rawScaleY;
        break;
      case 'fillWidth':
        scaleX = scaleY = rawScaleX;
        break;
      case 'fillHeight':
        scaleX = scaleY = rawScaleY;
        break;
      case 'fit':
      default:
        scaleX = scaleY = Math.min(rawScaleX, rawScaleY);
        break;
    }

    // 居中偏移：基于 transformOrigin: 0 0
    const tx = (parentWidth - this.width * scaleX) / 2;
    const ty = (parentHeight - this.height * scaleY) / 2;

    const style = this.target.style;
    style.width = `${this.width}px`;
    style.height = `${this.height}px`;
    style.transformOrigin = '0 0';
    style.transform = `translate(${tx}px, ${ty}px) scale(${scaleX}, ${scaleY})`;

    this.onResize?.({
      scaleX,
      scaleY,
      width: this.width,
      height: this.height,
      parentWidth,
      parentHeight,
    });
  }

  /**
   * 运行时更新可变参数（width/height/mode/delay/onResize），并立即重新计算缩放
   * 适合属性面板/响应式 props 场景。target/parent 不可变，需要变请重新 new。
   */
  public update(options: Partial<Pick<ScreenResizerOptions, 'width' | 'height' | 'mode' | 'delay' | 'onResize'>>): void {
    if (this.destroyed) return;
    if (typeof options.width === 'number') this.width = options.width;
    if (typeof options.height === 'number') this.height = options.height;
    if (options.mode) this.mode = options.mode;
    if (typeof options.delay === 'number') this.delay = options.delay;
    if ('onResize' in options) this.onResize = options.onResize;
    this.resize();
  }

  /** 销毁：移除监听 + 还原内联样式 */
  public destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;

    if (this.timer !== null) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.windowResizeHandler) {
      window.removeEventListener('resize', this.windowResizeHandler);
      this.windowResizeHandler = null;
    }
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    const style = this.target.style;
    style.width = '';
    style.height = '';
    style.transform = '';
    style.transformOrigin = '';
  }

  /** 设置目标元素的基础定位样式（不覆盖用户已有的 class 样式） */
  private applyBaseStyle(): void {
    // 仅设置定位相关的最小必要样式；视觉样式交给用户的 CSS class
    const style = this.target.style;
    if (!style.position) {
      style.position = 'absolute';
      style.left = '0';
      style.top = '0';
    }
  }

  private scheduleResize(): void {
    if (this.timer !== null) {
      window.clearTimeout(this.timer);
    }
    this.timer = window.setTimeout(() => {
      this.timer = null;
      this.resize();
    }, this.delay);
  }
}

/**
 * 缩放模式
 * - fit: 等比缩放，取宽高比例最小值，保证内容完整可见（最常用）
 * - stretch: 非等比缩放，宽高分别拉伸填满容器（可能变形）
 * - fillWidth: 等比缩放，以宽度为基准撑满容器（可能上下溢出）
 * - fillHeight: 等比缩放，以高度为基准撑满容器（可能左右溢出）
 */
export type ScaleMode = 'fit' | 'stretch' | 'fillWidth' | 'fillHeight';

export interface ScreenResizerOptions {
  /** 设计稿宽度，默认 1920 */
  width?: number;
  /** 设计稿高度，默认 1080 */
  height?: number;
  /** 缩放模式，默认 'fit' */
  mode?: ScaleMode;
  /**
   * 被缩放的目标元素（必填）。
   * 该元素会被设置成设计稿尺寸 + transform 缩放。
   */
  target: HTMLElement;
  /**
   * 参考的父容器元素，缩放比例基于其 clientWidth/clientHeight 计算。
   * 不传时使用 window 尺寸（即全屏模式）。
   */
  parent?: HTMLElement;
  /** resize 防抖延迟，单位 ms，默认 80 */
  delay?: number;
  /** 是否在缩放后回调 */
  onResize?: (info: ScaleInfo) => void;
}

export interface ScaleInfo {
  /** 当前 X 方向缩放比 */
  scaleX: number;
  /** 当前 Y 方向缩放比 */
  scaleY: number;
  /** 设计稿宽 */
  width: number;
  /** 设计稿高 */
  height: number;
  /** 参考容器宽 */
  parentWidth: number;
  /** 参考容器高 */
  parentHeight: number;
}

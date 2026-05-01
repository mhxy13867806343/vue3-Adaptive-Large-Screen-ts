import type { Directive, DirectiveBinding } from 'vue';

export interface ScaleDirectiveInfo {
  /** X 方向有效缩放比 */
  scaleX: number;
  /** Y 方向有效缩放比 */
  scaleY: number;
  /** 常规等比场景使用的缩放比 */
  scale: number;
}

export type ScaleDirectiveHandler = (el: HTMLElement, scale: number, info: ScaleDirectiveInfo) => void;

interface ScaleElementState {
  frame: number | null;
  observer: ResizeObserver | null;
  handler?: ScaleDirectiveHandler;
  update: () => void;
}

const STATE_KEY = Symbol('v-scale');

type ScaleHTMLElement = HTMLElement & {
  [STATE_KEY]?: ScaleElementState;
};

function getScaleInfo(el: HTMLElement): ScaleDirectiveInfo {
  const rect = el.getBoundingClientRect();
  const scaleX = el.offsetWidth > 0 ? rect.width / el.offsetWidth : 1;
  const scaleY = el.offsetHeight > 0 ? rect.height / el.offsetHeight : 1;

  return {
    scaleX,
    scaleY,
    scale: Math.min(scaleX || 1, scaleY || 1),
  };
}

function resolveHandler(binding: DirectiveBinding<ScaleDirectiveHandler | undefined>) {
  return typeof binding.value === 'function' ? binding.value : undefined;
}

function setScaleVars(el: HTMLElement, info: ScaleDirectiveInfo) {
  el.style.setProperty('--hbs-adapt-scale', String(info.scale));
  el.style.setProperty('--hbs-adapt-scale-x', String(info.scaleX));
  el.style.setProperty('--hbs-adapt-scale-y', String(info.scaleY));
  el.dataset.hbsAdaptScale = String(info.scale);
}

function createState(el: ScaleHTMLElement, binding: DirectiveBinding<ScaleDirectiveHandler | undefined>): ScaleElementState {
  const state: ScaleElementState = {
    frame: null,
    observer: null,
    handler: resolveHandler(binding),
    update: () => {
      if (state.frame !== null) return;
      state.frame = window.requestAnimationFrame(() => {
        state.frame = null;
        const info = getScaleInfo(el);
        setScaleVars(el, info);
        state.handler?.(el, info.scale, info);
        el.dispatchEvent(new CustomEvent<ScaleDirectiveInfo>('adapt-scale', { detail: info }));
      });
    },
  };

  return state;
}

function mount(el: ScaleHTMLElement, binding: DirectiveBinding<ScaleDirectiveHandler | undefined>) {
  const state = createState(el, binding);
  el[STATE_KEY] = state;

  if (typeof ResizeObserver !== 'undefined') {
    state.observer = new ResizeObserver(state.update);
    state.observer.observe(el);
    if (el.parentElement) state.observer.observe(el.parentElement);
  }

  window.addEventListener('resize', state.update);
  window.addEventListener('hbs-resize', state.update);
  state.update();
}

function update(el: ScaleHTMLElement, binding: DirectiveBinding<ScaleDirectiveHandler | undefined>) {
  if (!el[STATE_KEY]) {
    mount(el, binding);
    return;
  }

  el[STATE_KEY].handler = resolveHandler(binding);
  el[STATE_KEY].update();
}

function unmount(el: ScaleHTMLElement) {
  const state = el[STATE_KEY];
  if (!state) return;

  if (state.frame !== null) {
    window.cancelAnimationFrame(state.frame);
  }
  state.observer?.disconnect();
  window.removeEventListener('resize', state.update);
  window.removeEventListener('hbs-resize', state.update);
  el.style.removeProperty('--hbs-adapt-scale');
  el.style.removeProperty('--hbs-adapt-scale-x');
  el.style.removeProperty('--hbs-adapt-scale-y');
  delete el.dataset.hbsAdaptScale;
  delete el[STATE_KEY];
}

export const vScale: Directive<HTMLElement, ScaleDirectiveHandler | undefined> = {
  mounted: mount,
  updated: update,
  unmounted: unmount,
};

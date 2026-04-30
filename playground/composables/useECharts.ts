import { onBeforeUnmount, onMounted, shallowRef, type Ref } from 'vue';
import * as echarts from 'echarts';

/**
 * 通用 echarts 初始化 composable
 * - 在 onMounted 时初始化
 * - 监听 ResizeObserver 自动 resize（缩放容器变化时图表也要重排）
 * - onBeforeUnmount 时 dispose
 */
export function useECharts(
  el: Ref<HTMLElement | null>,
  optionFactory: () => echarts.EChartsCoreOption,
) {
  const chart = shallowRef<echarts.ECharts | null>(null);
  let observer: ResizeObserver | null = null;

  onMounted(() => {
    if (!el.value) return;
    chart.value = echarts.init(el.value);
    chart.value.setOption(optionFactory());

    observer = new ResizeObserver(() => {
      chart.value?.resize();
    });
    observer.observe(el.value);
  });

  onBeforeUnmount(() => {
    observer?.disconnect();
    observer = null;
    chart.value?.dispose();
    chart.value = null;
  });

  return { chart };
}

<script setup lang="ts">
import { ref } from 'vue';
import { useECharts } from '../composables/useECharts';
import type { EChartsCoreOption } from 'echarts';

const props = defineProps<{ option: () => EChartsCoreOption }>();
const elRef = ref<HTMLElement | null>(null);
useECharts(elRef, props.option);
</script>

<template>
  <div ref="elRef" class="chart-box" />
</template>

<style scoped>
.chart-box {
  width: 100%;
  height: 100%;
}
</style>

<script setup lang="ts">
import { computed } from 'vue';
import DashHeader from './components/DashHeader.vue';
import KpiCard from './components/KpiCard.vue';
import Panel from './components/Panel.vue';
import ChartBlock from './components/ChartBlock.vue';
import DataTable from './components/DataTable.vue';
import {
  lineOption,
  barOption,
  pieOption,
  radarOption,
  gaugeOption,
  horizontalBarOption,
} from './charts/options';

export interface DashboardDataItem {
  name: string;
  value: string | number;
  format?: (value: string | number) => string | number;
  unit?: string;
  trend?: number;
  color?: string;
}

const props = withDefaults(defineProps<{
  data?: DashboardDataItem[];
}>(), {
  data: () => [
    { name: '今日销售额', value: 1820400, unit: '￥', trend: 12.4, color: '#4f8cff', format: (v) => Number(v).toLocaleString() },
    { name: '订单总数', value: 12480, unit: '单', trend: 8.7, color: '#00e5ff', format: (v) => Number(v).toLocaleString() },
    { name: '活跃用户', value: 45230, unit: '人', trend: -1.3, color: '#36e8a8', format: (v) => Number(v).toLocaleString() },
    { name: '转化率', value: 24.8, unit: '%', trend: 3.5, color: '#ffa940' },
    { name: '平均客单', value: 146, unit: '￥', trend: 5.2, color: '#a26bff' },
    { name: '退货率', value: 2.4, unit: '%', trend: -0.8, color: '#ff5470' },
  ],
});

const kpiItems = computed(() => props.data.map((item) => ({
  ...item,
  displayValue: item.format ? item.format(item.value) : item.value,
})));
</script>

<template>
  <div class="dashboard">
    <DashHeader />

    <main class="dash-main">
      <!-- KPI 区 -->
      <section class="kpi-row">
        <KpiCard
          v-for="item in kpiItems"
          :key="item.name"
          :label="item.name"
          :value="item.displayValue"
          :unit="item.unit"
          :trend="item.trend"
          :color="item.color"
        />
      </section>

      <!-- 图表网格 -->
      <section class="grid">
        <Panel title="销售额走势" subtitle="2025 全年" class="cell-a">
          <ChartBlock :option="lineOption" />
        </Panel>
        <Panel title="区域销售" subtitle="按大区" class="cell-b">
          <ChartBlock :option="barOption" />
        </Panel>
        <Panel title="渠道占比" subtitle="销售来源" class="cell-c">
          <ChartBlock :option="pieOption" />
        </Panel>
        <Panel title="部门绩效" subtitle="多维评分" class="cell-d">
          <ChartBlock :option="radarOption" />
        </Panel>
        <Panel title="完成率" subtitle="本月目标" class="cell-e">
          <ChartBlock :option="gaugeOption" />
        </Panel>
        <Panel title="热销产品 TOP 5" subtitle="按销量" class="cell-f">
          <ChartBlock :option="horizontalBarOption" />
        </Panel>
        <Panel title="门店销售排行" subtitle="实时" class="cell-g">
          <DataTable />
        </Panel>
      </section>
    </main>
  </div>
</template>

<style scoped>
.dashboard {
  /* 跟随外层 .hbs-content 的设计稿尺寸（由 ScreenResizer 写入 width/height）。
     不要硬编码 1920×1080，否则切换设计稿尺寸（如 4K）时会变成左上角小图。 */
  width: 100%;
  height: 100%;
  background:
    radial-gradient(ellipse at top, rgba(79, 140, 255, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at bottom right, rgba(162, 107, 255, 0.1) 0%, transparent 50%),
    #050a1a;
  color: #e6f0ff;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dash-main {
  flex: 1;
  min-height: 0;
  padding: 16px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.kpi-row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  flex-shrink: 0;
}

.grid {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 1fr 1fr;
  gap: 16px;
}

/* 12 列网格布局：上排 折线(6)+柱状(3)+饼(3)；下排 雷达(3)+仪表(3)+TOP5(3)+表格(3) */
.cell-a { grid-column: span 6; grid-row: span 1; }
.cell-b { grid-column: span 3; grid-row: span 1; }
.cell-c { grid-column: span 3; grid-row: span 1; }
.cell-d { grid-column: span 3; grid-row: span 1; }
.cell-e { grid-column: span 3; grid-row: span 1; }
.cell-f { grid-column: span 3; grid-row: span 1; }
.cell-g { grid-column: span 3; grid-row: span 1; }
</style>

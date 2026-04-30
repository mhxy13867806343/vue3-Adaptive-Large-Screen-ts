import type { EChartsCoreOption } from 'echarts';

/* 统一深色科技风配色 */
const COLOR = {
  primary: '#4f8cff',
  cyan: '#00e5ff',
  green: '#36e8a8',
  orange: '#ffa940',
  red: '#ff5470',
  purple: '#a26bff',
  axis: 'rgba(255,255,255,0.15)',
  axisLabel: 'rgba(255,255,255,0.55)',
  split: 'rgba(255,255,255,0.06)',
};

const baseGrid = { left: 40, right: 20, top: 36, bottom: 28, containLabel: true };
const baseAxis = {
  axisLine: { lineStyle: { color: COLOR.axis } },
  axisTick: { show: false },
  axisLabel: { color: COLOR.axisLabel, fontSize: 12 },
  splitLine: { lineStyle: { color: COLOR.split } },
};

export function lineOption(): EChartsCoreOption {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  return {
    tooltip: { trigger: 'axis', backgroundColor: 'rgba(20,20,30,0.9)', borderColor: COLOR.primary, textStyle: { color: '#fff' } },
    legend: { data: ['销售额', '订单量'], textStyle: { color: COLOR.axisLabel }, top: 4, right: 10 },
    grid: baseGrid,
    xAxis: { type: 'category', data: months, ...baseAxis },
    yAxis: { type: 'value', ...baseAxis },
    series: [
      {
        name: '销售额',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { width: 2, color: COLOR.primary },
        itemStyle: { color: COLOR.primary },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(79,140,255,0.4)' },
              { offset: 1, color: 'rgba(79,140,255,0)' },
            ],
          },
        },
        data: [820, 932, 901, 934, 1290, 1330, 1320, 1450, 1380, 1620, 1810, 1920],
      },
      {
        name: '订单量',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { width: 2, color: COLOR.cyan },
        itemStyle: { color: COLOR.cyan },
        data: [620, 732, 701, 834, 1090, 1230, 1120, 1250, 1180, 1420, 1510, 1720],
      },
    ],
  };
}

export function barOption(): EChartsCoreOption {
  const categories = ['华东', '华北', '华南', '西南', '西北', '东北', '华中'];
  return {
    tooltip: { trigger: 'axis', backgroundColor: 'rgba(20,20,30,0.9)', borderColor: COLOR.primary, textStyle: { color: '#fff' } },
    grid: baseGrid,
    xAxis: { type: 'category', data: categories, ...baseAxis },
    yAxis: { type: 'value', ...baseAxis },
    series: [
      {
        type: 'bar',
        barWidth: 18,
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: COLOR.cyan },
              { offset: 1, color: COLOR.primary },
            ],
          },
        },
        data: [320, 432, 501, 234, 190, 290, 380],
      },
    ],
  };
}

export function pieOption(): EChartsCoreOption {
  return {
    tooltip: { trigger: 'item', backgroundColor: 'rgba(20,20,30,0.9)', borderColor: COLOR.primary, textStyle: { color: '#fff' } },
    legend: { orient: 'vertical', right: 10, top: 'center', textStyle: { color: COLOR.axisLabel } },
    color: [COLOR.primary, COLOR.cyan, COLOR.green, COLOR.orange, COLOR.purple],
    series: [
      {
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['38%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: { borderColor: '#0a1230', borderWidth: 2 },
        label: { color: COLOR.axisLabel, fontSize: 12 },
        labelLine: { lineStyle: { color: COLOR.axis } },
        data: [
          { value: 1048, name: '直营店' },
          { value: 735, name: '加盟店' },
          { value: 580, name: '电商' },
          { value: 484, name: '海外' },
          { value: 300, name: '其他' },
        ],
      },
    ],
  };
}

export function radarOption(): EChartsCoreOption {
  return {
    tooltip: { backgroundColor: 'rgba(20,20,30,0.9)', borderColor: COLOR.primary, textStyle: { color: '#fff' } },
    legend: { data: ['本月', '上月'], textStyle: { color: COLOR.axisLabel }, top: 4 },
    radar: {
      indicator: [
        { name: '销售', max: 100 },
        { name: '管理', max: 100 },
        { name: '研发', max: 100 },
        { name: '客服', max: 100 },
        { name: '运营', max: 100 },
        { name: '物流', max: 100 },
      ],
      axisName: { color: COLOR.axisLabel },
      splitLine: { lineStyle: { color: COLOR.axis } },
      splitArea: { areaStyle: { color: ['rgba(79,140,255,0.04)', 'rgba(79,140,255,0.08)'] } },
      axisLine: { lineStyle: { color: COLOR.axis } },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: [85, 70, 95, 78, 88, 72],
            name: '本月',
            lineStyle: { color: COLOR.primary, width: 2 },
            itemStyle: { color: COLOR.primary },
            areaStyle: { color: 'rgba(79,140,255,0.3)' },
          },
          {
            value: [78, 65, 82, 70, 75, 68],
            name: '上月',
            lineStyle: { color: COLOR.cyan, width: 2 },
            itemStyle: { color: COLOR.cyan },
            areaStyle: { color: 'rgba(0,229,255,0.2)' },
          },
        ],
      },
    ],
  };
}

export function gaugeOption(): EChartsCoreOption {
  return {
    series: [
      {
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: 100,
        progress: { show: true, width: 14, itemStyle: { color: COLOR.cyan } },
        axisLine: { lineStyle: { width: 14, color: [[1, 'rgba(255,255,255,0.1)']] } },
        pointer: { itemStyle: { color: COLOR.primary }, length: '60%', width: 5 },
        axisTick: { show: false },
        splitLine: { length: 10, lineStyle: { color: COLOR.axis } },
        axisLabel: { color: COLOR.axisLabel, fontSize: 11, distance: -50 },
        anchor: { show: true, size: 14, itemStyle: { color: COLOR.primary } },
        title: { show: false },
        detail: {
          valueAnimation: true,
          fontSize: 38,
          fontWeight: 700,
          color: COLOR.cyan,
          offsetCenter: [0, '40%'],
          formatter: '{value}%',
        },
        data: [{ value: 78 }],
      },
    ],
  };
}

export function horizontalBarOption(): EChartsCoreOption {
  const data = [
    { name: '产品 A', value: 1820 },
    { name: '产品 B', value: 1490 },
    { name: '产品 C', value: 1230 },
    { name: '产品 D', value: 980 },
    { name: '产品 E', value: 740 },
  ];
  return {
    tooltip: { trigger: 'axis', backgroundColor: 'rgba(20,20,30,0.9)', borderColor: COLOR.primary, textStyle: { color: '#fff' } },
    grid: { left: 12, right: 60, top: 12, bottom: 12, containLabel: true },
    xAxis: { type: 'value', show: false },
    yAxis: {
      type: 'category',
      inverse: true,
      data: data.map((d) => d.name),
      ...baseAxis,
      axisLine: { show: false },
    },
    series: [
      {
        type: 'bar',
        barWidth: 14,
        itemStyle: {
          borderRadius: [0, 7, 7, 0],
          color: {
            type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: COLOR.primary },
              { offset: 1, color: COLOR.cyan },
            ],
          },
        },
        label: { show: true, position: 'right', color: COLOR.axisLabel, fontSize: 12 },
        data: data.map((d) => d.value),
      },
    ],
  };
}

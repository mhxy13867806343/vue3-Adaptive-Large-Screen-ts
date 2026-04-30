<script setup lang="ts">
defineProps<{
  label: string;
  value: string | number;
  unit?: string;
  trend?: number; // 正负百分比
  color?: string;
}>();
</script>

<template>
  <div class="kpi" :style="{ '--c': color || '#4f8cff' }">
    <div class="kpi-label">{{ label }}</div>
    <div class="kpi-value-row">
      <span class="kpi-value">{{ value }}</span>
      <span v-if="unit" class="kpi-unit">{{ unit }}</span>
    </div>
    <div class="kpi-trend" v-if="trend !== undefined">
      <span :class="['arrow', trend >= 0 ? 'up' : 'down']">
        {{ trend >= 0 ? '▲' : '▼' }}
      </span>
      <span>{{ Math.abs(trend) }}%</span>
      <span class="vs">环比上月</span>
    </div>
    <div class="kpi-deco" />
  </div>
</template>

<style scoped>
.kpi {
  position: relative;
  padding: 14px 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-left: 3px solid var(--c);
  border-radius: 4px;
  overflow: hidden;
}
.kpi-label {
  font-size: 13px;
  color: rgba(230, 240, 255, 0.6);
  letter-spacing: 1px;
}
.kpi-value-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin: 6px 0 4px;
}
.kpi-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--c);
  font-family: 'DIN', monospace;
  text-shadow: 0 0 12px color-mix(in srgb, var(--c) 40%, transparent);
}
.kpi-unit { font-size: 13px; color: rgba(230, 240, 255, 0.5); }
.kpi-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: rgba(230, 240, 255, 0.6);
}
.arrow.up { color: #36e8a8; }
.arrow.down { color: #ff5470; }
.vs { margin-left: 4px; color: rgba(230, 240, 255, 0.4); }
.kpi-deco {
  position: absolute;
  right: -20px;
  top: -20px;
  width: 80px;
  height: 80px;
  background: var(--c);
  opacity: 0.06;
  border-radius: 50%;
  filter: blur(8px);
}
</style>

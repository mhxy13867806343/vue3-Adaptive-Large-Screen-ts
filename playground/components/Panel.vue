<script setup lang="ts">
defineProps<{ title: string; subtitle?: string }>();
</script>

<template>
  <section class="panel">
    <header class="panel-head">
      <span class="bar" />
      <h3>{{ title }}</h3>
      <small v-if="subtitle">{{ subtitle }}</small>
    </header>
    <div class="panel-body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.panel {
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, rgba(79, 140, 255, 0.08) 0%, rgba(79, 140, 255, 0.02) 100%);
  border: 1px solid rgba(79, 140, 255, 0.25);
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}
.panel::before,
.panel::after {
  content: '';
  position: absolute;
  width: 14px;
  height: 14px;
  border-color: #4f8cff;
  border-style: solid;
}
.panel::before { top: -1px; left: -1px; border-width: 1px 0 0 1px; }
.panel::after  { bottom: -1px; right: -1px; border-width: 0 1px 1px 0; }
.panel-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-bottom: 1px solid rgba(79, 140, 255, 0.15);
}
.panel-head .bar {
  width: 4px;
  height: 14px;
  background: #4f8cff;
  border-radius: 2px;
}
.panel-head h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #e6f0ff;
  letter-spacing: 1px;
}
.panel-head small {
  margin-left: auto;
  font-size: 12px;
  color: rgba(230, 240, 255, 0.5);
}
.panel-body {
  flex: 1;
  min-height: 0;
  padding: 8px;
}
</style>

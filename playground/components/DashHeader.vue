<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

const time = ref('');
let timer: number | null = null;

function tick() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  time.value = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

onMounted(() => {
  tick();
  timer = window.setInterval(tick, 1000);
});

onBeforeUnmount(() => {
  if (timer !== null) window.clearInterval(timer);
});
</script>

<template>
  <header class="dash-header">
    <div class="side left">
      <span class="dot" />
      <span>SYSTEM ONLINE</span>
    </div>
    <h1 class="title">
      <span class="title-text">运 营 数 据 监 控 中 心</span>
      <span class="title-en">OPERATIONS · DATA · COMMAND · CENTER</span>
    </h1>
    <div class="side right">
      <span>{{ time }}</span>
      <span class="dot green" />
    </div>
    <div class="deco-bar" />
  </header>
</template>

<style scoped>
.dash-header {
  position: relative;
  height: 80px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0 32px;
  background: linear-gradient(180deg, rgba(79, 140, 255, 0.18) 0%, rgba(79, 140, 255, 0) 100%);
}
.title {
  margin: 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.title-text {
  font-size: 32px;
  font-weight: 800;
  letter-spacing: 8px;
  background: linear-gradient(180deg, #ffffff 0%, #4f8cff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 0 20px rgba(79, 140, 255, 0.4);
}
.title-en {
  font-size: 11px;
  letter-spacing: 6px;
  color: rgba(79, 140, 255, 0.6);
}
.side {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: rgba(230, 240, 255, 0.7);
  font-family: monospace;
  letter-spacing: 1px;
}
.side.left { justify-content: flex-start; }
.side.right { justify-content: flex-end; }
.dot {
  width: 8px;
  height: 8px;
  background: #ffa940;
  border-radius: 50%;
  box-shadow: 0 0 8px #ffa940;
  animation: pulse 1.6s ease-in-out infinite;
}
.dot.green {
  background: #36e8a8;
  box-shadow: 0 0 8px #36e8a8;
}
.deco-bar {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, #4f8cff 50%, transparent 100%);
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
</style>

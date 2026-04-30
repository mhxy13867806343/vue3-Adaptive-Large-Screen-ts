<script setup lang="ts">
const rows = [
  { rank: 1, name: '北京旗舰店', sales: '¥1,820,400', orders: 1820, rate: '+12.4%' },
  { rank: 2, name: '上海陆家嘴店', sales: '¥1,490,200', orders: 1490, rate: '+8.7%' },
  { rank: 3, name: '深圳福田店', sales: '¥1,230,800', orders: 1230, rate: '+5.2%' },
  { rank: 4, name: '广州天河店', sales: '¥980,600', orders: 980, rate: '-1.3%' },
  { rank: 5, name: '杭州西湖店', sales: '¥740,100', orders: 740, rate: '+3.8%' },
  { rank: 6, name: '成都春熙店', sales: '¥620,400', orders: 620, rate: '+2.1%' },
];
</script>

<template>
  <div class="tbl">
    <div class="thead">
      <div>排名</div>
      <div>门店</div>
      <div>销售额</div>
      <div>订单</div>
      <div>同比</div>
    </div>
    <div class="tbody">
      <div v-for="r in rows" :key="r.rank" class="trow">
        <div>
          <span :class="['rank-tag', r.rank <= 3 ? `top${r.rank}` : '']">{{ r.rank }}</span>
        </div>
        <div class="name">{{ r.name }}</div>
        <div class="num">{{ r.sales }}</div>
        <div class="num">{{ r.orders }}</div>
        <div :class="['num', r.rate.startsWith('+') ? 'up' : 'down']">{{ r.rate }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tbl {
  height: 100%;
  display: flex;
  flex-direction: column;
  font-size: 13px;
}
.thead, .trow {
  display: grid;
  grid-template-columns: 50px 1fr 130px 80px 80px;
  align-items: center;
  padding: 8px 12px;
}
.thead {
  color: rgba(230, 240, 255, 0.5);
  background: rgba(79, 140, 255, 0.08);
  font-weight: 500;
  letter-spacing: 1px;
}
.tbody { flex: 1; overflow: hidden; }
.trow {
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  color: rgba(230, 240, 255, 0.85);
  transition: background 0.2s;
}
.trow:hover { background: rgba(79, 140, 255, 0.06); }
.rank-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(230, 240, 255, 0.6);
  font-size: 12px;
  font-weight: 700;
}
.rank-tag.top1 { background: #ffa940; color: #1a0a30; }
.rank-tag.top2 { background: #c0c0c0; color: #1a0a30; }
.rank-tag.top3 { background: #cd7f32; color: #1a0a30; }
.name { color: #e6f0ff; }
.num { font-family: monospace; text-align: right; }
.up { color: #36e8a8; }
.down { color: #ff5470; }
</style>

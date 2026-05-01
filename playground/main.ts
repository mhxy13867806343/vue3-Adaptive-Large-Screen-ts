import { createApp } from 'vue';
import App from './App.vue';
import { vScale } from '../src';
// 直接引用库源码 CSS（vite 别名 @lib 指向 ../src）
import '../src/styles/index.css';
import '../src/styles/css-only.css';
import './style.css';

createApp(App).directive('scale', vScale).mount('#app');

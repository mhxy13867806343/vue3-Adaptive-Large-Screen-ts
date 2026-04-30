import { createApp } from 'vue';
import App from './App.vue';
// 直接引用库源码 CSS（vite 别名 @lib 指向 ../src）
import '../src/styles/index.css';
import '../src/styles/css-only.css';
import './style.css';

createApp(App).mount('#app');

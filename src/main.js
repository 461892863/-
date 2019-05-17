// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import MintUI from 'mint-ui'
import $ from 'jquery'
import 'mint-ui/lib/style.css'
import './assets/css/jquery-weui.css'
import './assets/css/common.css'
import './assets/js/lCalendar.js'
import './assets/css/lCalendar.css'
import './assets/Calendar.js'
 import './assets/Calendar.css'
 import 'swiper/dist/css/swiper.css';
import './assets/js/lrz.all.bundle.js'

import base from './base.js'
import echarts from 'echarts'


Vue.use(base)
Vue.use(MintUI)
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts 
Vue.prototype.$MintUI = MintUI 
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  $,
  components: { App },
  template: '<App/>'
})
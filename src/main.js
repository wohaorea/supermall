import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

// 事件赋给一个实例
Vue.prototype.$bus = new Vue()

new Vue({
  render: h => h(App),
  router,
  // store
}).$mount('#app')

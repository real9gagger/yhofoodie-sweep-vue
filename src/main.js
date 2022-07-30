import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import WaiterRouters from './router'
import YhoLange from './config/lange'
import YhoAjaxer from './config/ajaxer'

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(YhoLange)
Vue.use(YhoAjaxer)

new Vue({
  render: h => h(App),
  router: WaiterRouters
}).$mount('#app')
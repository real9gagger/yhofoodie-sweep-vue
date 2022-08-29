import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import YhoRouters from './router'
import YhoLange from './config/lange'
import YhoAjaxer from './config/ajaxer'

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(YhoLange)
Vue.use(YhoAjaxer)

new Vue({
  render: h => h(App),
  router: YhoRouters
}).$mount('#app')
import Vue from 'vue'
import VueRouter from 'vue-router'
import MuseUI from 'muse-ui'
import App from './App.vue'
import YhoRouters from './router'
import YhoLange from './config/lange'
import YhoAjaxer from './config/ajaxer'
import 'muse-ui/dist/muse-ui.css'

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(YhoLange)
Vue.use(YhoAjaxer)
Vue.use(MuseUI)

new Vue({
  render: h => h(App),
  router: YhoRouters
}).$mount('#app')
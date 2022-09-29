import Vue from 'vue'
import VueRouter from 'vue-router'
import MuseUI from 'muse-ui'
import App from './App.vue'
import YhoRouter from './router'
import YhoLange from './apis/lange'
import YhoAjaxer from './apis/ajaxer'
import VuexStore from '@/utils/vuexstore'
import 'muse-ui/dist/muse-ui.css'

MuseUI.theme.add('museteal', {/*自定义主题色*/
  primary: '#fd5749',
  secondary: '#2196f3',
  success: '#4caf50',
  warning: '#ffc400',
}, 'light').use('museteal')

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(YhoLange)
Vue.use(YhoAjaxer)
Vue.use(MuseUI)

new Vue({
  render: h => h(App),
  store: VuexStore,
  router: YhoRouter
}).$mount('#yhoapp')
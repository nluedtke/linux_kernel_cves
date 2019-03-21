import Vue from 'vue'
import './plugins/vuetify'
import App from './App'
import VueMarkdown from 'vue-markdown'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
Vue.config.productionTip = false

// configuration
Vue.prototype.$apiBaseUrl = 'https://raw.githubusercontent.com/nluedtke/linux_kernel_cves/master/'

Vue.component('vue-markdown', VueMarkdown)
Vue.use(Vuetify, {
  theme: {
    primary: '#354649',
    secondary: '#9FD9E3'
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

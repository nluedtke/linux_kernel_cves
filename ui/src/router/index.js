import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import four from '@/components/four'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Router)
Vue.use(Vuetify)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'github',
      component: index
    },
    {
      path: '/streams/:stream_id',
      name: 'stream',
      component: () => import('@/components/stream')
    },
    {
      path: '/cves',
      name: 'cves',
      component: () => import('@/components/cves')
    },
    {
      path: '/cves/:cve_id',
      name: 'cve',
      component: () => import('@/components/cve')
    },
    {
      path: '/404',
      name: 'four',
      component: four
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})

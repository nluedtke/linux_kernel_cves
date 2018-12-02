import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import stream from '@/components/stream'
import cve from '@/components/cve'
import four from '@/components/four'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'github',
      component: index
    },
    {
      path: '/streams/:stream_id',
      name: 'stream',
      component: stream
    },
    {
      path: '/cves/:cve_id',
      name: 'cve',
      component: cve
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

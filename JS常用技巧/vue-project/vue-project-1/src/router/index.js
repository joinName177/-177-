import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

import One from '@/components/One'
import Two from '@/components/Two'
import Start from '@/components/Start'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/HelloWorld',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/One',
      name: 'One',
      component: One
    },
    {
      path: '/Two',
      name: 'Two',
      component: Two
    },
    {
      path: '/Start',
      name: 'Start',
      component: Start
    }
  ]
})

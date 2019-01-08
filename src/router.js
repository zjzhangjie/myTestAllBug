import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/inputBug',
      name: 'inputBug',
      component: () => import('./views/inputBug.vue')
    },
      {
          path: '/tableDraggle',
          name: 'tableDraggle',
          component: () => import('./views/tableDraggle.vue')
      },{
          path: '/dhtmlGanttx',
          name: 'dhtmlGanttx',
          component: () => import('./views/dhtmlGanttx.vue')
      },{
          path: '/dhtmlGanttxRe',
          name: 'dhtmlGanttxRe',
          component: () => import('./views/dhtmlGanttxRe.vue')
      }
  ]
})

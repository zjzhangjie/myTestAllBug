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
      },{
          path: '/calendar',
          name: 'calendar',
          component: () => import('./views/calendar.vue')
      },{
          path: '/mResources',
          name: 'mResources',
          component: () => import('./views/mResources.vue')
      },{
          path: '/resourcesOver',
          name: 'resourcesOver',
          component: () => import('./views/resourcesOver.vue')
      },{
          path: '/networkPlanning',
          name: 'networkPlanning',
          component: () => import('./views/networkPlanning.vue')
      },{
          path: '/zrender',
          name: 'v',
          component: () => import('./views/pert.vue')
      },{
          path: '/zuoqin',
          name: 'v',
          component: () => import('./components/pert/tree.vue')
      },{
          path: '/initTime',
          name: 'initTime',
          component: () => import('./views/initTime.vue')
      },{
          path: '/gaodeMap',
          name: 'gaodeMap',
          component: () => import('./views/gaodeMap.vue')
      }


  ]
})

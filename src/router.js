import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// function load (component) {
//   return () => System.import(`components/${component}.vue`)
// }

import Index from './components/Index.vue'
import Error404 from './components/Error404.vue'
import Hello from './components/Hello.vue'

import Contas from './modules/contaspagas/contas.vue'

export default new VueRouter({
  routes: [
    { path: '/', component: Hello },
    {
      path: '/hello',
      component: Hello,
      children: [
        { path: '/index', component: Index },
        { path: '/contas', component: Contas },
        { path: '*', component: Error404 }
      ]
    }
  ]
})

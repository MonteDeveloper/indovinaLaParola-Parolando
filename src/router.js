import { createRouter, createWebHistory } from 'vue-router'
import PageGame from './components/PageGame.vue'
import PageMenu from './components/PageMenu.vue'

const routes = [
  { path: '/', component: PageMenu },
  { path: '/game', component: PageGame },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

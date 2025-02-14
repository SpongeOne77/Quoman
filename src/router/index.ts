import { createRouter, createWebHashHistory} from 'vue-router'


const routes = [
  { path: '/', component: () => import('../view/HomePage.vue') },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
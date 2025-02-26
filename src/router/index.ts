import { createRouter, createWebHashHistory} from 'vue-router'


const routes = [
  { path: '/', component: () => import('../view/QuotationAdjust.vue') },
  { path: '/ProductPage', component: () => import('../view/ProductPage.vue') },

]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
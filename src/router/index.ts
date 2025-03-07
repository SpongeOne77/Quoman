import { createRouter, createWebHashHistory} from 'vue-router'


const routes = [
  { path: '/home', component: () => import('../view/HomePage.vue') },
  { path: '/ProductPage', component: () => import('../view/ProductView.vue') },
  { path: '/QuotationAdjust', component: () => import('../view/QuotationAdjust.vue') },
  { path: '/QuotationCreator', component: () => import('../view/QuotationCreater.vue') },
  { path: '/QuotationPage', component: () => import('../view/QuotationView.vue') },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
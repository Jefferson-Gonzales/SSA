import { createRouter, createWebHistory } from 'vue-router'
//import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import CatalogoView from '../views/CatalogoView.vue'
import CarritoView from '../views/CarritoView.vue'
import Ofertas from '@/views/Ofertas.vue'
import RegistroView from '@/views/RegistroView.vue'

const routes = [
  
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { hideNavbar: true }
  },
  {
    path: '/registro',
    name: 'registro',
    component: RegistroView,
    meta: { hideNavbar: true }
  },
  {
    path: '/',
    name: 'catalogo',
    component: CatalogoView
  },
  {
    path: '/carrito',
    name: 'carrito',
    component: CarritoView
  },
  {
    path: '/ofertas',
    name: 'ofertas',
    component: Ofertas
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

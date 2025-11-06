import { createRouter, createWebHistory } from 'vue-router'
//import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import CatalogoView from '../views/CatalogoView.vue'
import CarritoView from '../views/CarritoView.vue'
import Ofertas from '@/views/Ofertas.vue'
import RegistroView from '@/views/RegistroView.vue'
import ForgotPasswordView from '@/views/ForgotPasswordView.vue' 
import ResetPasswordView from '@/views/ResetPasswordView.vue'


const routes = [
  
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
        path: '/',
        redirect: '/login', // <--- Añade la redirección aquí
        // Nota: Quita 'name: "catalogo"' y 'component: CatalogoView' de esta ruta.
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
    path: '/catalogo',
    name: 'catalogo',
    component: CatalogoView,
    meta: { requiresAuth: true } // <--- ¡Proteger Carrito!
  },
  {
    path: '/carrito',
    name: 'carrito',
    component: CarritoView,
    meta: { requiresAuth: true } // <--- ¡Proteger Carrito!
  },
  {
    path: '/ofertas',
    name: 'ofertas',
    component: Ofertas,
    meta: { requiresAuth: true } // <--- ¡Proteger Ofertas!

  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPasswordView,
  },

  {
    path: '/reset-password',
    name: 'reset-password',
    component: ResetPasswordView,
  },
]


// Asume que tienes el router creado:
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

// === GUARDIÁN DE NAVEGACIÓN GLOBAL ===
router.beforeEach((to, from, next) => {
    // 1. Verificar si la ruta requiere autenticación
    if (to.meta.requiresAuth) {
        
        // 2. Comprobar si existe un Token JWT
        // (Asume que el token se almacena en localStorage)
        const token = localStorage.getItem('accessToken'); // Ajusta según tu implementación

        if (token) {
            if (to.name === 'login' || to.name === 'registro' ) {
              console.log('Ya iniciaste sesión. Redirigiendo a catalogo');
              return next({name: 'catalogo', replace: true});
            }
            else { 
                 // El token existe: permite el acceso a la ruta solicitada

              next();
            }
              
               
        } else {
            // El token NO existe: redirige a la página de login
            console.log("No autenticado. Redirigiendo a Login.");
            next({ name: 'login' }); // Redirige a tu ruta de login
        }
    } else {
        // La ruta no requiere autenticación: permite el acceso
        next();
    }
});

export default router;
import { createRouter, createWebHistory } from 'vue-router'
//import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import CatalogoView from '../views/CatalogoView.vue'
import CarritoView from '../views/CarritoView.vue'
import RegistroView from '@/views/RegistroView.vue'
import ForgotPasswordView from '@/views/ForgotPasswordView.vue' 
import ResetPasswordView from '@/views/ResetPasswordView.vue'
import DetalleProductoView from '@/views/DetalleProductoView.vue'
import PersonalizacionView from '@/views/PersonalizacionView.vue'
import PerfilView from '@/views/PerfilView.vue'
import OfertasView from '@/views/OfertasView.vue'
import CheckoutView from '@/views/CheckoutView.vue'
import FavoritosView  from '@/views/FavoritosView.vue' 


// 🎯 Nombre de la ruta principal para redirigir si ya está logueado
const Homeroute = 'catalogo'; 
// 🎯 Nombre de la ruta de autenticación
const Loginroute = 'login';


const routes = [
  
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
        path: '/',
        redirect: '/login',
    },
  {
    path: '/login',
    name: Loginroute,
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
    path: '/personalizacion',
    name: 'personalizacion',
    component: PersonalizacionView,
    meta: { requiresAuth: true }
  },
  {
    path: '/perfil',
    name: 'perfil',
    component: PerfilView,
    meta: { requiresAuth: true }
  },
  {
    path: '/catalogo',
    name: Homeroute,
    component: CatalogoView,
    meta: { requiresAuth: true } // <--- ¡Proteger Carrito!
  },
  {
    path: '/productos/:id',
    name: 'detalle',
    component: DetalleProductoView,
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
    component: OfertasView,
    meta: { requiresAuth: true } // <--- ¡Proteger Ofertas!

  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPasswordView,
    meta: { hideNavbar: true }
  },

  {
    path: '/reset-password',
    name: 'reset-password',
    component: ResetPasswordView,
    meta: { hideNavbar: true }
  },

  {
    path: '/CheckoutView',
    name: 'CheckoutView',
    component: CheckoutView,
  },
  {
    path: '/Favoritos',
    name: '/FavoritosView',
    component: FavoritosView,
    meta: { requiresAuth: true } // ¡Asegúrate de proteger esta ruta!
  }
]


// Asume que tienes el router creado:
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

/* === GUARDIÁN DE NAVEGACIÓN GLOBAL ===
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
});*/

// === GUARDIÁN DE NAVEGACIÓN GLOBAL CORREGIDO ===
router.beforeEach((to, from, next) => {
    // Comprobar si existe un Token JWT
    const isAuthenticated = localStorage.getItem('accessToken'); 
    
    // 1. Manejar si el usuario está logueado y va a rutas de autenticación
    if (isAuthenticated && (to.name === Loginroute || to.name === 'registro')) {
        console.log('Ya iniciaste sesión. Redirigiendo a Catalogo.');
        // Redirige al Home/Catálogo para evitar que el usuario se quede en Login/Registro
        return next({ name: Homeroute, replace: true });
    }

    // 2. Manejar si la ruta requiere autenticación y NO está logueado
    const requiresAuth = to.meta.requiresAuth;

    if (requiresAuth && !isAuthenticated) {
        // Redirige a Login si la ruta está protegida y no hay token
        console.log("Acceso denegado. Redirigiendo a Login.");
        return next({ name: Loginroute});
    }
    
    // 3. Permite la navegación en todos los demás casos
    // (rutas públicas sin token, rutas protegidas con token)
    next();
});

export default router;
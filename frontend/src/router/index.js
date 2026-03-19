import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CustomerOrders from '../views/CustomerOrders.vue'
import NotFound from '../views/NotFound.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { title: 'Sign In' }
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Home' }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { title: 'About' }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: { title: 'Dashboard', requiresAuth: true }
    },
    {
      path: '/dashboard-config',
      name: 'dashboard-config',
      component: () => import('../views/DashboardConfig.vue'),
      meta: { title: 'Configure Dashboard', requiresAuth: true }
    },
    {
      path: '/orders',
      name: 'orders',
      component: CustomerOrders,
      meta: { title: 'Customer Orders', requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound,
      meta: { title: '404 - Not Found' }
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

/* Auth Guard + Dynamic Page Title */
router.beforeEach((to) => {
  const isLoggedIn = localStorage.getItem('halleyx_auth') === 'true'

  /* Set browser tab title */
  document.title = to.meta.title
    ? `HalleyX — ${to.meta.title}`
    : 'HalleyX Dashboard'

  /* Already logged in → don't show login page */
  if (to.name === 'login' && isLoggedIn) {
    return { name: 'dashboard' }
  }

  /* Not logged in → redirect to login */
  if (to.meta.requiresAuth && !isLoggedIn) {
    return { name: 'login' }
  }
})

export default router
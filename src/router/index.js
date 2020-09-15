import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/login.vue')
  },
  {
    path: '/busses',
    name: 'busses',
    component: () => import(/* webpackChunkName: "busses" */ '../views/busses.vue')
  },
  {
    path: '/municipalities',
    name: 'municipalities',
    component: () => import(/* webpackChunkName: "municipalities" */ '../views/municipalities.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.name !== 'login' && !token) {
    next('login');
  } else if (to.name === 'login' && token) {
    next('busses');
  } else {
    next();
  }
})

export default router

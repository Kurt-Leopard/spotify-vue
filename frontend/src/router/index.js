import { createRouter, createWebHistory } from 'vue-router';
import playlistView from '../views/playlistView.vue';
import { useAuthStore } from '../stores/store';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'playlist',
      component: playlistView,
      meta: { requiresAuth: false } 
    },
    {
      path: '/artist',
      name: 'artist',
      component: () => import('../views/artistView.vue'),
      meta: { requiresAuth: false } 
    },
    {
      path: '/signIn',
      name: 'signIn',
      component: () => import('../views/signInView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/signUp',
      name: 'signUp',
      component: () => import('../views/signUpView.vue'),
      meta: { requiresAuth: false } 
    },
    {
      path: '/forgotPassword',
      name: 'forgotPassword',
      component: () => import('../views/forgotPassword.vue'),
      meta: { requiresAuth: false } 
    },
    {
      path: '/views/home',
      name: 'home',
      component: () => import('../views/authenticated/homeView.vue'),
      meta: { requiresAuth: true } 
    },
    {
      path: '/views/artist',
      name: 'viewArtist',
      component: () => import('../views/authenticated/artistView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/views/chat',
      name: 'viewchat',
      component: () => import('../views/authenticated/chatView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/views/manage',
      name: 'viewmanage',
      component: () => import('../views/authenticated/manageView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/views/profile',
      name: 'viewprofile',
      component: () => import('../views/authenticated/profileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/views/changePass',
      name: 'viewchangePass',
      component: () => import('../views/authenticated/changePass.vue'),
      meta: { requiresAuth: true }
    },
  ]
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore(); 
  const token = authStore.token; 

  if (to.meta.requiresAuth) {
 
    if (token) {
      next(); 
    } else {
      next({ name: 'playlist' }); 
    }
  } else { 
    if(token){
      next({ name: 'home' })
    }else{
      next();
    }
  }
});


export default router;

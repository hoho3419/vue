import {createRouter,createWebHistory} from 'vue-router';

import CoachesList from './pages/coaches/CoachesList.vue';
// import CoachDetail from './pages/coaches/CoachDetail.vue';
// import CoachRegistration from './pages/coaches/CoachRegistration.vue';
// import ContactCoach from './pages/requests/ContactCoach.vue';
// import RequestsReceived from './pages/requests/RequestsReceived.vue';
// import UserAuth from './pages/auth/UserAuth.vue';
import NotFound from './pages/NotFound.vue';
import store from './store/index.js';

const CoachDetail = () => import('./pages/coaches/CoachDetail.vue');
const CoachRegistration = () => import('./pages/coaches/CoachRegistration.vue');
const ContactCoach = () => import('./pages/requests/ContactCoach.vue');
const RequestsReceived = () => import('./pages/requests/RequestsReceived.vue');
const UserAuth = () => import('./pages/auth/UserAuth.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {path: '/', redirect: '/coaches'},
    {path: '/coaches', component: CoachesList},
    {
      path: '/coaches/:id', component: CoachDetail,
      props: true,
      children: [
        {path: 'contact',component: ContactCoach,} // /coaches/id/contact
      ]
    },
    {path: '/register', component: CoachRegistration, meta: { requiresAuth: true }},
    {path: '/requests', component: RequestsReceived, meta: { requiresAuth: true }},
    {path: '/auth', component: UserAuth, meta: { requiresUnauth: true}},
    {path: '/:notFound(.*)', component: NotFound},
  ]
})

router.beforeEach((to,_,next) => {
  if(to.meta.requiresAuth && !store.getters.isAthentication){
    next('/auth'); // register,requests 페이지에 접근하는데 사용자 로그인이 안되어 있으면 auth 페이지로 이동
  }
  else if(to.meta.requiresUnauth && store.getters.isAthentication){
    next('/coaches') // 사용자 로그인이 되어 있는데 /auth 페이지에 접근한다면 coaches 페이지로 이동
  } 
  else{
    next(); // 두개 다 해당이 안된다면 그냥 이동한다.
  }
})

export default router;
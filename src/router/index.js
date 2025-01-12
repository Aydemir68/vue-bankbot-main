// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Test from "../components/Test.vue";
import Opros_vhod from "../components/Opros_vhod.vue";
import Opros_vihod from "../components/Opros_vihod.vue";

import Inflation from "../components/Inflation.vue";
import News from "../components/News.vue";
import Chat from "../components/Chat.vue";
import Profile from "../components/Profile.vue";
import Opros_Fin from '../components/Opros_Fin.vue';


const routes = [
    { path: '', component: News},
    { path: '/news', component: News},
    { path: '/chat', component: Chat},
    { path: '/test/', component: Test },
    { path: '/user', component: Profile },
    { path: '/test/:id', component: Opros_vihod},
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;

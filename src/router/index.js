// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Test from "../components/Test.vue";
import Opros_vihod from "../components/Opros.vue";
import qrCode from "../components/qr-code.vue";

import News from "../components/News.vue";
import Chat from "../components/Chat.vue";
import Profile from "../components/Profile.vue";
import QrCode from "../components/qr-code.vue";



const routes = [
    { path: '', component: Profile},
    { path: '/news', component: News},
    { path: '/chat', component: Chat},
    { path: '/test/', component: Test },
    { path: '/user', component: Profile },
    { path: '/test/:id', component: Opros_vihod},
    {path: '/qr_code', component: QrCode},
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;

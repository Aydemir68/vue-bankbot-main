// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Test from "../components/Test.vue";
import News from "../components/News.vue";
import Chat from "../components/Chat.vue";
import Profile from "../components/Profile.vue";


const routes = [
    { path: '', component: News},
    { path: '/news', component: News},
    { path: '/chat', component: Chat},
    { path: '/test', component: Test },
    { path: '/user', component: Profile }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;

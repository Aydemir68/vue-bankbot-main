<script>
import Menu from "primevue/menu"
import Profile from "./components/Profile.vue";
import Test from "./components/Test.vue";
import News from "./components/News.vue";
import Chat from "./components/Chat.vue";
import Opros_vhod from "./components/Opros_vhod.vue";
import Toast from 'primevue/toast';
export default {
  components: {
    Menu,
    Profile,
    Test,
    News,
    Chat,
    Toast,
    Opros_vhod,
  },
  data() {
    return {
      items: [
        {
          label: 'Новости',
          icon: 'pi pi-home',
          link: '/news'
        },
        {
          label: 'ИИ',
          icon: 'pi pi-microchip-ai',
          link: '/chat'
        },
        {
          label: 'Опросы',
          icon: 'pi pi-pen-to-square',
          link: '/test'
        },
        {
          label: 'Профиль',
          icon: 'pi pi-user',
          link: '/user'
        },

      ]
    };
  },
  methods: {
  updateTab(newTab) {
    console.log("Смена вкладки на:", newTab); // Отладка
    this.activeTab = newTab;
  },
},
};
</script>

<template class="flex h-screen max-h-screen w-screen">
  <div class="flex flex-column text-gray-100 w-full h-full">
    <RouterView />
  </div>
  <div class="flex justify-content-center align-items-center w-screen">
    <div v-for="i in items" :key="i" class="w-full hover:bg-primary-800 h-3rem pt-1">
      <RouterLink :to="i.link" class="flex flex-column text-gray-100 w-full h-full justify-content-center">
        <span :class="i.icon" class="w-full align-items-center mt-1" />
        <span class="label-class text-gray-100">{{ i.label }}</span>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
* {
  -webkit-tap-highlight-color: transparent;
  margin: 0;
  padding: 0;
}
</style>

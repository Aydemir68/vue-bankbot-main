<script>
import Menu from "primevue/menu"
import Profile from "./components/Profile.vue";
import Test from "./components/Test.vue";
import News from "./components/News.vue";
import Chat from "./components/Chat.vue";
import Opros_vhod from "./components/Opros_vhod.vue";
export default {

  components: {
    Menu,
    Profile,
    Test,
    News,
    Chat,
    Opros_vhod
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

<template>
  <div class="text-gray-100">
    <div class="flex flex-column">
      <RouterView />
    </div>
    <div class="flex justify-content-center align-items-center">
      <div v-for="i in items" :key="i" class="w-full mt-8 hover:bg-primary-800 border-round h-3rem pt-2">
        <RouterLink :to="i.link" class="text-gray-100">
          <span :class="i.icon" class="flex flex-column align-items-center mx-2 hover:white" />
          <span class="label-class text-gray-100 mt-1">{{ i.label }}</span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>

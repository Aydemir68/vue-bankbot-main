<script>
import Menu from "primevue/menu"
import Profile from "./components/Profile.vue";
import Test from "./components/Test.vue";
import News from "./components/News.vue";
import Chat from "./components/Chat.vue";
import Toast from 'primevue/toast';
import instance from "./Api/instance.js";
export default {
  components: {
    Menu,
    Profile,
    Test,
    News,
    Chat,
    Toast
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
    checkRegistrationStatus() {
      let tg = window.Telegram.WebApp;
      instance.get('/auth/login', {params: {init_data: tg.initData}}).then(res => {
        this.$router.push('news');
      }).catch(err => {
        this.$router.push('user');
      });
    },
  },
  mounted() {
    this.checkRegistrationStatus();
  }
};
</script>

<template>
  <div class="flex flex-column text-gray-100 w-screen content-container">
    <RouterView />
  </div>
  <div class="flex justify-content-center align-items-center w-screen bottom-0 menu-container">
    <div v-for="i in items" :key="i" class="w-full h-full hover:bg-primary-800">
      <RouterLink :to="i.link" class="flex flex-column w-full h-full justify-content-center text-gray-100">
        <span :class="i.icon"/>
        <span>{{ i.label }}</span>
      </RouterLink>
    </div>
  </div>
</template>

<style>
* {
  -webkit-tap-highlight-color: transparent;
  margin: 0;
  padding: 0;
}

.menu-container {
  height: 7vh;
}

.content-container {
  height: 93vh;
}
</style>

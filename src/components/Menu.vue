<script>
import ButtonGroup from "primevue/buttongroup";
import Button from "primevue/button";
import Profile  from "./Profile.vue";
export default {
  props: {
    activeTab: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      items: [
        {
          label: 'Home',
          icon: 'pi pi-home',
        },
        {
          label: 'Projects',
          icon: 'pi pi-search',
          badge: 3,
          items: [
            {
              label: 'Core',
              icon: 'pi pi-bolt',
              shortcut: '⌘+S',
            },
            {
              label: 'Blocks',
              icon: 'pi pi-server',
              shortcut: '⌘+B',
            },
            {
              separator: true,
            },
            {
              label: 'UI Kit',
              icon: 'pi pi-pencil',
              shortcut: '⌘+U',
            },
          ],
        },
      ],
    };
  },
  methods: {
    selectTab(tab) {
      this.$emit("update-tab", tab);
    },
  },
  components: {
    ButtonGroup,
    Button,
    Profile
  },
};
</script>

<template>
  <div class="flex-row">
    <ButtonGroup class="">
      <Button
          class="custom-button"
          :class="{ active: activeTab === 'help' }"
          @click="selectTab('news')"
      >
        <div class="">
          <i class="pi pi-book"></i>
          <span class="button-label">Новости</span>
        </div>
      </Button>
      <Button
          class="custom-button"
          :class="{ active: activeTab === 'help' }"
          @click="selectTab('help')"
      >
        <div class="button-content">
          <i class="pi pi-question"></i>
          <span class="button-label">ИИ</span>
        </div>
      </Button>
      <Button
          class="custom-button"
          :class="{ active: activeTab === 'docs' }"
          @click="selectTab('docs')"
      >
        <div class="">
          <i class="pi pi-file-check"></i>
          <span class="button-label">Опросы</span>
        </div>
      </Button>
      <Button
          class="custom-button"
          :class="{ active: activeTab === 'profile' }"
          @click="selectTab('profile')"
      >
        <div class="flex">
          <i class="pi pi-user"></i>
          <span class="button-label">Профиль</span>
        </div>
      </Button>
    </ButtonGroup>
  </div>
</template>

<style>
* {
  -webkit-user-select: none;
  -webkit-tap-highlight-color: gray;
}
</style>

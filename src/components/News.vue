<template>
  <div class="overflow-auto">
    <div v-for="(news, index) in this.allNews" :key="index" class="text-gray-100 text-sm">
      <div class="bg-black-alpha-30 border-round-xl m-2 p-2 pb-2">
        <p class="text-xl font-semibold">{{ news.title }}</p>

        <img :src="host + news.image_url" :alt="news.title"
             class="image border-round-2xl align-content-center align-items-center justify-content-center w-full" />
        <p class="py-2 text-left">{{ news.description }}</p>
        <button v-if="news.is_event === false" class="text-white hover:bg-primary-800 active:bg-primary-600">Запланировать</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      host: 'https://finlit-test.ru/',
    }
  },
  mounted() {
    this.$store.dispatch("getAllNews");
    console.log(this.$store.getters["GET_NEWS"]);
  },
  computed: {
    allNews() {
      return this.$store.getters['GET_NEWS'];
    },
  }
};
</script>

<style scoped>

.image{
  height: 28vh;
  object-fit: contain;
}

button {
  background-color: rgb(46, 76, 124);
  outline: none;
}

</style>

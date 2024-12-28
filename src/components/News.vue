<template>
  <div class="overflow-auto">
    <div v-for="(news, index) in newsItems" :key="index" class="text-gray-100 text-sm">
      <div class="news-content border-round-xl m-2 p-1 pb-2">
        <p class="text-xl font-bold">{{ news.title }}</p>
        <img :src="news.image" :alt="news.title" class="image align-items-center justify-content-center border-round" />
        <p class="py-2">{{ news.description }}</p>
        <button class="text-white hover:bg-primary-800 active:bg-primary-600">Запланировать</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      news: null
    };
  },

};
</script>

<style scoped>

.image{
  height: 28vh;
  width: fit-content;
}

.news-content {
  background-color: rgb(66, 115, 195);
}

button {
  background-color: rgb(46, 76, 124);
  outline: none;
}

</style>

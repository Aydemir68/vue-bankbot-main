<template>
  <div class="overflow-scroll">
    <h1 class="news-title">Новости</h1>
    <div v-for="(news, index) in newsItems" :key="index" class="news-item text-gray-100 text-xl">
      <div class="news-content border-round-xl m-2 p-1 pb-4">
        <h2 class="news-header">{{ news.title }}</h2>
        <img :src="news.image" :alt="news.title" class="image align-items-center justify-content-center border-round" />
        <p class="news-description">{{ news.description }}</p>
        <button class="text-white hover:bg-primary-800 active:bg-primary-600">Запланировать</button>
      </div>
    </div>
  </div>
</template>

  <script>
  export default {
    data() {
      return {
        // Список новостей
        newsItems: [
          {
            title: "Вебинар по финансовой грамотности",
            description: "15.12.2024 состоится вебинар по финансовой грамотности",
            image: "https://www.topol-eco.ru/upload/iblock/13f/635847974891062780-425303270_news.jpg", // Замените на путь к вашему изображению
          },
          {
            title: "Совещание с командой",
            description: "Совещание пройдет 20 декабря",
            image: "https://www.topol-eco.ru/upload/iblock/13f/635847974891062780-425303270_news.jpg",
          },
          // Добавьте больше новостей по необходимости
        ],
      };
    },
  };
  </script>

<style scoped>


.image{
  height: 28vh;
}

.news-content {
  background-color: rgb(66, 115, 195);
}

button {
  background-color: rgb(46, 76, 124);
}

</style>

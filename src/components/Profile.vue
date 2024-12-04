<template>
  <div class="user-profile-full">
    <div class="user-profile flex flex-column justify-content-center border-round-2xl m-2 pt-4">
      <!-- Блок с фото профиля и кнопкой -->
      <div class="profile-container align-items-center">
        <img class="profile-photo" :src="user.photoUrl" alt="Фото профиля" />
        <!-- Кнопка редактирования профиля под фото -->
        <div class="edit-profile mt-2">
          <button @click="editProfile" class="text-white hover:bg-primary-800 active:bg-primary-600">Редактировать профиль</button>
        </div>
      </div>

      <!-- Информация о пользователе -->
      <div class="user-info mt-2 m">
        <p><strong>ФИО:</strong> {{ user.fullName }}</p>
        <p><strong>Имя пользователя:</strong> {{ username }}</p>
        <p><strong>Возраст:</strong> {{ user.age }}</p>
        <p><strong>Регион:</strong> {{ user.region }}</p>
      </div>
    </div>

    <!-- Выпадающий список для выбора категории -->
    <div class="pt-2">
      <select v-model="selectedCategory" id="category" class="border-round bg-primary-100 h-2rem text-gray-800">
        <option value="events">Запланированные мероприятия</option>
        <option value="statistics">Статистика тестов</option>
        <option value="topics">Темы для изучения</option>
      </select>
    </div>

    <!-- Контент в зависимости от выбранной категории -->
    <div v-if="selectedCategory === 'events'" class="events border-round-xl mt-3 h-18rem p-1 m-2 overflow-scroll">
          <h3>Запланированные мероприятия:</h3>
          <ul>
            <li>15.12.2024 - Вебинар по финансовой грамотности</li>
            <li>20.12.2024 - Совещание с командой</li>
            <li>25.12.2024 - Подведение итогов года</li>
          </ul>
    </div>

    <div v-if="selectedCategory === 'statistics'" class="statistics border-round-xl mt-3 h-18rem  p-1 m-2 overflow-scroll">
      <h3>Ваша статистика прохождения тестов за все время:</h3>
      <ul>
        <li>Завершено тестов: 10</li>
        <li>Средний балл: 85%</li>
        <li>Ожидаемые результаты: 90%</li>
      </ul>
    </div>

    <div v-if="selectedCategory === 'topics'" class="topics border-round-xl mt-3 h-18rem  p-1 m-2 overflow-scroll">
      <h3>Для изучения вам рекомедованы следующие темы:</h3>
      <ul>
        <li>1. Основы финансов</li>
        <li>2. Экономика и анализ</li>
        <li>3. Управление временем</li>
        <li>4. Основы маркетинга</li>
        <li>1. Основы финансов</li>
        <li>2. Экономика и анализ</li>
        <li>3. Управление временем</li>
        <li>4. Основы маркетинга</li>
      </ul>
    </div>
  </div>
</template>

<script>
import instance from "../Api/instance.js";
export default {
  data() {
    return {
      username: null,
      user: {
        fullName: 'Иванов Иван Иванович',
        userName: 'ivanov123',
        age: 30,
        region: 'Москва',
        photoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKaiKiPcLJj7ufrj6M2KaPwyCT4lDSFA5oog&s' // Ссылка на фото профиля
      },
      selectedCategory: 'events' // Начальная выбранная категория
    };
  },

  methods: {
    editProfile() {
      // Логика редактирования профиля
      console.log("Редактировать профиль");
    },
    post_User_data: function() {
      let tg = window.Telegram.WebApp;
      instance.post('/user/auth', null,{params:{init_data: tg.initData}}).then(res => {
        this.username = res.data.username;
      })
    },

  },
  beforeMount() {
    this.post_User_data()
  },
};
</script>
<style scoped>


.user-profile-full {
  height: 94vh;
}

.profile-photo {
  border-radius: 50%;
}

.user-profile {
  background-color: rgb(66, 115, 195);

}

button{
  background-color: rgb(46, 76, 124);
  outline: none;
}

.events, .statistics, .topics{
  background-color: rgb(66, 115, 195);
}

</style>
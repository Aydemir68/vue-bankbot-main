<template>
  <div class="">
    <div class="user-profile flex flex-column justify-content-center border-round-2xl m-2 pt-4">
      <!-- Блок с фото профиля и кнопкой -->
      <div class="profile-container align-items-center">
        <img class="profile-photo" :src="user.photoUrl" alt="Фото профиля" />
        <!-- Кнопка редактирования профиля под фото -->
        <div class="edit-profile mt-2">
          <button @click="this.visible = true" class="text-white bg-primary-400 hover:bg-primary-800 active:bg-primary-600">Редактировать профиль</button>
        </div>
        <Dialog v-model:visible="visible" modal header="Редактировать профиль" :style="{ width: '24rem' }">
          <span class="text-surface-500 dark:text-surface-400 block mb-2">Обновите информацию о себе..</span>
          <div class="flex items-center gap-4 mb-2">
            <label class="font-semibold w-24 justify-content-center" >Фамилия</label>
            <InputText id="username" class="flex-auto w-10rem" autocomplete="off" v-model="user_update.surname" />
          </div>
          <div class="flex items-center gap-4 mb-2">
            <label class="font-semibold w-24 justify-content-center">Имя</label>
            <InputText id="username" class="flex-auto" autocomplete="off" v-model="user_update.name"/>
          </div>
          <div class="flex items-center gap-4 mb-2">
            <label class="font-semibold w-24 justify-content-center">Отчество</label>
            <InputText id="username" class="flex-auto" autocomplete="off" v-model="user_update.patronymic"/>
          </div>
          <div class="flex items-center gap-4 mb-2">
            <label class="font-semibold w-24 justify-content-center">Возраст</label>
            <InputNumber v-model="user_update.age" inputId="integeronly" class="flex-auto" fluid />
          </div>
          <div class="flex items-center gap-4 mb-2">
            <label class="font-semibold w-24 justify-content-center w-16rem">Регион</label>
            <Select v-model="user_update.region" :options="cities" optionLabel="name" placeholder="Выберите регион"
                    class="w-full md:w-56"/>
          </div>


          <div class="flex justify-end pt-2 gap-2">
            <Button type="button" class="text-white" label="Отмена" severity="secondary" @click="cancel"></Button>
            <Button type="button" class="text-white" label="Сохранить" @click="save"></Button>
          </div>
        </Dialog>
      </div>

      <!-- Информация о пользователе -->
      <div class="user-info mt-2 m">
        <p><strong>ФИО:</strong> {{ user.surname + ' ' + user.name + ' ' + user.patronymic }}</p>
        <p><strong>Имя пользователя:</strong> {{ user.userName }}</p>
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
    <div v-if="selectedCategory === 'events'" class="events border-round-xl mt-3 p-1 m-2 overflow-scroll">
          <h3>Запланированные мероприятия:</h3>
          <ul>
            <li>15.12.2024 - Вебинар по финансовой грамотности</li>
            <li>20.12.2024 - Совещание с командой</li>
            <li>25.12.2024 - Подведение итогов года</li>
          </ul>
    </div>

    <div v-if="selectedCategory === 'statistics'" class="statistics border-round-xl mt-3 p-1 m-2 overflow-scroll">
      <h3>Ваша статистика прохождения тестов за все время:</h3>
      <ul>
        <li>Завершено тестов: 10</li>
        <li>Средний балл: 85%</li>
        <li>Ожидаемые результаты: 90%</li>
      </ul>
    </div>

    <div v-if="selectedCategory === 'topics'" class="topics border-round-xl mt-3 p-1 m-2 overflow-scroll">
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
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select';
import Button from "primevue/button";
export default {
  data() {
    return {
      username: null,
      visible: false,
      user: {
        surname: 'Иванов',
        name: 'Иван',
        patronymic: 'Иванович',
        userName: 'ivanov123',
        age: 30,
        region: 'Москва',
        photoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKaiKiPcLJj7ufrj6M2KaPwyCT4lDSFA5oog&s' // Ссылка на фото профиля
      },
      user_update: {
        surname: 'Иванов',
        name: 'Иван',
        patronymic: 'Иванович',
        userName: 'ivanov123',
        age: 30,
        region: 'Москва',
        photoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKaiKiPcLJj7ufrj6M2KaPwyCT4lDSFA5oog&s' // Ссылка на фото профиля
      },
      selectedCategory: 'events', // Начальная выбранная категория
      selectedCity: null,
      cities: [
        { name: 'Москва', code: 'MSC' },
        { name: 'РД', code: 'RD' },
        { name: 'КБР', code: 'KBR' },
        { name: 'КЧР', code: 'KCHR' },
        { name: 'ЧР', code: 'CHR' }
      ]
    };
  },
  components: {
    Dialog,
    InputText,
    InputNumber,
    Select,
    Button
  },
  methods: {
    save() {
      this.user = this.user_update;
      this.user.region = this.user_update.region.name;
      this.visible = false;
    },
    cancel() {
      this.user_update = this.user;
      this.visible = false;
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



.profile-photo {
  border-radius: 50%;
}

.user-profile {
  background-color: #2A3F4F;

}

button{
  background-color: #2A3F4F;
  outline: none;
}

.events, .statistics, .topics{
  background-color: #2A3F4F;
  height: 28%;
}

</style>
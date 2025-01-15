<template>
  <div class="overflow-y-scroll">
    <div class="user-profile flex flex-column border-round-2xl">
      <!-- Блок с фото профиля и кнопкой -->
      <div class="flex flex-column align-items-center">
        <img class="profile-photo" :src="this.url" alt="Фото профиля" />
        <!-- Кнопка редактирования профиля под фото -->
        <div class="edit-profile">
          <button @click="" class="text-white bg-primary-400 hover:bg-primary-800 active:bg-primary-600">Редактировать профиль</button>
        </div>
        <Dialog v-model:visible="visible" :closable="false" modal header="Зарегистрироваться" class="flex flex-column" :style="{ width: '22rem' }">
          <span class="text-surface-500 dark:text-surface-400 block mb-2">Заполните информацию о себе.</span>
          <div class="flex items-center gap-4 mb-2">
            <label class="font-semibold justify-content-center w-5" >Фамилия</label>
            <InputText id="username" class="flex w-full" autocomplete="off" v-model="user_update.surname" />
          </div>
          <div class="flex items-center gap-4 mb-2">
            <label class="font-semibold justify-content-center w-5">Имя</label>
            <InputText id="username" class="flex w-full" autocomplete="off" v-model="user_update.name"/>
          </div>
          <div class="flex items-center gap-4 mb-2">
            <label class="font-semibold justify-content-center w-5">Отчество</label>
            <InputText id="username" class="flex w-full" autocomplete="off" v-model="user_update.patronymic"/>
          </div>
          <div class="flex items-center gap-4 mb-2">
            <label class="font-semibold justify-content-center w-5">Возраст</label>
            <InputNumber v-model="user_update.age" inputId="integeronly" class="flex-auto" fluid />
          </div>
          <div class="flex items-center gap-4 mb-2">
            <label class="font-semibold justify-content-center w-16rem">Регион</label>
            <Select v-model="user_update.region" :options="cities" optionLabel="name" placeholder="Выберите регион"
                    class="w-full md:w-50"/>
          </div>


          <div class="flex justify-content-end p-0 m-0 pt-2 gap-2">
            <Button type="button" class="text-white" label="Зарегистрироваться" @click="save"></Button>
          </div>
        </Dialog>
      </div>

      <!-- Информация о пользователе -->
      <div class="user-info p-2">
        <p class="m-0 mt-1"><strong>ФИО:</strong> {{ user.surname + ' ' + user.name + ' ' + user.patronymic }}</p>
        <p class="m-0 mt-1"><strong>Возраст:</strong> {{ user.age }}</p>
        <p class="m-0 mt-1"><strong>Регион:</strong> {{ user.region }}</p>
      </div>
    </div>

    <!-- Выпадающий список для выбора категории -->
    <div class="pt-1">
      <select v-model="selectedCategory" id="category" class="border-round bg-primary-100 h-2rem text-gray-800">
        <option value="events">Запланированные мероприятия</option>
        <option value="statistics">Статистика тестов</option>
        <option value="topics">Темы для изучения</option>
      </select>
    </div>

    <!-- Контент в зависимости от выбранной категории -->
    <div v-if="selectedCategory === 'events'" class="events border-round-xl m-3">
      <h3 class="m-0 p-0 py-2">Запланированные мероприятия:</h3>
      <div class="overflow-y-auto ul-height">
        <ul>
          <li>15.12.2024 - Вебинар по финансовой грамотности</li>
          <li>20.12.2024 - Совещание с командой</li>
          <li>25.12.2024 - Подведение итогов года</li>
        </ul>
      </div>
    </div>

    <div v-if="selectedCategory === 'statistics'" class="statistics border-round-xl m-2">
      <h3 class="m-0 p-0 py-2">Ваша статистика прохождения тестов за все время:</h3>
      <div class="overflow-y-auto ul-height">
        <ul>
          <li>Завершено тестов: 10</li>
          <li>Средний балл: 85%</li>
          <li>Ожидаемые результаты: 90%</li>
        </ul>
      </div>
    </div>

    <div v-if="selectedCategory === 'topics'" class="topics border-round-xl m-2">
      <h3 class="m-0 p-0 py-2">Для изучения вам рекомедованы следующие темы:</h3>
      <div class="overflow-y-auto ul-height">
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
      test: "",
      username: null,
      visible: false,
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKaiKiPcLJj7ufrj6M2KaPwyCT4lDSFA5oog&s',
      user: {
        tg_id: 0,
        surname: '',
        name: '',
        patronymic: '',
        age: 0,
        region: ''
      },
      user_update: {
        tg_id: 0,
        surname: '',
        name: '',
        patronymic: '',
        age: 0,
        region: ''
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
      let tg = window.Telegram.WebApp;

      instance.post('/auth/registration', {
        initData: tg.initData,
        surname: this.user_update.surname,
        name: this.user_update.name,
        patronymic: this.user_update.patronymic,
        age: this.user_update.age,
        region: this.user_update.region['name'],
      }, {headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        this.visible = false;
        this.user = this.user_update;
        this.post_User_data();
      }).catch((err) => {
        console.log(err);
      })
    },
    post_User_data: function() {
      let tg = window.Telegram.WebApp;
      this.test = tg.initData;

      instance.get('/auth/login', {params:{init_data: tg.initData}}).then(res => {
        this.user.surname = res.data.surname;
        this.user.name = res.data.name;
        this.user.patronymic = res.data.patronymic;
        this.user.age = res.data.age;
        this.user.region = res.data.region;
      }).catch(err => {
        this.visible = true;
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
  scale: 70%;
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
  height: 30%;
}

.ul-height {
  height: 95%;
}

</style>
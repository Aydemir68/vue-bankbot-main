<template>
  <div class="overflow-y-scroll">
    <div class="user-profile flex flex-column border-round-2xl">
      <!-- Блок с фото профиля и кнопкой -->
      <div class="flex flex-column align-items-center">
        <!--    Регистрация / Редактиврование пользователя    -->
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
      <div class="flex flex-column gap-1 w-full p-3">
        <img class="flex profile-photo" :src="this.user_photo" alt="Фото профиля" />
        <Button class="mt-2 mt-btn">Редактировать профиль </Button>
        <div class="flex font-semibold text-xl">{{ user.surname + ' ' + user.name + ' ' + user.patronymic }}</div>
        <div class="flex text-lg"><strong>Возраст:&nbsp;</strong> {{ user.age }}</div>
        <div class="flex text-lg"><strong>Регион:&nbsp;</strong>{{ user.region }}</div>
      </div>
    </div>
    <div>
      <button @click="qr_code_scan">Сканировать для регистрации</button>
    </div>
    <Accordion value="0" class="my-tab">
      <AccordionPanel value="0" accordion>
        <AccordionHeader class="outline-none text-lg text-left">Запланированные мероприятия</AccordionHeader>
        <AccordionContent>
          <div class="m-0 text-left">
              <p>1. Опрос по финансовой грамотности и потребительских настроений.</p>
              <p>2. Финансовый навигатор. Входной опрос.</p>
              <p>3. Встреча с командой.</p>
              <p>4. Презентация продукта. 21.12.25</p>
          </div>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel value="1">
        <AccordionHeader class="outline-none text-lg text-left">Темы для изучения</AccordionHeader>
        <AccordionContent>
          <div class="m-0 text-left">
            <p>1. Вклады и накопления.</p>
            <p>2. Планирование расходов на новый год.</p>
            <p>3. Подготовка детей к школе.</p>
            <p>4. Акции и облигации.</p>
          </div>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel value="2">
        <AccordionHeader class="outline-none text-lg text-left">Статистика</AccordionHeader>
        <AccordionContent>
          <div class="m-0 text-left">
              Статистики не найдено!
          </div>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>

  </div>
</template>

<script>
import instance from "../Api/instance.js";
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select';
import Button from "primevue/button";
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';

export default {
  data() {
    return {
      mediaStream: null, // Для хранения потока медиа
      isCameraActive: false, // Флаг состояния камеры
      test: "",
      username: null,
      visible: false,
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKaiKiPcLJj7ufrj6M2KaPwyCT4lDSFA5oog&s',
      user_photo: null,
      user: {
        tg_id: 0,
        surname: 'Иванов',
        name: 'Иван',
        patronymic: 'Иванович',
        age: 33,
        region: 'КБР'
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
    Button,
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
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
        this.user_photo = tg.initDataUnsafe.user.photo_url;
      }).catch(err => {
        this.user_photo = this.url
        this.visible = true;
      })
    },
    qr_code_scan: function() {
      this.$router.push('qr_code');
    }
  },
  beforeMount() {
    this.post_User_data()
  },
};
</script>

<style scoped>

.my-tab {
  --p-accordion-header-border-width: 0;
  --p-accordion-panel-border-width: 0;
  --p-accordion-header-active-hover-background: transparent;
  --p-accordion-panel-border-color: transparent;
  --p-accordion-header-background: transparent;
  --p-accordion-header-hover-background: transparent;
  --p-accordion-header-hover-color: white;
  --p-accordion-header-color: white;
  --p-accordion-header-active-color: #8cb3e3;
  --p-accordion-header-active-background: transparent;
  --p-accordion-content-background: transparent;
  --p-accordion-content-color: white;
  outline: none;
}

.user-profile {
  background-color: #2A3F4F;
}

.profile-photo {
  width: 100%;
}

.mt-btn {
  --p-button-primary-background: #50b455;
  --p-button-primary-hover-background: #50b455;
  --p-button-primary-active-background: #3f8e44;
  outline: none;
}

</style>
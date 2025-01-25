<template>
  <div class="overflow-y-scroll">
    <div class="user-profile flex flex-column border-round-2xl">
      <!-- Блок с фото профиля и кнопкой -->
      <div class="flex flex-column align-items-center">
        <!--    Регистрация / Редактиврование пользователя    -->
        <Dialog v-model:visible="visible" :closable="false" modal header="Регистрация" class="flex flex-column bg-gray-200" :style="{ width: '22rem' }">
          <span class="flex text-surface-500 dark:text-surface-400 block mb-2">Заполните информацию о себе.</span>

          <div class="flex flex-column gap-1">
            <IftaLabel class="flex w-full">
              <InputText id="surname" class="flex w-full" placeholder="Фамилия" autocomplete="off" v-model="user_update.surname" />
              <label>Фамилия</label>
            </IftaLabel>

            <IftaLabel class="flex w-full">
              <InputText id="name" class="flex w-full"  placeholder="Имя" autocomplete="off" v-model="user_update.name"/>
              <label>Имя</label>
            </IftaLabel>

            <IftaLabel class="flex w-full">
              <InputText id="patronymic" class="flex w-full"  placeholder="Имя" autocomplete="off" v-model="user_update.patronymic"/>
              <label>Отчество</label>
            </IftaLabel>

            <IftaLabel class="flex w-full">
              <InputNumber v-model="user_update.age" inputId="integeronly" placeholder="Возраст" class="flex-auto" fluid />
              <label>Возраст</label>
            </IftaLabel>

            <IftaLabel class="flex w-full">
              <Select v-model="user_update.region" :options="cities" optionLabel="name" placeholder="Выберите регион"
                      filter class="w-full" :overlay-style="{
                        maxWidth: '100vw',
                        width: '0',
                        wordWrap: 'break-word',
                      }"/>
              <label>Регион</label>
            </IftaLabel>

            <IftaLabel class="flex w-full">
              <Select v-model="user_update.education" :options="education_levels" optionLabel="name" placeholder="Уровень образования"
                      filter class="w-full" :overlay-style="{
                        maxWidth: '100vw',
                        width: '0',
                        wordWrap: 'break-word',
                      }"/>
              <label>Образование</label>
            </IftaLabel>
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
        <div class="flex font-semibold text-xl text-left">{{ user.surname + ' ' + user.name + ' ' + user.patronymic }}</div>
        <div class="flex text-lg text-left"><strong>Возраст:&nbsp;</strong> {{ user.age }}</div>
        <div class="flex text-lg text-left"><strong>Регион:&nbsp;</strong>{{ user.region }}</div>
        <div class="flex text-lg text-left"><strong>Образование:&nbsp;</strong>{{ user.education }}</div>
      </div>
    </div>
    <div>
      <button @click="qr_code_scan" class="bg-white">Сканировать для регистрации</button>
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
import IftaLabel from 'primevue/iftalabel'
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
        region: 'КБР',
        education: 'Не выбрано',
      },
      user_update: {
        tg_id: 0,
        surname: '',
        name: '',
        patronymic: '',
        age: 0,
        region: '',
        education: '',
      },
      selectedCity: null,
      cities: [
        { name: 'Республика Адыгея', code: 'AD' },
        { name: 'Республика Алтай', code: 'AL' },
        { name: 'Республика Башкортостан', code: 'BA' },
        { name: 'Республика Бурятия', code: 'BU' },
        { name: 'Республика Дагестан', code: 'DA' },
        { name: 'Республика Ингушетия', code: 'ING' },
        { name: 'Кабардино-Балкарская Республика', code: 'KB' },
        { name: 'Республика Калмыкия', code: 'KL' },
        { name: 'Карачаево-Черкесская Республика', code: 'KC' },
        { name: 'Республика Карелия', code: 'KR' },
        { name: 'Республика Коми', code: 'KO' },
        { name: 'Республика Крым', code: 'CR' },
        { name: 'Республика Марий Эл', code: 'ME' },
        { name: 'Республика Мордовия', code: 'MO' },
        { name: 'Республика Саха (Якутия)', code: 'SA' },
        { name: 'Республика Северная Осетия-Алания', code: 'SE' },
        { name: 'Республика Татарстан', code: 'TA' },
        { name: 'Республика Тыва', code: 'TY' },
        { name: 'Удмуртская Республика', code: 'UD' },
        { name: 'Республика Хакасия', code: 'HA' },
        { name: 'Чеченская Республика', code: 'CE' },
        { name: 'Чувашская Республика', code: 'CH' },
        { name: 'Алтайский край', code: 'ALTA' },
        { name: 'Забайкальский край', code: 'ZAB' },
        { name: 'Камчатский край', code: 'KA' },
        { name: 'Краснодарский край', code: 'KRD' },
        { name: 'Красноярский край', code: 'KYA' },
        { name: 'Пермский край', code: 'PE' },
        { name: 'Приморский край', code: 'PRI' },
        { name: 'Ставропольский край', code: 'STA' },
        { name: 'Хабаровский край', code: 'KHA' },
        { name: 'Амурская область', code: 'AMU' },
        { name: 'Архангельская область', code: 'ARK' },
        { name: 'Ненецкий автономный округ', code: 'NE' },
        { name: 'Астраханская область', code: 'AST' },
        { name: 'Белгородская область', code: 'BEL' },
        { name: 'Брянская область', code: 'BRY' },
        { name: 'Владимирская область', code: 'VLA' },
        { name: 'Волгоградская область', code: 'VOL' },
        { name: 'Вологодская область', code: 'VO' },
        { name: 'Воронежская область', code: 'VOR' },
        { name: 'Ивановская область', code: 'IVA' },
        { name: 'Иркутская область', code: 'IRK' },
        { name: 'Калининградская область', code: 'KGD' },
        { name: 'Калужская область', code: 'KLU' },
        { name: 'Кемеровская область - Кузбасс', code: 'KE' },
        { name: 'Кировская область', code: 'KIR' },
        { name: 'Костромская область', code: 'KOS' },
        { name: 'Курганская область', code: 'KG' },
        { name: 'Курская область', code: 'KUR' },
        { name: 'Ленинградская область', code: 'LEN' },
        { name: 'Липецкая область', code: 'LIP' },
        { name: 'Магаданская область', code: 'MAG' },
        { name: 'Московская область', code: 'MOS' },
        { name: 'Мурманская область', code: 'MUR' },
        { name: 'Нижегородская область', code: 'NGR' },
        { name: 'Новгородская область', code: 'NGRD' },
        { name: 'Новосибирская область', code: 'NOV' },
        { name: 'Омская область', code: 'OM' },
        { name: 'Оренбургская область', code: 'ORE' },
        { name: 'Орловская область', code: 'ORL' },
        { name: 'Пензенская область', code: 'PEN' },
        { name: 'Псковская область', code: 'PSK' },
        { name: 'Ростовская область', code: 'ROS' },
        { name: 'Рязанская область', code: 'RYA' },
        { name: 'Самарская область', code: 'SAM' },
        { name: 'Саратовская область', code: 'SAR' },
        { name: 'Сахалинская область', code: 'SAK' },
        { name: 'Свердловская область', code: 'SVE' },
        { name: 'Смоленская область', code: 'SMO' },
        { name: 'Тамбовская область', code: 'TAM' },
        { name: 'Тверская область', code: 'TVE' },
        { name: 'Томская область', code: 'TOM' },
        { name: 'Тульская область', code: 'TUL' },
        { name: 'Тюменская область', code: 'TYU' },
        { name: 'Ханты-Мансийский автономный округ - Югра', code: 'KH' },
        { name: 'Ямало-Ненецкий автономный округ', code: 'YA' },
        { name: 'Ульяновская область', code: 'ULY' },
        { name: 'Челябинская область', code: 'CHE' },
        { name: 'Ярославская область', code: 'YAR' },
        { name: 'г Москва - город федерального значения', code: 'MOW' },
        { name: 'г Санкт-Петербург - город федерального значения', code: 'SPE' },
        { name: 'г Севастополь - город федерального значения', code: 'SEV' },
        { name: 'Еврейская автономная область', code: 'EAO' },
        { name: 'Чукотский автономный округ', code: 'CHU' }
      ],
      education_levels: [
        { name: 'Среднее (школа)', code: 's' },
        { name: 'Среднее специальное (колледж, училище)', code: 'ss' },
        { name: 'Неполное высшее', code: 'nv' },
        { name: 'Высшее, в том числе бакалавриат/магистратура', code: 'v' },
        { name: 'Учебная степень', code: 'ych' }
      ]
    };
  },
  components: {
    Dialog,
    InputText,
    InputNumber,
    IftaLabel,
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
        education: this.user_update.education['name']
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
        this.user.education = res.data.education;
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
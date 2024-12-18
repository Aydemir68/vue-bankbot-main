<script>
import Opros_vhod from "./Opros_vhod.vue";
import Opros_vihod from "./Opros_vihod.vue";
import third_opros from "./Third_opros.vue";
export default {
  components: {
    Opros_vhod,
    Opros_vihod,
    third_opros
  },
  data() {
    return {
      link1: "/test/test1",
      link2: "/test/test2",
      link3: "/test/test3",
      searchQuery: "", // Переменная для поиска
      sortByField: "name", // Поле для сортировки (по умолчанию "name")
      sortOrder: 1, // Порядок сортировки: 1 для возрастания, -1 для убывания
      selectedFile: null, // Выбранный файл (тест)
      files: [
        {
          id: '1',
          name: "Финансовый навигатор. Входной опрос 2024 ",
          date: "10.11.2024",
          isPassed: true,
          correctPercentage: 85,
          attempts: 3,
          json: "./Vhod.json",
        },
        {
          id: '2',
          name: "Финансовый навигатор. Завершающий опрос 2024 ",
          date: "12.11.2024",
          isPassed: false,
          correctPercentage: 0,
          attempts: 1,
          json: "./Vihod.json",
        },        {
          id: '3',
          name: "Исследование инфляции и финансовой грамотности",
          date: "12.11.2024",
          isPassed: false,
          correctPercentage: 0,
          attempts: 1,
          json: ".questions.json",
        },
      ],
    };
  },
  computed: {
    // Фильтруем файлы по имени
    filteredFiles() {
      return this.files
          .filter((file) =>
              file.name.toLowerCase().includes(this.searchQuery.toLowerCase())
          )
          .sort((a, b) => {
            // Сортируем по указанному полю
            if (a[this.sortByField] > b[this.sortByField]) {
              return this.sortOrder;
            } else if (a[this.sortByField] < b[this.sortByField]) {
              return -this.sortOrder;
            }
            return 0;
          });
    },
  },
  methods: {
    goToOpros() {
      this.$router.push('/test/test');
    },
    // Меняем поле и порядок сортировки
    sortBy(field) {
      if (this.sortByField === field) {
        this.sortOrder *= -1; // Меняем порядок сортировки
      } else {
        this.sortByField = field; // Устанавливаем новое поле сортировки
        this.sortOrder = 1; // По умолчанию сортировка по возрастанию
      }
    },
    // Обработчик для выбора теста
    selectTest(file) {
      // Если выбран тот же тест, снимаем выделение
      if (this.selectedFile === file) {
        this.selectedFile = null;
      } else {
        this.selectedFile = file;
      }
    },
  },
};
</script>

<template>
  <div class="file-list w-full">
    <!-- Поле для поиска -->
    <input
        type="text"
        v-model="searchQuery"
        placeholder="Поиск по имени..."
        class="search-bar border-round p-3 m-2 mt-3 w-20rem"
    />

    <!-- Кнопки сортировки -->
    <div class="sort-buttons">
      <button @click="sortBy('name')" class="text-white hover:bg-primary-800 active:bg-primary-600 pl-2 pr-2 m-2 w-10rem">Сортировать по имени</button>
      <button @click="sortBy('date')" class="text-white hover:bg-primary-800 active:bg-primary-600 pl-2 pr-2 m-2 w-10rem">Сортировать по дате</button>
    </div>

    <!-- Список файлов -->
    <ul class="file-items border-round-xl m-2">
      <li
          v-for="file in filteredFiles"
          :key="file.name"
          class="file-item p-1"
          @click="selectTest(file)"
      >
        <i class="pi pi-file mr-5" /> <!-- Иконка файла -->
        <div>
          <span class="file-name">{{ file.name }}</span>
          <small class="file-info">({{ file.date }})</small>
        </div>

        <!-- Информация о выбранном тесте (отображается только если выбран тест) -->
        <div v-if="selectedFile === file" class="test-details p-1">
          <p><strong>Статус:</strong> {{ file.isPassed ? 'Пройден' : 'Не пройден' }}</p>
          <p><strong>Процент правильных ответов:</strong> {{ file.correctPercentage }}%</p>
          <p><strong>Количество попыток:</strong> {{ file.attempts }}</p>

<<<<<<< Updated upstream
          <div v-if="file.id === '1'">
            <RouterLink :to="this.link1" class="start-test-button border-round-lg text-white bg-gray-800 pl-3 pr-3 p-2 mr-5 mb-1 hover:bg-primary-800 active:bg-primary-600 m-1 h-3rem">
              Пройти
            </RouterLink>
          </div>
          <div v-if="file.id === '2'">
            <RouterLink :to="this.link2" class="start-test-button border-round-lg text-white bg-gray-800 pl-3 pr-3 p-2 mr-5 hover:bg-primary-800 active:bg-primary-600 m-1 h-3rem">
              Пройти
            </RouterLink>
          </div>
          <div v-if="file.id === '3'">
            <RouterLink :to="this.link3" class="start-test-button border-round-lg text-white bg-gray-800 pl-3 pr-3 p-2 mr-5 hover:bg-primary-800 active:bg-primary-600 m-1 h-3rem">
              Пройти
            </RouterLink>
          </div>
=======
            <button
                class="flex px-4 py-2 items-center cursor-pointer hover:text-white
                            active:bg-black-alpha-10 text-gray-900 no-underline"
                @click="goToOpros"
            >
              Пройти
            </button>

>>>>>>> Stashed changes
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>

button{
  background-color: rgb(46, 76, 124);
  outline: none;
}

.file-list{
  height: 94vh;
}


.file-items {
  background-color: rgb(66, 115, 195);
}


</style>

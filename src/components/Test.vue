<script>
import instance from "../Api/instance.js";
import Select from 'primevue/select';

export default {
  data() {
    return {
      searchQuery: "", // Переменная для поиска
      sortByField: "name", // Поле для сортировки (по умолчанию "name")
      sortOrder: 1, // Порядок сортировки: 1 для возрастания, -1 для убывания
      selectedFile: null, // Выбранный файл (тест)
      selectedFilter: "all",
      selectedSort: "byNameASC",
    };
  },

  components: [
    Select
  ],

  computed: {
    filteredFiles() {
      if (this.files != null)
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
      else return 0;
    },
    selectedText() {
      const options = {
        all: 'Все тесты',
        passed: 'Пройденные тесты',
      };
      return options[this.selectedFilter];
    },
    files() {
      if (this.selectedText === "Пройденные тесты")
        return this.passed_tests
      else return this.tests
    },
    passed_tests() {
      return this.$store.getters["GET_PASSED_SURVEYS"];
    },
    tests() {
      return this.$store.getters["GET_SURVEYS"];
    },
  },

  created() {
    this.id = this.$route.params.id;
    console.log('ID из маршрута:', this.id); // Убедитесь, что параметр id существует
    if (this.$store.getters["GET_CURRENT_SURVEY_ID"] !== null) {
      console.log('fafasf')
    }
  },

  methods: {
    // Меняем поле и порядок сортировки
    sortBy() {
      switch (this.selectedSort) {
        case "byNameASC": {
          this.sortByField = "name";
          this.sortOrder = 1;
          break;
        }
        case "byNameDESC": {
          this.sortByField = "name";
          this.sortOrder = -1;
          break;
        }
        case "byDateASC": {
          this.sortByField = "date";
          this.sortOrder = 1;
          break;
        }
        case "byDateDESC": {
          this.sortByField = "date";
          this.sortOrder = -1;
          break;
        }
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

  mounted() {
    this.$store.dispatch("getAllSurveys");
    this.$store.dispatch("getPassedSurveys");
    if (this.$store.getters["GET_CURRENT_SURVEY_ID"] !== null) {
      this.$router.push({path: `/test/${this.$store.getters["GET_CURRENT_SURVEY_ID"]}`});
    }
  }
};
</script>

<template>
  <div class="w-full">
    <!-- Поле для поиска -->
    <div class="w-full p-2">
      <input type="text" v-model="searchQuery" placeholder="Поиск по имени..."
             class="border-none p-2 w-full"/>
    </div>

    <div class="flex gap-2 p-2">
    <!--   Фильтр пройденных тестов   -->
      <select id="test-filter" v-model="selectedFilter" class="flex w-full m-0 border-0">
        <option value="all">Все тесты</option>
        <option value="passed">Пройденные тесты</option>
      </select>

      <!--   Сортировка тестов   -->
      <select id="test-filter" v-model="selectedSort" class="flex w-full m-0" @change="sortBy()">
        <option value="byNameASC">По названию (↑)</option>
        <option value="byNameDESC">По названию (↓)</option>
        <option value="byDateASC">По дате (↑)</option>
        <option value="byDateDESC">По дате (↓)</option>
      </select>
    </div>

    <!-- Список файлов -->
    <div class="flex flex-column w-full gap-2 justify-content-center align-items-center p-2">
      <div v-for="file in filteredFiles" v-if="!(file in passed_tests)" :key="file.name" class="flex flex-column w-full p-2 bg-black-alpha-20 border-round"
           @click="selectTest(file)">
        <!-- Иконка файла -->
        <i class="pi pi-file" />
        <div class="m-2"  >
          <span class="file-name">{{ file.name }}</span>
          <small class="file-info">({{ file.date }})</small>
        </div>

        <!-- Информация о выбранном тесте (отображается только если выбран тест) -->
        <div v-if="selectedFile === file" class="w-full">

          <p><strong>Процент правильных ответов:</strong> 0%</p>
          <p><strong>Количество попыток:</strong> {{ file.number_of_attempts }}</p>

          <div class="p-3">
            <RouterLink
                :to="`/test/${file.id}`"
                class="border-round-lg text-white bg-primary-800 px-4 py-2 active:bg-primary-600 h-3rem">
              Пройти
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

* {
  margin: 0;
  padding: 0;
}

button{
  background-color: rgb(46, 76, 124);
  outline: none;
}

select {
  background-color: #1d3557; /* Цвет фона, аналогичный кнопкам */
  color: white; /* Цвет текста */
  border: 1px solid white; /* Белая граница */
  border-radius: 4px; /* Закругленные углы */
  padding: 5px; /* Внутренний отступ */
  width: 10rem; /* Ширина аналогична кнопкам */
}

select:focus {
  outline: none;
  border: 1px solid #a8dadc; /* Подсветка при фокусе */
}
</style>

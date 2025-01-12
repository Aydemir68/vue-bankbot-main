<script>

export default {
  data() {
    return {
      searchQuery: "", // Переменная для поиска
      sortByField: "name", // Поле для сортировки (по умолчанию "name")
      sortOrder: 1, // Порядок сортировки: 1 для возрастания, -1 для убывания
      selectedFile: null, // Выбранный файл (тест)

    };
  },
  computed: {
    // Фильтруем файлы по имени
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
    files() {
      return this.$store.getters["GET_SURVEYS"];
    }
  },
  created() {
    this.id = this.$route.params.id;
    console.log('ID из маршрута:', this.id); // Убедитесь, что параметр id существует
  },
  methods: {
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
  mounted() {
    this.$store.dispatch("getAllSurveys");
  }
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


    <div class="filter-dropdown m-2">
      <select id="test-filter" v-model="selectedFilter" @change="filterTests" class="filter-select">
        <option value="all">Все тесты</option>
        <option value="passed">Пройденные тесты</option>
        <option value="not-passed">Непройденные тесты</option>
      </select>
    </div>

    <!-- Список файлов -->
    <div class="file-items flex flex-column justify-content-center align-items-center border-round-xl m-2">
      <div
          v-for="file in filteredFiles"
          :key="file.name"
          class="p-1"
          @click="selectTest(file)">

        <i class="pi pi-file" /> <!-- Иконка файла -->
        <div>
          <span class="file-name">{{ file.name }}</span>
          <small class="file-info">({{ file.date }})</small>
        </div>

        <!-- Информация о выбранном тесте (отображается только если выбран тест) -->
        <div v-if="selectedFile === file" class="p-1">
          <p><strong>Процент правильных ответов:</strong> 0%</p>
          <p class="mb-3"><strong>Количество попыток:</strong> {{ file.number_of_attempts }}</p>
          <div>
            <RouterLink
                :to="`/test/${file.id}`"
                class="start-test-button border-round-lg text-white bg-gray-800 p-2 hover:bg-primary-800 active:bg-primary-600 m-1 h-3rem">
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

.file-items {
  background-color: rgb(66, 115, 195);
}
select {
  background-color: #1d3557; /* Цвет фона, аналогичный кнопкам */
  color: white; /* Цвет текста */
  border: 1px solid white; /* Белая граница */
  border-radius: 4px; /* Закругленные углы */
  padding: 5px; /* Внутренний отступ */
  width: 10rem; /* Ширина аналогична кнопкам */
  margin-top: 10px; /* Отступ сверху */
}

select:hover {
  background-color: #457b9d; /* Цвет фона при наведении */
}

select:focus {
  outline: none;
  border: 2px solid #a8dadc; /* Подсветка при фокусе */
}

</style>

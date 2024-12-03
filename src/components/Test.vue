<script>
import Opros_vhod from "./Opros_vhod.vue";
export default {
  components: {
    Opros_vhod,
  },
  data() {
    return {
      link: "/test/test",
      searchQuery: "", // Переменная для поиска
      sortByField: "name", // Поле для сортировки (по умолчанию "name")
      sortOrder: 1, // Порядок сортировки: 1 для возрастания, -1 для убывания
      selectedFile: null, // Выбранный файл (тест)
      files: [
        {
          name: "Банковская безопасность и защита данных ",
          date: "23.11.2024",
          isPassed: true,
          correctPercentage: 85,
          attempts: 3,
        },
        {
          name: "Работа с корпоративными клиентами ",
          date: "29.11.2024",
          isPassed: false,
          correctPercentage: 0,
          attempts: 1,
        },
        {
          name: "Операции с ипотечными кредитами ",
          date: "01.12.2024",
          isPassed: true,
          correctPercentage: 92,
          attempts: 2,
        },
        {
          name: "Оценка и работа с рисками инвестиций ",
          date: "10.12.2024",
          isPassed: true,
          correctPercentage: 78,
          attempts: 4,
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
      this.$router.push('/opros');
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
  <div class="file-list">
    <h2 class="file-list-title">Список тестов</h2>

    <!-- Поле для поиска -->
    <input
        type="text"
        v-model="searchQuery"
        placeholder="Поиск по имени..."
        class="search-bar"
    />

    <!-- Кнопки сортировки -->
    <div class="sort-buttons">
      <button @click="sortBy('name')">Сортировать по имени</button>
      <button @click="sortBy('date')">Сортировать по дате</button>
    </div>

    <!-- Список файлов -->
    <ul class="file-items">
      <li
          v-for="file in filteredFiles"
          :key="file.name"
          class="file-item"
          @click="selectTest(file)"
      >
        <i class="pi pi-file" /> <!-- Иконка файла -->
        <div>
          <span class="file-name">{{ file.name }}</span>
          <small class="file-info">({{ file.date }})</small>
        </div>

        <!-- Информация о выбранном тесте (отображается только если выбран тест) -->
        <div v-if="selectedFile === file" class="test-details">
          <p><strong>Статус:</strong> {{ file.isPassed ? 'Пройден' : 'Не пройден' }}</p>
          <p><strong>Процент правильных ответов:</strong> {{ file.correctPercentage }}%</p>
          <p><strong>Количество попыток:</strong> {{ file.attempts }}</p>

          <button class="start-test-button" @click.stop="$emit('startOpros')">Пройти<RouterLink :to="this.link" class="flex px-4 py-2 items-center cursor-pointer hover:text-white
                          active:bg-black-alpha-10 text-gray-900 no-underline">
            </RouterLink>
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
</style>

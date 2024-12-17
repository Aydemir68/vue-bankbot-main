<template>
  <div class="quiz-container h-full overflow-sroll p-2 w-full">
    <!-- Основной блок викторины -->
    <div v-if="currentQuestionIndex < questions.length" class="question-container border-round-2xl p-3 min-w-full">
      <div class="header text-lg font-bold text-justify mt-2">{{ questions[currentQuestionIndex].question }}</div>

      <div class="answers mt-3">
        <div v-if="Array.isArray(questions[currentQuestionIndex].correct_answer)">
          <div
              v-for="(answer, index) in questions[currentQuestionIndex].answers"
              :key="index"
              class="answer"
          >
            <input
                type="checkbox"
                :id="'answer-' + currentQuestionIndex + '-' + index"
                :name="'question-' + currentQuestionIndex"
                :value="answer"
                v-model="this.checked"
                class="checkbox-input"
            />
            <label :for="'answer-' + currentQuestionIndex + '-' + index">{{ answer }}</label>
          </div>
        </div>
        <!-- Если вопрос не позволяет несколько правильных ответов, используем радиокнопки -->
        <div v-else-if="questions[currentQuestionIndex].answers && questions[currentQuestionIndex].answers.length > 0">
          <div
              v-for="(answer, index) in questions[currentQuestionIndex].answers"
              :key="index"
              class="answer"
          >
            <input
                type="radio"
                :id="'answer-' + index"
                :name="'question-' + currentQuestionIndex"
                :value="answer"
                v-model="selectedAnswers[currentQuestionIndex]"
            />
            <label :for="'answer-' + index">{{ answer }}</label>
          </div>
        </div>

        <!-- Если вариантов ответов нет, отображаем поле для ввода текста -->
        <div v-else>
          <input
              type="text"
              v-model="selectedAnswers[currentQuestionIndex]"
              placeholder="Введите ваш ответ"
              class="text-input border-round border-none p-2 w-16rem"
          />
        </div>
      </div>
    </div>

    <!-- Блок с результатами -->
    <div v-else class="results">
      <h2>Тест завершен!</h2>
      <p>Ваши ответы:</p>
      <ul>
        <li v-for="(answer, index) in selectedAnswers" :key="index">
          {{ questions[index].question }}: {{ Array.isArray(answer) ? answer.join(', ') : answer }}
        </li>
      </ul>
    </div>

    <!-- Кнопки управления -->
    <div class="button-container mt-3">
      <button
          class="custom-button bg-gray-900 border-round text-white active:bg-primary-600 hover:bg-primary-800 mr-8"
          @click="goBack"
          :disabled="currentQuestionIndex === 0"
      >
        Назад
      </button>

      <button @click="notify"
      v-if="currentQuestionIndex === questions.length - 1"
      :to="link"
      class="custom-button bg-gray-900 text-white active:bg-primary-600 hover:bg-primary-800">
        <router-link :to="link" class="text-white no-underline">
          Завершить
        </router-link>
      </button>

      <button
          v-else
          class="custom-button bg-gray-900 text-white active:bg-primary-600 hover:bg-primary-800"
          @click="goNext"
      >
        Вперед
      </button>

      <Toast />

      <button @click="show()"></button>

    </div>
  </div>
</template>

<script>
import questions from './Vhod.json';
import {ref} from "vue";
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";
import 'vue3-toastify/dist/index.css';

export default {
  data() {
    return {
      currentQuestionIndex: 0,
      selectedAnswers: [],
      test: null,
      questions: questions.questions, // Подключаем вопросы из JSON
      link: '/test'
    };
  },
  components: {
    Toast,
  },
  setup(){

    const toast = useToast();
    const checked = ref([])

    const show = () => {
     toast.add({ severity: 'info', summary: 'Спасибо!', detail: 'Спасибо за прохожджение опроса! Ваш ответ отправлен!', life: 5000 });
    };
    return { checked, show }
  },


  methods: {
    goNext() {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
      } else {
        console.log("Тест завершен!");
      }
    },
    goBack() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
      }
    },
  },
};
</script>

<style scoped>
/* Основной контейнер викторины */
.question-container {
  height: 82vh;
  width: 50vh;
  /*background-color: #2a3f4f; */
  background-color: rgb(66, 115, 195);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: scroll;

}

.Vue-Toastification__toast--default.my-custom-toast-class {
  background-color: blue;
}

.Vue-Toastification__toast-body.custom-class-1 {
  font-size: 30px;
}

.Vue-Toastification__toast-component-body.custom-class-2 {
  width: 100%;
}

.answer {
  text-align: left;
}

.custom-button {
  height: 3rem;
}

input[type="radio"] {
  margin-right: 1vh;
}

input[type="checkbox"] {
  border-radius: 0;
  background-color: transparent;
}

input[type="checkbox"] {
  margin-right: 10px;
  width: 20px;
  height: 20px;
  border-radius: 0;
  border: 2px solid #fff;
  background-color: transparent;
}


</style>

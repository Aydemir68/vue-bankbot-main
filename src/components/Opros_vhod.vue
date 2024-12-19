<template>
  <div class="quiz-container w-screen p-2">
    <!-- Основной блок викторины -->
    <div v-if="currentQuestionIndex < questions.length" class="question-container border-round-xl p-2 h-full w-full overflow-y-scroll">
      <div class="header w-full border-round-xl text-gray-300 text-lg font-bold text-left p-2 bg-primary-800">{{ questions[currentQuestionIndex].question }}</div>

      <div class="answers mt-3">


        <div v-if="Array.isArray(questions[currentQuestionIndex].correct_answer)">
          <div
              v-for="(answer, index) in questions[currentQuestionIndex].answers"
              :key="index"
              class="answer">
            <input
                type="checkbox"
                :id="'answer-' + currentQuestionIndex + '-' + index"
                :name="'question-' + currentQuestionIndex"
                :value="answer"
                v-model="this.checked"
                class="checkbox-input"/>
            <label :for="'answer-' + currentQuestionIndex + '-' + index">{{ answer }}</label>
          </div>
        </div>
        <!-- Если вопрос не позволяет несколько правильных ответов, используем радиокнопки -->
        <div v-else-if="questions[currentQuestionIndex].answers && questions[currentQuestionIndex].answers.length > 0">
          <div
              v-for="(answer, index) in questions[currentQuestionIndex].answers"
              :key="index"
              class="answer">
            <input
                type="radio"
                :id="'answer-' + index"
                :name="'question-' + currentQuestionIndex"
                :value="answer"
                v-model="selectedAnswers[currentQuestionIndex]"/>
            <label :for="'answer-' + index">{{ answer }}</label>
          </div>
        </div>

        <div v-else-if="questions[currentQuestionIndex].correct_answer === 'без ответа'"></div>
        <!-- Если вариантов ответов нет, отображаем поле для ввода текста -->
        <div v-else>
          <input
              type="text"
              v-model="selectedAnswers[currentQuestionIndex]"
              placeholder="Введите ваш ответ"
              class="text-input border-round border-none p-2 w-16rem"/>
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
    <div class="flex w-full justify-content-between mt-3">
      <button
          class="flex w-8rem justify-content-center custom-button align-items-center bg-gray-900 border-round text-white active:bg-primary-600 hover:bg-primary-800"
          @click="goBack"
          :disabled="currentQuestionIndex === 0">
        Назад
      </button>

      <Button icon="pi pi-microchip-ai" severity="info" rounded class="m-1 bg-primary-400" @click="this.visible = true"/>
      <Dialog v-model:visible="visible" modal header="Помощь Интеллектуального Ассистента" :style="{ width: '25rem' }">
        <span class="text-surface-500 dark:text-surface-400 block mb-8">Ваш запрос отправлен в нейросеть!</span>
      </Dialog>

      <Toast />
      <button @click="complete"
              v-if="currentQuestionIndex === questions.length - 1"
              class="flex w-8rem justify-content-center custom-button align-items-center bg-gray-900 text-white active:bg-primary-600 hover:bg-primary-800">
        Завершить
      </button>

      <button
          v-else
          class="flex w-8rem justify-content-center custom-button align-items-center bg-gray-900 text-white active:bg-primary-600 hover:bg-primary-800"
          @click="goNext">
        Вперед
      </button>
    </div>
  </div>
</template>

<script>
import questions from './Vhod.json';
import {ref} from "vue";
import Button from "primevue/button";
import Toast from 'primevue/toast';
import 'vue3-toastify/dist/index.css';
import Dialog from 'primevue/dialog';


export default {
  data() {
    return {
      currentQuestionIndex: 0,
      selectedAnswers: [],
      test: null,
      visible: false,
      questions: questions.questions, // Подключаем вопросы из JSON
      link: '/test'
    };
  },
  components: {
    Toast,
    Button,
    Dialog
  },
  setup() {
    const checked = ref([])
    return { checked };
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
    complete() {

      this.$router.push('/test');

    }
  },
};
</script>

<style scoped>
.quiz-container {
  height: 94vh;
  background-color: #2a3f4f;
  color: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Основной контейнер викторины */
.question-container {
  background-color: rgb(66, 115, 195);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
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

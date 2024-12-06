<template>
  <div class="quiz-container overflow-scroll">
    <!-- Основной блок викторины -->
    <div v-if="currentQuestionIndex < questions.length" class="question-container">
      <h2>{{ questions[currentQuestionIndex].question }}</h2>

      <div class="answers">
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
              class="text-input"
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
    <div class="button-container">
      <button
          class="custom-button"
          @click="goBack"
          :disabled="currentQuestionIndex === 0"
      >
        Назад
      </button>
      <button
          class="custom-button"
          @click="goNext"
      >
        {{ currentQuestionIndex === questions.length - 1 ? "Завершить" : "Вперед" }}
      </button>
    </div>
  </div>
</template>

<script>
import questions from './Vihod.json';
import {ref} from "vue";

export default {
  data() {
    return {
      currentQuestionIndex: 0,
      selectedAnswers: [],
      test: null,
      questions: questions.questions, // Подключаем вопросы из JSON
    };
  },
  setup(){
    const checked = ref([])
    return { checked }
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
.quiz-container {
  height: 94dvh;
  width: 46dvh;

  background-color: #2a3f4f;
  color: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Заголовки */
h2 {
  font-size: 1.25rem;
  text-align: center;
}


.answer {
  margin-bottom: 10px;
}

input[type="radio"] {
  margin-right: 10px;
}

input[type="checkbox"] {

  border-radius: 0;
  background-color: transparent;
}


/* Результаты */
.results {
  text-align: center;
}

.results ul {
  list-style-type: none;
  padding: 0;
}

/* Кнопки управления викториной */
.button-container {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 400px;
}

.custom-button {
  background-color: #1b2934;
  color: rgba(228, 228, 228, 0.865);
  border: none;
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  width: 45%;
}

/* Стиль для текстового поля */
.text-input {
  width: 100%;
  padding: 8px;
  margin-top: 10px;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
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

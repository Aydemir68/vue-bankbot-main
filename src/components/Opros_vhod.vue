<template>
  <div class="quiz-container">
    <div v-if="currentQuestionIndex < questions.length">
      <h2>{{ questions[currentQuestionIndex].question }}</h2>
      <div class="answers">
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
    </div>

    <div v-else>
      <h2>Тест завершен!</h2>
      <p>Ваши ответы:</p>
      <ul>
        <li v-for="(answer, index) in selectedAnswers" :key="index">
          {{ questions[index].question }}: {{ answer }}
        </li>
      </ul>
    </div>

    <div class="button-container">
      <div class="button-group">
        <button
            class="custom-button flex-button"
            @click="goBack"
            :disabled="currentQuestionIndex === 0"
        >
          Назад
        </button>
        <button
            class="custom-button flex-button"
            @click="goNext"
        >
          {{ currentQuestionIndex === questions.length - 1 ? "Завершить" : "Вперед" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentQuestionIndex: 0,
      selectedAnswers: [],
      questions: [
        {
          question: "Какой язык программирования используется в браузере?",
          answers: ["JavaScript", "Python", "C++", "Java"],
        },
        {
          question: "Какой фреймворк работает с Vue.js?",
          answers: ["React", "Angular", "Nuxt.js", "Django"],
        },
        {
          question: "Что такое HTML?",
          answers: [
            "Язык разметки",
            "Язык программирования",
            "СУБД",
            "Операционная система",
          ],
        },
      ],
    };
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

<style>
</style>

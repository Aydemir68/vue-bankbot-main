<template>
  <div v-if="questions.length">
    <div v-if="currentQuestionIndex < questions.length" class="question-container">
      <h2>{{ questions[currentQuestionIndex].question }}</h2>
      <div v-for="(answer, index) in questions[currentQuestionIndex].answers" :key="index">
        <label>
          <input type="radio" :value="answer" v-model="selectedAnswers[currentQuestionIndex]" />
          {{ answer }}
        </label>
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
    <button @click="goBack" :disabled="currentQuestionIndex === 0">Назад</button>
    <button @click="goNext">Вперед</button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      currentQuestionIndex: 0,
      selectedAnswers: [],
    };
  },
  computed: {
    ...mapGetters(['questions']),
  },
  methods: {
    goNext() {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
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

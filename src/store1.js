import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    selectedTestId: null, // ID выбранного теста
    questions: [], // Список вопросов текущего теста
  },
  mutations: {
    setSelectedTestId(state, id) {
      state.selectedTestId = id;
    },
    setQuestions(state, questions) {
      state.questions = questions;
    },
  },
  actions: {
    async loadQuestions({ commit }, testId) {
      let jsonFile = '';
      switch (testId) {
        case '1':
          jsonFile = './Vhod.json';
          break;
        case '2':
          jsonFile = './Vihod.json';
          break;
        case '3':
          jsonFile = './questions.json';
          break;
        case '4':
          jsonFile = './Fin.json';
          break;
        default:
          throw new Error('Invalid test ID');
      }

      try {
        const response = await axios.get(jsonFile);
        commit('setQuestions', response.data.questions);
      } catch (error) {
        console.error('Ошибка загрузки вопросов:', error);
      }
    },
  },
  getters: {
    questions: (state) => state.questions,
    selectedTestId: (state) => state.selectedTestId,
  },
});

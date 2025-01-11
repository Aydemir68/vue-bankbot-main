import { createStore } from 'vuex';
import instance from "./Api/instance.js";

export default createStore({
  state: {
    news: null,
    surveys: null,
  },

  getters: {
    GET_NEWS: state => {
      return state.news;
    },
    GET_SURVEYS: state => {
      return state.surveys;
    }
  },

  mutations: {
    SET_NEWS(state, payload) {
      state.news = payload;
    },
    SET_SURVEYS(state, payload) {
      state.surveys = payload;
    }
  },

  actions: {
    getAllNews: (context) => {
      instance.get('/news/all').then(response => {
        context.commit('SET_NEWS', response.data);
      })
    },
    getAllSurveys: (context) => {
      instance.get('/surveys/all').then(response => {
        context.commit('SET_SURVEYS', response.data);
      })
    },
  }
});
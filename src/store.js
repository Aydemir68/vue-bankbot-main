import { createStore } from 'vuex';
import instance from "./Api/instance.js";

export default createStore({
  state: {
    news: null
  },

  getters: {
    GET_NEWS: state => {
      return state.news;
    }
  },

  mutations: {
    SET_NEWS(state, payload) {
      state.news = payload;
    }
  },

  actions: {
    getAllnews: (context) => {
      instance.get('/news/all').then(response => {
        context.commit('SET_NEWS', response.data);
      })
    },
  }
});
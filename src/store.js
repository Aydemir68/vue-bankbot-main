import { createStore } from 'vuex';

export default createStore({
  state: {
    tests: {
      1: { id: 1, test_name: 'Vhod.json' },
      2: { id: 2, test_name: 'Vhod.json' },
    }
  },

  getters: {
    getTestById: (state) => (id) => {
      return state.tests[id] || null;
    }
  }
});
import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      userId: null,
    };
  },
  mutations: {
    setUserId(state, payload) {
      state.userId = payload;
    },
  },
  actions: {
    setUserId({ commit }, payload) {
      commit('setUserId', payload);
    }
  }
});

export default store;

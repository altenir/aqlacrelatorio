export default {
  state: {
    listaguia: [],
    listaposto: [],
    listasetor: [],
    listarel050: []
  },
  mutations: {
    'STORE_POSTO' (state, payload) {
      state.listaposto = payload
    },
    'STORE_REL050' (state, payload) {
      state.listarel050 = payload
    }
  },
  actions: {
    storePostos (context, payload) {
      context.commit('STORE_POSTO', payload)
    },
    storeRel050 (context, payload) {
      context.commit('STORE_REL050', payload)
    }
  },
  getters: {
    listaDePostos: state => {
      return state.listaposto
    },
    listarel050: state => {
      return state.listarel050
    }
  }

}

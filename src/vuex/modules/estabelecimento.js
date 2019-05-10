export default {
  state: {
    listaEstabelecimentos: [],
    optionsEstabelecimentos: []
  },
  mutations: {
    'STORE_OPTIONS_ESTABELECIMENTOS' (state, payload) {
      state.optionsEstabelecimentos = payload
    },
    'STORE_LISTA_ESTABELECIMENTOS' (state, payload) {
      state.listaEstabelecimentos = payload
    }
  },
  actions: {
    storeOptionsEstabelecimentos (context, payload) {
      context.commit('STORE_OPTIONS_ESTABELECIMENTOS', payload)
    },
    storeListaEstabelecimentos (context, payload) {
      context.commit('STORE_LISTA_ESTABELECIMENTOS', payload)
    }
  },
  getters: {
    listaOptionsEstabelecimentos: state => {
      return state.optionsEstabelecimentos
    },
    listaEstabelecimentos: state => {
      return state.listaEstabelecimentos
    }
  }

}

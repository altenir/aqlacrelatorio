export default {
  // USER_LOGADO (state, obj) {
  //   state.User.dados = obj
  // },
  // LIST_ESTABELEC (state, obj) {
  //   state.Estabelec.list = obj
  // },
  // GET_ESTABELEC (state, obj) {
  //   state.Estabelec.edit = obj
  // },
  // UPD_ESTABELEC (state, obj) {
  //   state.Estabelec.list.push(obj)
  // }

  'CHANGE_USER' (state, payload) {
    state.user.dados = payload
  }
}

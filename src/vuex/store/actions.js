export default {
  updUser (context, payload) {
    context.commit('CHANGE_USER', payload)
  }

}

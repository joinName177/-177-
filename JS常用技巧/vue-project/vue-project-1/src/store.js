import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const state = {
    author: 'CZQ'
}
const mutations = {
    newAuthor(state, msg) {
        state.author = msg
    }
}
export default new Vuex.Store({
    state,
    mutations
})
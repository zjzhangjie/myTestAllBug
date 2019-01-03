import Vue from "vue";
import Vuex from "vuex";
import documentStore from "./storeInfo/documentStore";
Vue.use(Vuex);
export default new Vuex.Store({
    //模块化
    modules: {
        documentStore,
    }
});


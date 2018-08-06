
//状态管理数据:this.$store.state获取，mapState辅助函数
const states={

}
//用来处理数据函数,其接收唯一参数值state，必须为同步函数，以免数据混乱 this.$store.commit(mutationName)，mapMutations辅助函数
const mutations={
}
//通过触发mutation实现的数据变化，可以异步操作，this.$store.dispatch(actionName)，mapActions辅助函数
const actions={

}
//有些状态需要做二次处理,this.$store.getters.valueName,mapGetters辅助函数
const getters = {

}
const documentStore = {
    state: states,
    mutations: mutations,
    actions: actions,
    getters:getters
}
export default documentStore;

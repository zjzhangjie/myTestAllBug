
//状态管理数据:this.$store.state获取，mapState辅助函数
const states={
    dataList:[]//数据

}
//用来处理数据函数,其接收唯一参数值state，必须为同步函数，以免数据混乱 this.$store.commit(mutationName)，mapMutations辅助函数
const mutations={
    //更新项目列表
    UPDATEPROJECTLIST:function (state,data) {
        state.dataList = data;
    },
}
//通过触发mutation实现的数据变化，可以异步操作，this.$store.dispatch(actionName)，mapActions辅助函数
const actions={
    getDataList:function(context, obj) {
        let p = new Promise(function (resolve,reject) {
            let template = {
                'code': '0',
                'msg': 'success',
                'data|0-10': [
                    {
                        'proj_id': '@id',
                        'proj_name': '@ctitle',
                        'creator': '@cname',
                        'proj_num': '@id',
                        'operator': '@cname',
                        'operation_time': /[1-9]{13}/,
                    }
                ]

            };
            let url = pmApi.api.getProjectList;
            let params = new Object();
            params.template = template;
            httpClient.getData(url, params).then(function(data) {
                context.commit("UPDATEPROJECTLIST",  data.data.data);
                resolve();
            },function () {
                reject();
            });
        })
        return p
    },

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

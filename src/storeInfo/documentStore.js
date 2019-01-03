
//状态管理数据:this.$store.state获取，mapState辅助函数
const states={
    dataList:[],//数据
    userList:"你好"

}
//用来处理数据函数,其接收唯一参数值state，必须为同步函数，以免数据混乱 this.$store.commit(mutationName)，mapMutations辅助函数
const mutations={
    // //更新项目列表
    // UPDATEPROJECTLIST:function (state,data) {
    //     state.dataList = data;
    // },
    // setUserList(state,data){
    //     state.userList=data;
    // }
}
//通过触发mutation实现的数据变化，可以异步操作，this.$store.dispatch(actionName)，mapActions辅助函数
const actions={
    // commitUserList:({commit},userList)=>commit('setUserList',userList)
    // getAllData:function (context, obj) {
    //     let p = new Promise(function (resolve,reject) {
    //         let template = {
    //             'code|1':['0','0'],
    //             'message':'success',
    //             'data':{
    //                 'result':[
    //                     {
    //                         'des_num':'@id',//图号
    //                         'des_name':'高炉消火栓灭火系统主设备材料表',//设计图名称
    //                         'des_major':'消防',//专业
    //                         'des_part_num':'1',//分图号
    //                         'des_part_name':'物料表',//分图名称
    //                         'des_part_version':'B',//分图版次
    //                         'des_part_creator':'@cname',//创建者
    //                         'mat_type':'设备材料表',//物料表类别
    //                         'des_part_status|1':['发布'],//分图状态
    //                         'des_status':'拒绝',//套图状态
    //                         'des_category':' B',// 图纸类别
    //                         'reference|1':['Y','N'],//是否为构建分图物料
    //                         'mat_status|1':['已提交','草稿']
    //                     }
    //                 ]
    //             }
    //         }
    //         context.commit('UPDATEPROJECTLIST',data.data.data.result);
    //     })
    //     return p
    // },
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

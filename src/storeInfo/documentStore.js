
//状态管理数据:this.$store.state获取，mapState辅助函数
const states={
    dataList:[],//数据
    userList:"你好",
    task:{
        data:[
            {
                id: "1x",
                text: "ROOT",
                parent: "",
                outline_level: "1",
                start_date: "28-03-2018",
                end_date: "2019-1-2",
                plan_start: "2019-1-1",
                plan_end: "2019-1-2",
                actual_start: "",
                actual_end: "",
                budget: "",
                plan_level: 2,
                progress: 79.789,
                is_readonly: false,
                type: "project",
                sortorder: 1,
                user_id: 7,
                duration:1,
                priority:1
            },
            {   id:2,
                text:"项目 #1",
                start_date:"28-03-2018",
                plan_start: "2016-05-01",
                plan_end: "2016-05-03",
                duration:11,
                progress:1,
                open:true,
                parent:1,
                user_id: 8,
                priority:3
            },
            {id:3,
                text:"项目 #1",
                start_date:"28-03-2018",
                plan_start: "2016-05-01",
                plan_end: "2016-05-03",
                duration:11,
                progress:0.5,
                open:true,parent:'',
                user_id: 9,
                priority:3
            },
            {
                d:4,
                text:"项目 #1",
                start_date:"28-03-2018",
                plan_start: "2016-05-01",
                plan_end: "2016-05-03",
                duration:8,
                progress:0.5,
                open:true,parent:'',
                user_id: 10,
                priority:2
            },
            {
                id:5,
                text:"项目 #1",
                start_date:"28-03-2018",
                plan_start: "2016-05-01",
                plan_end: "2016-05-03",
                duration:5,
                progress:1,
                open:true,parent:'',
                user_id: 11,
                priority:3
            },
            {
                id:6,
                text:"项目 #1",
                start_date:"28-03-2018",
                plan_start: "2016-05-01",
                plan_end: "2016-05-03",
                duration:7,
                progress:0.6,
                open:true,parent:'',
                user_id: 12,
                priority:2
            },
            {
                id:7,
                text:"项目 #1",
                start_date:"28-03-2018",
                plan_start: "2016-05-01",
                plan_end: "2016-05-03",
                duration:7,
                progress:0.6,
                open:true,parent:'',
                user_id: 13,
                priority:2
            }
        ],
        links:[
            {id:1, source:1, target:2, type:"1"},
            {id:2, source:1, target:3, type:"1"},
            {id:3, source:3, target:4, type:"1"},
            {id:4, source:4, target:5, type:"0"},
            {id:5, source:5, target:6, type:"0"}
        ]

    }

}
//用来处理数据函数,其接收唯一参数值state，必须为同步函数，以免数据混乱 this.$store.commit(mutationName)，mapMutations辅助函数
const mutations={

}
//通过触发mutation实现的数据变化，可以异步操作，this.$store.dispatch(actionName)，mapActions辅助函数
const actions={
    //修改甘特图查看模式
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

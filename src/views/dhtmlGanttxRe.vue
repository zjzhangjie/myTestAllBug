<template>
    <div
            id="pm-control-gantt-re"
            style='width:100%;height:700px;'>
    </div>
</template>

<script>
    import "../assets/dhtmlGanttx/codebase/dhtmlxgantt.js";
    import "../assets/dhtmlGanttx/codebase/dhtmlxgantt.css";
    import "../assets/dhtmlGanttx/codebase/ext/dhtmlxgantt_smart_rendering";
    import "../assets/dhtmlGanttx/codebase/locale/locale_cn.js";
    export default {
        name: "dhtmlGanttxRe",
        data(){
            return{
                resource:[
                    {id: 1, text: "QA", parent:null},
                    {id: 2, text: "Development", parent:null},
                    {id: 3, text: "Sales", parent:2},
                    {id: 4, text: "Other", parent:2},
                    {id: 5, text: "Unassigned", parent:2},
                    {id: 6, text: "John", parent:1},
                    {id: 7, text: "Mike", parent:5},
                    {id: 8, text: "Anna", parent:5},
                    {id: 9, text: "Bill", parent:5},
                    {id: 10, text: "Floe", parent:5}
                ]
            }
        },
        mounted(){
            let vm=this;
            vm.settingGanttConfig();//配置文件初始化之前
            gantt.init("pm-control-gantt-re");//初始化
            let resourcesStore=vm.resourcesStore();//配置数据储存
            vm.loadResource(resourcesStore);//加载资源，内置灯箱的设置
            resourcesStore.parse(vm.resource);//加载资源的基础数据
            gantt.parse(vm.$store.state.documentStore.task);//加载甘特图的基础数据

        },
        methods:{
          //创建resource的store
            resourcesStore(){
                let resource = gantt.createDatastore({
                    name: gantt.config.resource_store,
                    type: "treeDatastore",
                    initItem: function (item) {
                        item.parent = item.parent || gantt.config.root_id;
                        item[gantt.config.resource_property] = item.id;
                        item.open = true;
                        return item;
                    }
                });
                return resource
            },
            //配置内置灯箱
            loadResource(resourcesStore){
                resourcesStore.attachEvent("onParse", function(){
                    var people = [];
                    resourcesStore.eachItem(function(res){
                        if(!resourcesStore.hasChild(res.id)){
                            var copy = gantt.copy(res);
                            copy.key = res.id;
                            copy.label = res.text;
                            people.push(copy);
                        }
                    });
                    gantt.updateCollection("people", people);
                });
            },
            //对比名字
             byId(list, id) {
              for (var i = 0; i < list.length; i++) {
                if (list[i].id == id)
                            return list[i].text || "";
                   }
                      return "";
           },
            settingGanttConfig(){
                let vm=this;
                gantt.message({
                    text:[
                        "这是一个测试例子."
                    ].join("<br><br>"),
                    expire: -1
                });
                //内置灯箱的配置
                gantt.locale.labels.section_owner = "Owner";
                gantt.config.lightbox.sections = [
                    {name: "description", height: 38, map_to: "text", type: "textarea", focus: true},
                    {name: "owner", height: 22, map_to: "owner_id", type: "select", options: gantt.serverList("people")},
                    {name: "time", type: "duration", map_to: "auto"}
                ];
                gantt.templates.resource_cell_value = function(start_date, end_date, resource, tasks){
                    var html = "<div>" +  tasks.length * 8 + "h</div>";
                    return html;
                };
                //resourceStore的名字
                gantt.config.resource_store="users";
                //关联的资源ID的任务对象的属性
                gantt.config.resource_property = "user_id";
                gantt.templates.resource_cell_class = function(start_date, end_date, resource, tasks){
                    var css = [];
                    css.push("resource_marker");
                    if (tasks.length<= 1){
                        css.push("workday_ok");
                    } else {
                        css.push("workday_over");
                    }
                    return css.join(" ");
                };

                // gantt.config.scale_unit = "month";
                // gantt.config.step = 1;
                // gantt.config.date_scale = "%M";
                //甘特图高度
                gantt.config.task_height = 16;
                //设置任务可以同级拖拽
                gantt.config.order_branch = true;
                let resourceConfig = {
                    columns: [
                        {
                            name: "name",
                            label: "姓名", tree:true,
                            template: function (resource) {
                                return resource.text;
                            }
                        },
                        {
                            name: "workload",
                            label: "工作量",
                            template: function (resource) {
                                var tasks;
                                var store = gantt.getDatastore(gantt.config.resource_store),
                                    field = gantt.config.resource_property;
                                if(store.hasChild(resource.id)){
                                    tasks = gantt.getTaskBy(field, store.getChildren(resource.id));
                                }else{
                                    tasks = gantt.getTaskBy(field, resource.id);
                                }

                                var totalDuration = 0;
                                for (var i = 0; i < tasks.length; i++) {
                                    totalDuration += tasks[i].duration;
                                }
                                return (totalDuration || 0) * 8 + "h";
                            }
                        }
                    ]
                };
                gantt.config.layout = {
                    css: "gantt_container",
                    rows:[
                        {
                            cols: [
                                {
                                    width: 720,
                                    rows: [
                                        {
                                            view: "grid",
                                            scrollX: "gridScroll",
                                            scrollable: true,
                                            scrollY: "scrollVer"
                                        },
                                        { view: "scrollbar", id: "gridScroll", group: "horizontal" }
                                    ]
                                    // gravity: 2
                                },
                                { resizer: true, width: 1 },
                                {
                                    rows: [
                                        { view: "timeline", scrollX: "scrollHor", scrollY: "scrollVer" },
                                        { view: "scrollbar", id: "scrollHor", group: "horizontal" }
                                    ]
                                },
                                { view: "scrollbar", id: "scrollVer" }
                            ]
                        },
                        {resizer: true, width: 1},
                        {
                            config: resourceConfig,
                            cols: [
                                {view: "resourceGrid", group:"grids", width: 435, scrollY: "resourceVScroll" },
                                {resizer: true, width: 1},
                                {view: "resourceTimeline", scrollX: "scrollHor", scrollY: "resourceVScroll"},
                                {view: "scrollbar", id: "resourceVScroll", group:"vertical"}
                            ],
                            gravity:1
                        },
                        {view: "scrollbar", scroll: "x", id:"scrollHor", height:20}
                    ]
                };
                //列配置
                gantt.config.columns = [
                    {
                        name: "wbs",
                        label: "编码",
                        width: 40,
                        template: function(task) {
                            return vm.buildWbsCode(task);
                        },
                        align: "left",
                        resize: true
                    },
                    {
                        name: "text",
                        label: "名称",
                        align: "left",
                        tree: true,
                        min_width: 200,
                        width: 200,
                        resize: true,
                    },
                    {
                        name: "start_date",
                        label: "开始时间",
                        align: "center",
                        resize: true,
                        min_width: 100,
                        width: 100,
                        template: function(obj) {
                            return obj.start_date ? obj.start_date : "";
                        }
                    },
                    {
                        name: "progress",
                        label: "完成百分比",
                        align: "center",
                        resize: true,
                        min_width: 100,
                        width: 100,
                        template: function(obj) {
                            return obj.progress
                                ? Math.round(obj.progress * 10000) / 100 + "%"
                                : "";
                        }
                    },
                    {
                        name: "budget",
                        label: "预算资源",
                        align: "center",
                        resize: true,
                        min_width: 100,
                        width: 100,
                        template: function(obj) {
                            return obj.budget ? obj.budget : "0";
                        }
                    },
                    {
                        name: "duration",
                        label: "工期（天）",
                        align: "center",
                        resize: true,
                        min_width: 80,
                        width: 80
                    },
                    {name: "owner",   label: "owner", width: 80, align: "center", template: function (item) {
                       //     var store =[ gantt.getDatastore(gantt.config.resource_store).pull];
                            return vm.byId(vm.resource, item.user_id)}
                            },
                    { name: "add", label: "", width: 44, resize: true },
                ];
                // //甘特图左边说明
                gantt.templates.leftside_text = function(start, end, task) {
                    return task.duration + " days";
                };
                //甘特图右边说明
                gantt.templates.rightside_text = function(start, end, task) {
                    return "ID: #" + task.id;
                };
                //鼠标移上去提示
                gantt.templates.tooltip_text = function(start, end, task) {
                    return "123456";
                };
                gantt.templates.task_text=function(start,end,task){
                    return "<b>Text:</b> "+task.text+",<b> Holders:</b> "+task.users;
                };
                gantt.templates.grid_row_class = function(start, end, task){
                    if(task.user_id==1){
                        return "pm-gantt-name";
                    }
                };
                gantt.templates.task_class = function(start, end, task){
                    if(task.user_id==2){
                        return "pm-gantt-name";
                    }

                };
            },
            //构造WBS CODE
            buildWbsCode(task) {
                let formal = gantt.getWBSCode(task);
                if (task.parent == "") {
                    return 0;
                } else {
                    let codeArray = formal.split(".");
                    codeArray.shift();
                    return codeArray.join(".");
                }
            },
        }
    }
</script>

<style  lang="less">
    .resource_marker{
        text-align: center;
    }
    .resource_marker div{
        width: 28px;
        height: 28px;
        line-height: 29px;
        display: inline-block;
        border-radius: 15px;
        color: #FFF;
        margin: 3px;
    }
    .resource_marker.workday_ok div {
        background: #51c185;
    }

    .resource_marker.workday_over div{
        background: #ff8686;
    }
.pm-gantt-name .gantt_cell:nth-child(7){
     background-color: red;
     border-radius:10%;
     color: #f0f0f0;

 }

</style>
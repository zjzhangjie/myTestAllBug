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
                tasks:{
                    data:[
                        {id:1, text:"项目 #1", start_date:"2016-05-01", duration:11, progress:0.6, open:true},
                        {id:2, text:"项目 #1", start_date:"2016-05-01", duration:11, progress:1, open:true},
                        {id:3, text:"项目 #1", start_date:"2016-05-01", duration:11, progress:0.5, open:true},
                        {id:4, text:"项目 #1", start_date:"2016-05-01", duration:11, progress:0.5, open:true},
                        {id:5, text:"项目 #1", start_date:"2016-05-01", duration:11, progress:1, open:true},
                        {id:6, text:"项目 #1", start_date:"2016-05-01", duration:11, progress:0.6, open:true}
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
        },
        mounted(){
            let vm=this;
            vm.settingGanttConfig();//配置文件初始化之前
            gantt.init("pm-control-gantt-re");
            vm.loadResource();//加载资源，内置灯箱的设置
            gantt.parse(vm.$store.state.documentStore.task);//加载甘特图的基础数据
        },
        methods:{
            loadResource(){
                //日历
                // adding a working calendar
                let johnCalendarId = gantt.addCalendar({
                    worktime: {
                        days: [0, 1, 1, 1, 1, 1, 0]
                    }
                });
                // binding the calendar to a user
                gantt.config.resource_calendars = {
                    "user_id":{
                        2: johnCalendarId
                    }
                };
                // init lightbox with an empty collection
                gantt.locale.labels.section_owner = "资源";//灯箱标题的名字
                gantt.config.lightbox.sections = [
                    {name:"description", height:38, map_to:"text", type:"textarea", focus:true},
                    {name:"owner", map_to:"owner_id", type:"select", options:gantt.serverList("people")},
                    {name:"time", type:"duration", map_to: "auto"}
                ];
               // once options are loaded
                gantt.updateCollection("people", [
                    {key: 1, label: "张洁"},
                    {key: 2, label: "高健"},
                    {key: 3, label: "王玥"},
                    {key: 4, label: "桔伍"},
                    {key: 7, label: "左琴"}
                ]);
            },
            //人力资源
             byId(list, id) {
              for (var i = 0; i < list.length; i++) {
                if (list[i].key == id)
                            return list[i].label || "";
                   }
                      return "";
           },
            settingGanttConfig(){
                let vm=this;
                gantt.config.resource_store = "users";
                gantt.config.resource_property = "user_id";
                gantt.config.scale_unit = "month";
                gantt.config.step = 1;
                gantt.config.date_scale = "%Y";
                //甘特图高度
                gantt.config.task_height = 16;
                //设置任务可以同级拖拽
                gantt.config.order_branch = true;
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
                        name: "end_date",
                        label: "完成时间",
                        align: "center",
                        resize: true,
                        min_width: 100,
                        width: 100,
                        template: function(obj) {
                            return obj.end_date ? obj.end_date : "";
                        }
                    },
                    {
                        name: "plan_start",
                        label: "计划开始时间",
                        align: "center",
                        resize: true,
                        hide: false,
                        min_width: 100,
                        width: 100,
                        template: function(obj) {
                            return obj.plan_start ? obj.plan_start : "";
                        }
                    },
                    {
                        name: "plan_end",
                        label: "计划完成时间",
                        align: "center",
                        resize: true,
                        hide: false,
                        min_width: 100,
                        width: 100,
                        // template: function(obj) {
                        //     return obj.plan_end ? obj.plan_end : "";
                        // }
                    },
                    {
                        name: "actual_start",
                        label: "实际开始时间",
                        align: "center",
                        resize: true,
                        hide: true,
                        min_width: 100,
                        width: 100,
                        template: function(obj) {
                            return obj.actual_start ? obj.actual_start : "";
                        }
                    },
                    {
                        name: "actual_end",
                        label: "实际完成时间",
                        align: "center",
                        resize: true,
                        hide: true,
                        min_width: 100,
                        width: 100,
                        template: function(obj) {
                            return obj.actual_end ? obj.actual_end : "";
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
                    {name: "owner",   label: "owner", width: 80, align: "center", template: function (item) {
                            return vm.byId(gantt.serverList('people'), item.user_id)}
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

.pm-gantt-name .gantt_cell:nth-child(10){
     background-color: red;
     border-radius:10%;
     color: #f0f0f0;

 }

</style>
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
            gantt.parse(vm.$store.state.documentStore.task);//加载甘特图的基础数据

        },
        methods:{
            //对比名字
            byId(list, id) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].key == id)
                        return list[i].label || "";
                }
                return "";
            },
            settingGanttConfig(){
                let vm=this;
                gantt.serverList("staff", [
                    {key: 1, label: "John"},
                    {key: 2, label: "Mike"},
                    {key: 3, label: "Anna"},
                    {key: 4, label: "Bill"},
                    {key: 7, label: "Floe"}
                ]);

                gantt.serverList("priority", [
                    {key: 1, label: "High"},
                    {key: 2, label: "Normal"},
                    {key: 3, label: "Low"}
                ]);
                gantt.config.work_time = true;
                var labels = gantt.locale.labels;
                labels.column_priority = labels.section_priority = "Priority";
                labels.column_owner = labels.section_owner = "Owner";
                gantt.message({
                    text:[
                        "这是一个测试例子."
                    ].join("<br><br>"),
                    expire: -1
                });
                //内置灯箱的配置
                gantt.config.lightbox.sections = [
                    {name: "description", height: 38, map_to: "text", type: "textarea", focus: true},
                    {name: "priority", height: 22, map_to: "priority", type: "select", options: gantt.serverList("priority")},
                    {name: "owner", height: 22, map_to: "owner_id", type: "select", options: gantt.serverList("staff")},
                    {name: "time", type: "duration", map_to: "auto"}
                ];

                // gantt.config.scale_unit = "month";
                // gantt.config.step = 1;
                // gantt.config.date_scale = "%M";
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
                        {resizer: true, width: 1},
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
                    {name: "owner", width: 80, align: "center", template: function (item) {
                            return vm.byId(gantt.serverList('staff'), item.user_id)
                        }},
                    {name: "priority", width: 80, align: "center", template: function (item) {
                            return vm.byId(gantt.serverList('priority'), item.priority)}},
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
                gantt.templates.task_cell_class = function (task, date) {
                    if (!gantt.isWorkTime({date: date, task: task}))
                        return "week_end";
                    return "";
                };
                gantt.templates.task_class = function(start, end, task){
                    if(task.user_id==2){
                        return "pm-gantt-name";
                    }
                };
                let regular = gantt.addCalendar({
                        worktime: {
                            days: [0, 1, 1, 1, 1, 1, 0]
                        }
                    }),
                    twoByTwo = gantt.addCalendar({
                        worktime: {
                            days: [1, 1, 0, 0, 1, 1, 0]
                        }
                    }),
                    weekendWorker = gantt.addCalendar({
                        worktime: {
                            days: [1, 0, 0, 0, 0, 0, 1]
                        }
                    });

                gantt.config.resource_calendars = {
                    "user_id": {
                        1: regular,
                        2: twoByTwo,
                        3: weekendWorker,
                        4: twoByTwo,
                        5: regular,
                        6: regular,
                        7: weekendWorker
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
    .gantt_task_cell.week_end {
        background-color: rgba(232, 232, 232, 0.6);
    }

    .pm-gantt-name .gantt_cell:nth-child(7){
        background-color: red;
        border-radius:10%;
        color: #f0f0f0;

    }

</style>
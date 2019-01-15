<template>
    <div>
        <div class="gantt_control" >
            <input type='button' id='default' @click="toggleGroups(this)"  v-model="value" >
        </div>
        <div
                id="pm-control-gantt-re"
                style='width:100%;height:700px;'>
        </div>
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
                    {id:1, text:"Architect"},//建筑师
                    {id:2, text:"Construction worker"},//建筑工人
                    {id:3, text:"Plasterer"},//降水泥
                    {id:4, text:"Plumber"},//水管工
                    {id:5, text:"Electrician"},//电工
                    {id:6, text:"Handyman"},//杂务工
                    {id: 7, text: "Anna", specialty: "Architect", parent:1},
                    {id: 8, text: "Finn", specialty: "Construction worker", parent:2},
                    {id: 9, text: "Jake", specialty: "Construction worker", parent:2},
                    {id: 10, text: "Floe", specialty: "Plasterer", parent:3},
                    {id: 11, text: "Tom", specialty: "Plumber", parent:4},
                    {id: 12, text: "Mike", specialty: "Electrician", parent:5},
                    {id: 13, text: "Joe", specialty: "Handyman", parent:6}
                ],
                value:'Show Resource view'
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
             toggleGroups(input) {
              gantt.$groupMode = !gantt.$groupMode;
            if (gantt.$groupMode) {
            this.value = "show gantt view";
            var groups = gantt.$resourcesStore.getItems().map(function(item){
                var group = gantt.copy(item);
                group.group_id = group.id;
                group.id = gantt.uid();
                return group;
            });
            gantt.groupBy({
                groups: groups,
                relation_property: gantt.config.resource_property,
                group_id: "group_id",
                group_text: "text",
                delimiter: ", ",
                default_group_label: "Not Assigned"
            });
        } else {
            this.value = "show resource view";
            gantt.groupBy(false);
        }
    },
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
                            if(copy.specialty){
                                copy.label += ", " + copy.specialty;
                            }
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
                    {name: "owner", height: 22,type: "select", options: gantt.serverList("people")},
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
                            name: "specialty", label: "专业", width:150, align:"center",template: function (resource) {

                                return resource.specialty || "";
                            }, resize: true
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
                        },
                        {
                            name: "capacity", label: "Capacity", align:"center",template: function (resource) {
                                var store = gantt.getDatastore(gantt.config.resource_store);
                                var n = store.hasChild(resource.id) ? store.getChildren(resource.id).length : 1
                                var state = gantt.getState();
                                return gantt.calculateDuration(state.min_date, state.max_date) * n * 8 + "h";
                            }
                        }
                    ]
                };
                var resourceTemplates = {
                    grid_row_class: function(start, end, resource){
                        var css = [];
                        // if(gantt.$resourcesStore.hasChild(resource.id)){
                        //     css.push("folder_row");
                        //     css.push("group_row");
                        // }
                        // if(shouldHighlightResource(resource)){
                        //     css.push("highlighted_resource");
                        // }
                        return css.join(" ");
                    },
                    task_row_class: function(start, end, resource){
                        var css = [];
                        // if(shouldHighlightResource(resource)){
                        //     css.push("highlighted_resource");
                        // }
                        // if(gantt.$resourcesStore.hasChild(resource.id)){
                        //     css.push("group_row");
                        // }

                        return css.join(" ");

                    }
                };
                var weekScaleTemplate = function (date) {
                    var dateToStr = gantt.date.date_to_str("%d %M");
                    var endDate = gantt.date.add(gantt.date.add(date, 1, "week"), -1, "day");
                    return dateToStr(date) + " - " + dateToStr(endDate);
                };
                //顶部时间
                gantt.config.subscales = [
                    {unit: "month", step: 1, date: "%F, %Y"},
                ];
                gantt.config.auto_scheduling = true;//启动任务调度
                gantt.config.auto_scheduling_strict = true;//启用自动调度模式，其中任务将始终重新安排到尽可能早的日期
                gantt.config.work_time = true;
                gantt.config.order_branch = true;//激活“分支”模式，允许在同一嵌套级别内重新排序任务
                gantt.config.open_tree_initially = true;//最初打开所有分支
                gantt.config.layout = {
                    css: "gantt_container",
                    rows:[
                        {
                            cols: [
                                {
                                    width: 600,
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
                            height: 35,
                            cols: [
                                { html:"", group:"grids"},
                                { resizer: true, width: 1},
                                { html:"<label class='active' >Hours per day <input checked type='radio' name='resource-mode' value='hours'></label>" +
                                    "<label>Tasks per day <input type='radio' name='resource-mode' value='tasks'></label>", css:"resource-controls"}
                            ]
                        },
                        {
                            config: resourceConfig,
                            templates: resourceTemplates,
                            cols: [
                                {view: "resourceGrid", group:"grids", width: 600, scrollY: "resourceVScroll" },
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
                //配置日历
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
                gantt.templates.task_cell_class = function (task, date) {
                    if (!gantt.isWorkTime({date: date, task: task}))
                        return "week_end";
                    return "";
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

    .folder_row {
        font-weight: bold;
    }
    .group_row,
    .group_row.odd,
    .gantt_task_row.group_row{
        background-color: rgba(232, 232, 232, 0.6);
    }

    .gantt_control input{
        border-radius: 2px;
        border: 1px solid #1f1f1f;
        background-color: #ffffff;
        color: #1f1f1f;
    }
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
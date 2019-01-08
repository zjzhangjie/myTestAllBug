<template>
    <div
            ref="pm-execute-gantt"
            id="pm-control-gantt"
            style='width:100%; height:1000px;'
            class="pm-execute-progress"
    ></div>
</template>

<script>
    import "../assets/dhtmlGanttx/codebase/dhtmlxgantt.js";
    import "../assets/dhtmlGanttx/codebase/dhtmlxgantt.css";
    import "../assets/dhtmlGanttx/codebase/ext/dhtmlxgantt_smart_rendering";
    import "../assets/dhtmlGanttx/codebase/locale/locale_cn.js";
    export default {
        name: "dhtmlGanttx",
        data(){
            return{
                editType: "scanPlan", //调整类型：changePlan：调整计划 scanPlan查看计划 changeProgress :调整进度
            }
        },
        mounted(){
            let vm=this;
            vm.settingGanttConfig();//配置文件初始化之前
            gantt.init(this.$refs["pm-execute-gantt"]);//初始化gatt
            //解析甘特图
            vm.getGanttData();//加载基础数据
            // 添加甘特图事件
            vm.runTest()
        },
        methods:{
            runTest(){
                let p=new Promise(function (resolve,reject) {
                    //做一些异步操作
                    setTimeout(()=>{
                        console.log("执行完成");
                        resolve('随便')
                    },2000)

                });
                return p
            },
            getGanttData(){
                let vm=this;
                gantt.parse(vm.$store.state.documentStore.task);//加载甘特图的基础数据
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
            //配置甘特图Config
            settingGanttConfig() {
                let vm = this;
                //是否显示错误
                gantt.config.show_errors = false;
                gantt.config.auto_scheduling = false;
                //设置按行渲染甘特图提交效率
                gantt.config.show_task_cells = false;
                //设置是否可添加【该配置对源码进行修改后】
                gantt.config.can_add = false;
                //自动调整类型,当存在字节点时自动升级为project
                gantt.config.auto_types = false;
                //设置不可以拖动进度
                gantt.config.drag_progress = true;
                //设置Task不可以拖动
                gantt.config.drag_move = false;
                //设置不可以拖动关系
                gantt.config.drag_links = true;
                //设置不可拖动Task 大小
                gantt.config.drag_resize = true;
                //单击显示添加详情
                gantt.config.details_on_create = true;
                //双击显示明细
                gantt.config.details_on_dblclick = true;
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
                    { name: "add", label: "", width: 44, resize: true, hide: true }
                ];
                //展示配置滚动条
                gantt.config.layout = {
                    css: "gantt_container",
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
                };
                //甘特图高度
                gantt.config.task_height = 16;
                //设置甘特特图计算单位
                gantt.config.scale_unit = "month";

                //设置任务可以同级拖拽
                gantt.config.order_branch = true;
                //编辑框设置
                gantt.showLightbox = function(id) {
                };
                // //设置task 任务样式
                gantt.templates.task_class = function(start, end, task) {
                    if (task.parent !== "") {
                        return vm.editType + " pm-gantt-root";
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
                //甘特图 Grid class
                gantt.templates.grid_row_class = function(start, end, task) {
                    if (gantt.hasChild(task.id)) {
                        return "has-child";
                    }
                    return "";
                };
            },
        }
    }
</script>

<style scoped lang="less">
    .pm-execute-progress {
    .pm-gantt-panel {
        position: relative;
        height: calc(~"(100% - 50px)");
    .gantt_grid_scale {
    .gantt_grid_head_cell {
        font-size: 14px;
        color: #333333;
        font-weight: 700;
    }
    }
    .gantt_task_scale {
    .gantt_scale_cell {
        font-size: 14px;
        color: #333333;
    }
    }
    .gantt_grid_data {
    .gantt_row {
    .gantt_cell {
        color: #333333;
        font-size: 12px;
    }
    &.has-child {
    .gantt_cell {
        font-weight: 700;
        color: red;
    }
    }
    }
    }
    .gantt_data_area {
    &.height-zindex {
         z-index: 99;
     }
    .gantt_task_line {
    &.scanPlan.pm-gantt-root {
         background: #FCB25C;
         border: 1px solid #FCB25C;
    .gantt_task_progress {
        background: #FD8E1F;
    }
    }
    &.scanPlan.pm-gantt-project {
         background: #60B3FF;
         border: 1px solid #60B3FF;
    .gantt_task_progress {
        background: #2D83FA;
    }
    }
    &.scanPlan.pm-gantt-task {
         background: #AED04D;
         border: 1px solid #AED04D;
    .gantt_task_progress {
        background: #74C430;
    }
    &.task-over {
         border: 1px solid #FF9674;
         background: #FF9674;
    .gantt_task_progress {
        background: #FF584A;
    }
    }
    &.gantt_critical_task {
         background-color: #e63030 !important;
         border-color: #9d3a3a !important;
     }
    }
    &.scanPlan.pm-gantt-milestone {
         border: 1px solid #de59f0;
         background: #fca6f2;
     }
    &.changeProgress.pm-gantt-root {
         background: #FCB25C;
         border: 1px solid #FCB25C;
    .gantt_task_progress {
        background: #FD8E1F;
    }
    }
    &.changeProgress.pm-gantt-project {
         background: #60B3FF;
         border: 1px solid #60B3FF;
    .gantt_task_progress {
        background: #60B3FF;
    }
    }
    &.changeProgress.pm-gantt-task {
         background: #C1D38E;
         border: 1px solid #C1D38E;
    .gantt_task_progress {
        background: #47BC13;
    }
    &.task-over {
         border: 1px solid #fd8167 !important;
         background-color: #FF9674 !important;
    .gantt_task_progress {
        background: #FF584A !important;
    }
    }
    &.gantt_critical_task {
         background-color: #e63030 !important;
         border-color: #9d3a3a !important;
     }
    }
    &.changeProgress.pm-gantt-milestone {
         border: 1px solid #de59f0;
         background: #fca6f2;
     }
    &.changePlan.pm-gantt-root {
         background: #FD8E1F;
         border: 1px solid #FD8E1F;
    .gantt_task_progress {
        background: #FD8E1F;
    }
    }
    &.changePlan.pm-gantt-project {
         background: #2D83FA;
         border: 1px solid #2D83FA;
    .gantt_task_progress {
        background: #2D83FA;
    }
    }
    &.changePlan.pm-gantt-task {
         background: #BEBEBE;
         border: 1px solid #BEBEBE;
    .gantt_task_progress {
        background: #BEBEBE;
    }
    &.overdue {
         background: #ff9a9e !important;
         border: 1px solid #ff9a9e !important;
     }
    &.gantt_critical_task {
         background-color: #e63030 !important;
         border-color: #9d3a3a !important;
     }
    }
    &.changePlan.pm-gantt-milestone {
         border: 1px solid #fca6f2;
         background: #de59f0;
     }
    .gantt_left {
        padding-right: 6px;
        top: -2px;
    .leave-lock {
        display: block;
        width: 9px;
        height: 16px;
       // background: url("../../assets/img/progress/icon_lock.svg") no-repeat
       // center;
    }
    .leave-unlock {
        display: block;
        width: 9px;
        height: 16px;
     //   background: url("../../assets/img/progress/icon_deblocking.svg")
      //  no-repeat center;
    }
    }
    }
    .date-overdue {
        color: #FD8167;
        font-size: 12px;
    }
    }
    .gantt_layout_cell.gantt_hor_scroll {
    //pm-滑块设置
                &::-webkit-scrollbar {
          width: 2px;
          background-color: #ffffff;
      }
    /*pm-滑块 内阴影+圆角*/
    &::-webkit-scrollbar-thumb {
         border-radius: 2px;
         -webkit-box-shadow: 0.5px 0.87px 2px #ffffff;
         background-color: #e8e8e8;
     }
    /*pm-滚动条轨道 内阴影+圆角*/
    ::-webkit-scrollbar-track {
        border-radius: 2px;
        background-color: #ffffff;
    }
    }
    .hide-columns-info {
        position: absolute;
        z-index: 9999;
        width: 0px;
        height: 0px;
    }
    .execute-legend {
        position: absolute;
        right: 0px;
        bottom: 0px;
    }
    .gantt_tooltip {
        box-shadow: RGBA(0, 0, 0, 0.16) 0px 0px 3px !important;
        padding: 8px;
        font-size: 12px;
    .pm-tips {
    div {
        display: flex;
        width: 100%;
        justify-content: space-between;
        color: #999999;
    .tip-title {
        text-align: left;
        color: #333333;
    }
    .tip-info {
        text-align: left;
    }
    }
    }
    }
    .gantt_link_line_left{
        height: 1px!important;
        margin-top: 10px!important;
        margin-left: 10px!important;
    }
    .gantt_link_line_top{
        width: 1px!important;
        margin-top: 10px!important;
        margin-left: 10px!important;
    }
    .gantt_link_line_down{
        width: 1px!important;
        margin-left: 10px!important;
    }
    .gantt_link_line_right{
        height:1px!important;
        margin-top: 10px!important;
        margin-left: 10px!important;
    }
    .gantt_task_link .gantt_link_arrow_right{
        border-width: 4px 4px 4px 4px;
        margin-top: -1px;
        margin-left: 2px;
    }
    }
    .baseline {
        position: absolute;
        margin-top: -7px;
        height: 6px;
        background: #C7C7C7;
        border: 1px solid #C7C7C7;
    &.overdue {
         background: #ff9a9e !important;
         border: 1px solid #ff9a9e !important;
     }
    }
    .gantt_grid_head_cell.gantt_grid_head_add {
        background-image: none;
        pointer-events: none;
    }
    }
</style>
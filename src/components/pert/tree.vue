/*
* created by zuoqin on 2019/3/4
* 树形表格组件
* props:
* data:树形表格的数据，必须
* header、initWidths、columnIds、colAlign、colTypes都要根据要展示的列做相应的调整
* methods:
* onRowSelect 现在点击的行 参数：rowId
* fold:收起行 参数：id
* expand:展开行 参数：id
*/
<template>
    <div id="treeGrid" class="tree-grid"></div>
</template>

<script>
    import "../../assets/dhtmlxTreeGrid/codebase/dhtmlxtreegrid"
    import "../../assets/dhtmlGanttx/codebase/dhtmlxgantt.js";
    export default {
        name: "treeGrid",
        props: {
            //树形表格的数据
            data: {
                type: Array,
                default:function () {
                    return  [
                        {
                            id: "3",
                            taskName: "一级保护区及周家窝区域",
                            start_time: "2019-2-21",
                            end_time: "2019-2-28",
                            duration: 7,
                            parent: "2"
                        },
                        {
                            id: "2",
                            taskName: "江滩护坡施工总工期",
                            start_time: "2019-2-21",
                            end_time: "2019-2-28",
                            duration: 7,
                            parent: "1"
                        },
                        {
                            id: "1",
                            taskName: "总进度计划",
                            start_time: "2019-2-21",
                            end_time: "2019-2-28",
                            duration: 7
                        },
                        {
                            id: "8",
                            taskName: "施工准备",
                            start_time: "2019-2-21",
                            end_time: "2019-2-28",
                            duration: 7,
                            parent: "6"
                        },
                        {
                            id: "4",
                            taskName: "施工准备",
                            start_time: "2019-2-21",
                            end_time: "2019-2-28",
                            duration: 7,
                            parent: "3"
                        },
                        {
                            id: "6",
                            taskName: "陈家墩区域",
                            start_time: "2019-2-21",
                            end_time: "2019-2-28",
                            duration: 7,
                            parent: "2"
                        },
                        {
                            id: "5",
                            taskName: "一级护坡整修施工",
                            start_time: "2019-2-21",
                            end_time: "2019-2-28",
                            duration: 7,
                            parent: "3"
                        },
                        {
                            id: "9",
                            taskName: "一级护坡整修施工",
                            start_time: "2019-2-21",
                            end_time: "2019-2-28",
                            duration: 7,
                            parent: "6"
                        }
                    ]
                }
            },
            //表头标题
            header: {
                type: String,
                default: "编码,任务名称,开始时间,结束时间,工期"
            },
            //每一列显示的字段
            columnIds: {
                type: String,
                default: "code,name,start,end,duration"
            },
            //初始化每一列的宽度
            initWidths: {
                type: String,
                default: "50,150,100,100,50"
            },
            //每一列文本对齐方式
            colAlign: {
                type: String,
                default: "left,left,left,left,left"
            },
            //每一列的类型
            colTypes: {
                type: String,
                default: "txt,tree,txt,txt,txt"
            },
            //是否展开所有
            isExpandAll: {
                type: Boolean,
                default: true
            }
        },
        mounted() {
            this.initTreeGrid();
        },
        methods: {
            //初始化
            initTreeGrid() {
                let vm = this;
                let treeData = vm.buildTreeData(vm.data);
                console.log(treeData);
                vm.myTreeGrid = new dhtmlXGridObject("treeGrid");
                vm.myTreeGrid.setImagePath("../img/");
                vm.myTreeGrid.setHeader(vm.header);
                vm.myTreeGrid.setColumnIds(vm.columnIds);
                vm.myTreeGrid.setInitWidths(vm.initWidths);
                vm.myTreeGrid.setColAlign(vm.colAlign);
                vm.myTreeGrid.setColTypes(vm.colTypes);
                vm.myTreeGrid.enableAutoWidth(true);
                vm.myTreeGrid.enableAutoHeight(true);
                vm.myTreeGrid.init();
                vm.myTreeGrid.parse(treeData, "js");
                if (vm.isExpandAll) {
                    vm.myTreeGrid.expandAll(); //展开所有树结构
                }
                vm.myTreeGrid.attachEvent("onRowSelect", function(rowId) {
                    console.log("Row with id=" + rowId + " was selected");
                    vm.$emit("rowSelect",rowId);
                }); //将任何用户定义的处理程序添加到可用
                //收起展开触发事件
                vm.myTreeGrid.attachEvent("onOpenStart", function(id, state) {
                    console.log("打开还是关闭：" + id + " " + state);
                    //state:1 收起 -1展开
                    if(state==1){
                        //收起
                        vm.$emit("fold",id);
                    }
                    else{
                        vm.$emit("expand",id);
                    }
                    return true; //返回true - 确认打开/关闭，false - 拒绝打开/关闭
                });
            },
            buildTreeData(data) {
                let list = JSON.parse(JSON.stringify(data)); //对原数据深度拷贝
                let temp = {};
                let tree = [];
                for (let i in list) {
                    temp[list[i].id] = list[i];
                }
                for (let i in temp) {
                    let value = temp[i].name;
                    if (temp[i].parent) {
                        if (!temp[temp[i].parent].rows) {
                            temp[temp[i].parent].rows = [];
                        }
                        temp[temp[i].parent].name = { value: value, image: "folder.gif" };
                        temp[i].level = temp[temp[i].parent].level + 1;
                        temp[i].code =
                            temp[temp[i].parent].code +
                            "." +
                            (temp[temp[i].parent].rows.length + 1);
                        temp[temp[i].parent].rows.push(temp[i]);
                    } else {
                        temp[i].name = { value: value, image: "folder.gif" };
                        temp[i].level = 1;
                        temp[i].code = 1;
                        tree.push(temp[i]);
                    }
                }
                return tree; //返回树形数据
            }
        }
    };
</script>

<style lang="less">
    @import "../../assets/dhtmlxTreeGrid/codebase/dhtmlxtreegrid.css";
    .tree-grid {
        width: 550px;
        height: 320px;
        background-color: white;
        .objbox {
            overflow: hidden !important;
        }
    }
</style>

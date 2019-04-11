<template>
    <div class="qd-pert">
        <div class="pert-container">
            <div class="pert-tree">
                <tree :data="taskTree"></tree>
            </div>
            <div class="pert-draw">
                <calendar :time="time" :cardSize="50" :zoom="4"></calendar>
                <div id="container" style="height: 500px"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import zrender from 'zrender';
    import debounce from "lodash.debounce";
    import  common from '../tools/common'
    import calendar from '../components/pert/calendar'
    import tree from '../components/pert/tree'
    import {qdPert} from  'qd-plugins'
    export default {
        name: "zrender",
        data(){
            return{
                taskTree:[
                    {
                        id:'1-1',
                        name:'挖土',
                        start:1,
                        end:100,
                        duration:'1-100',
                        parent:'1',
                        type:'project',//project:项目 task:任务  milestone：里程碑
                    },
                    {
                        id:'1-2',
                        name:'混泥土',
                        start:200,
                        end:500,
                        duration:'200-500',
                        parent:'1',
                        type:'project'
                    },
                    {
                        id:'1-2-1',
                        name:'混泥土-排水',
                        start:230,
                        end:300,
                        duration:'230-300',
                        parent: "1-2",
                        type:'task'
                    },
                    {
                        id:'1-2-2',
                        name:'混泥土-土石方',
                        start:220,
                        end:350,
                        duration:'220-350',
                        parent: '1-2',
                        type:'task'
                    },
                    {
                        id:'1-2-3',
                        name:'混泥土-排线',
                        start:300,
                        end:400,
                        duration:'300-400',
                        parent: '1-2',
                        type:'task'
                    },
                    {
                        id:'1-2-3-1',
                        name:'混泥土-排线-1',
                        start:300,
                        end:350,
                        duration:'300-350',
                        parent: '1-2-3',
                        type:'task'
                    },
                    {
                        id:'1-2-5',
                        name:'混泥土-地基',
                        start:310,
                        end:400,
                        duration:'300-400',
                        parent: '1-2',
                        type:'task'
                    },
                    {
                        id:'1-2-5-1',
                        name:'混泥土-地基-1',
                        start:310,
                        end:400,
                        duration:'300-400',
                        parent: '1-2-5',
                        type:'task'
                    },
                    {
                        id:'1-2-4',
                        name:'混泥土-刷墙',
                        start:350,
                        end:500,
                        duration:'350-500',
                        parent: "1-2",
                        type:'task'
                    },
                    {
                        id:'1-3',
                        name:'验收',
                        start:1,
                        end:700,
                        duration:'1-700',
                        parent: "1",
                        type:'project'
                    },
                    {
                        id:'1-3-1',
                        name:'验收-基础',
                        start:1,
                        end:400,
                        duration:'1-400',
                        parent: "1-3",
                        type:'task'
                    },
                    {
                        id:'1-3-2',
                        name:'验收-屋面',
                        start:500,
                        end:700,
                        duration:'500-700',
                        parent: "1-3",
                        type:'task'
                    },
                    {
                        id:'1-4',
                        name:'施工',
                        start:700,
                        end:1000,
                        duration:'700-1000',
                        parent:'1',
                        type:'project'
                    },
                    {
                        id:'1-4-1',
                        name:'施工-采购',
                        start:850,
                        end:1000,
                        duration:'850-1000',
                        parent:'1-4',
                        type:'task'
                    },
                    {
                        id:'1-4-2',
                        name:'施工-招标',
                        start:850,
                        end:1000,
                        duration:'850-1000',
                        parent:'1-4',
                        type:'task'
                    },
                    {
                        id:'1-5',
                        name:'设计',
                        start:310,
                        end:400,
                        duration:450,
                        parent:'1',
                        type:'milestone'
                    },
                ],//树形数据
                relation:[
                    {
                        id:'f-6',
                        source:'1-3-2',
                        target:'1-4-2',
                        type:0,//FS:0 SS:1 FF:2 SF:3
                        lag:'关系6'
                    },
                    {
                        id:'f-7',
                        source:'1-1',
                        target:'1-2-2',
                        type:0,//FS:0 SS:1 FF:2 SF:3
                        lag:'关系6'
                    },
                    {
                        id:'f-8',
                        source:'1-2-5-1',
                        target:'1-2-4',
                        type:1,//FS:0 SS:1 FF:2 SF:3
                        lag:'关系6'
                    },
                    {
                        id:'f-9',
                        source:'1-3-1',
                        target:'1-2-4',
                        type:0,//FS:0 SS:1 FF:2 SF:3
                        lag:'关系6'
                    },
                    {
                        id:'f-10',
                        source:'1-2-3',
                        target:'1-2-4',
                        type:0,//FS:0 SS:1 FF:2 SF:3
                        lag:'关系6'
                    },
                    {
                        id:'f-11',
                        source:'1-3-1',
                        target:'1-3-2',
                        type:0,//FS:0 SS:1 FF:2 SF:3
                        lag:'关系6'
                    },
                    {
                        id:'f-12',
                        source:'1-3-2',
                        target:'1-4-1',
                        type:0,//FS:0 SS:1 FF:2 SF:3
                        lag:'关系6'
                    }
                ],//关系数据
                begin:new  Date().getTime(),//用于测试
                time:{
                    start_time:1521043200000,//2018.3.15
                    end_time:1606456527000,//2019.11.27
                }

            }
        },
        mounted(){
            this.getData()
        },
        methods:{
            getData:function(){
                console.info(qdPert);
                let vm=this;
                vm.begin=new  Date().getTime()//用于测试
                vm.taskTree.push({
                    id:'1',
                    name:'计划',
                    start:1,
                    end:1000,
                    duration:500,
                    parent: "",
                    type:'project'
                });
                qdPert.qdPertGraphConfig({containerId:'container',planList:vm.taskTree,planRelation:vm.relation});
                qdPert.qdInitGraph();
                let end=new Date().getTime();
                console.info("耗时"+(end -vm.begin));
            },
        },
        computed: {

        },

        components:{
            calendar,
            tree
        }
    }
</script>

<style scoped lang="less">
    .qd-pert{
        height: 100%;
        .pert-container{
            height: 100%;
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            justify-content: flex-start;
            .pert-tree{
              //  border-right: 1px solid #CECECE;
                border-right: 1px solid red;
            }
            .pert-draw{
                width: 60%;
            }

        }
    }


</style>
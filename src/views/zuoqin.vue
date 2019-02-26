/**
*create by Jancheng ON 2019/2/14
*
**/
<template>
    <div>
        <div>Zrender</div>
        <div><span @click="hideCanvas">隐藏</span><span @click="showCanvas">显示</span></div>
        <div id="container" style="height: 500px"></div>
    </div>
</template>
<script>
    import zrender from 'zrender/dist/zrender.min';
   // import QDTaskPert from './qd-pert-chart/zrender/shape/QDTaskPert';
    export default {
        data:function(){
            return {
                zr:null,
                zrg:null,
                yScale:50,
                taskTree:[
                    {
                        id:1,
                        name:'计划',
                        start:1,
                        end:500,
                        duration:500
                    },
                    {
                        id:'1-1',
                        name:'挖土',
                        start:1,
                        end:100,
                        duration:100
                    },
                    {
                        id:'1-2',
                        name:'混泥土',
                        start:200,
                        end:300,
                        duration:199
                    },
                    {
                        id:'1-2-1',
                        name:'排水',
                        start:101,
                        end:200,
                        duration:99
                    },
                    {
                        id:'1-2-2',
                        name:'土石方',
                        start:101,
                        end:300,
                        duration:199
                    },
                    {
                        id:'1-2-3',
                        name:'排线',
                        start:230,
                        end:300,
                        duration:99
                    },
                    {
                        id:'1-3',
                        name:'验收',
                        start:1,
                        end:700,
                        duration:700
                    },
                    {
                        id:'1-4',
                        name:'施工准备',
                        start:701,
                        end:800,
                        duration:99
                    }
                ],//树形数据
                taskTreeMap:{},//树形map
                relation:[{
                    id:'f-1',
                    source:'1-1',
                    target:'1-2',
                    type:0,//FS:0 SS:1 FF:2 SF:3
                    lag:10
                },{
                        id:'f-2',
                        source:'1-1',
                        target:'1-2-3',
                        type:0,//FS:0 SS:1 FF:2 SF:3
                        lag:10
                    },
                    {
                        id:'f-2',
                        source:'1-2',
                        target:'1-4',
                        type:0,//FS:0 SS:1 FF:2 SF:3
                        lag:10
                    }],
                dots:[],
            }
        },
        mounted:function () {
            let vm=this;
            let container=document.getElementById("container")
            vm.zr = zrender.init(container);
            vm.zrg=new zrender.Group();
            vm.buildTask();
            vm.buildRelation();
            vm.drawTasks();
            vm.drawRelations();
            // let container=document.getElementById("container")
            // this.zr = zrender.init(container);
            // this.zrg=new zrender.Group();
            // this.zrg.add(QDTaskPert.draw());
            // this.drawForm(vm.zrg)
            // this.zrg.add(vm.drawRhomb());
            // this.zrg.add(vm.drawCircle());
            // this.zrg.add(vm.drawLine());
            // this.zrg.add(vm.drawLineDashGroup());
            // this.zrg.add(vm.drawPolyLine());
            // this.zrg.add(vm.drawIsogon());
            // this.zr.add(vm.zrg);
            // 拖拽事件
            vm.zr.on('mousedown',function (e) {
                var disX = e.offsetX;
                var disY = e.offsetY;
                var zrgX=vm.zrg.position[0];//原来X轴
                var zrgY=vm.zrg.position[1];//原来Y轴
                vm.zr.on('mousemove',function (ev) {
                    var ev = ev || event;
                    var parmsX=ev.offsetX-disX;//移动X轴
                    var parmsY=ev.offsetY-disY;//移动Y轴
                    vm.zrg.attr('position',[zrgX+parmsX,zrgY+parmsY]);

                });
                vm.zr.on('mouseup',function () {
                    vm.zr.off('mousemove');
                });
            });
            //滚轮事件
            // vm.zr.on('mousewheel',function (event) {
            //     var  delta=event.wheelDelta;
            //     var p=0;
            //     if(delta>0){
            //         p=10;
            //         // vm.zrg.attr('scale',[2,1]);
            //     }else{
            //         p=-10;
            //         // vm.zrg.attr('scale',[1,1]);
            //     }
            //     console.info(vm.zrg);
            //
            //     vm.zrg.eachChild(function (c) {
            //         if(c.type=='line'){
            //             console.info("直线"+c.shape.x2);
            //             var x1=c.shape.x1;
            //             var x2=c.shape.x2+p;
            //             c.attr('shape',{x1:x1,x2:x2})
            //         }else{
            //             console.info("非直线"+c.shape.x);
            //             var x1=c.shape.x+p;
            //             var origin=c.origin;
            //             c.attr('origin',[x1,origin[1]]);
            //             c.attr('shape',{x:x1})
            //         }
            //     })
            // });
        },
        methods:{
            //绘制虚线 组合
            drawLineDashGroup:function () {
                //虚线组合
                var LineDashGroup=new zrender.Group();
                var LineDash = new zrender.Line({
                    shape: {
                        x1: 50,
                        y1: 400,
                        x2: 400,
                        y2:400
                    },
                    style:{
                        lineDash:[5,5],
                        strokeNoScale:false
                    }
                });
                var LineTopText=new zrender.Text({
                    style:{
                        text:'任务',
                    },
                    position: [60, 385]
                });
                var LineBottomText=new zrender.Text({
                    style:{
                        text:'10',
                    },
                    position: [60, 405]
                });
                //三角形
                var LineIsogon = new zrender.Isogon({
                    shape: {
                        x: 390,
                        y: 400,
                        r:4,
                        n:3
                    },
                    style:{
                        fill:"#FF6EBE",
                        stroke: '#FF6EBE'
                    }
                });
                //三角形旋转
                LineIsogon.attr('origin',[390,400]);
                LineIsogon.attr('rotation',(Math.PI/180)*30);
                LineDashGroup.add(LineDash);
                LineDashGroup.add(LineTopText);
                LineDashGroup.add(LineBottomText);
                LineDashGroup.add(LineIsogon);
                return LineDashGroup
            },
            //绘制 实线
            drawLine:function () {
                //实线
                var Line = new zrender.Line({
                    shape: {
                        x1: 10,
                        y1: 10,
                        x2: 200,
                        y2:10
                    },
                    style: {
                        text:'实线',
                    },
                    type:'line'
                });
                return Line ;
            },
            //绘制 菱形
            drawRhomb:function () {
                //菱形
                var Rect=new zrender.Rect({
                    shape:{
                        x:400,
                        y:400,
                        height:20,
                        width:20
                    },
                    style:{
                        fill:"#000",
                        text:'里程碑',
                        textPosition:'bottom'
                    }
                });
                //三角形旋转
                Rect.attr('origin',[400,400]);
                Rect.attr('rotation',(Math.PI/180)*45);
                return Rect;
            },
            //绘制 圆形
            drawCircle:function () {
                //圆
                var circle = new zrender.Circle({
                    shape: {
                        cx: 100,
                        cy: 300,
                        r: 10
                    },
                    style: {
                        text:'1',
                        fill: 'transparent',
                        stroke: '#FF6EBE'
                    },
                    silent: true
                });
                return circle;
            },
            //绘制 三角形
            drawIsogon:function () {
                //三角形
                var Isogon = new zrender.Isogon({
                    shape: {
                        x: 500,
                        y: 300,
                        r:4,
                        n:3
                    },
                    style:{
                        fill:"transparent",
                        stroke: '#FF6EBE'
                    }
                });
                //三角形旋转
                Isogon.attr('origin',[500,300]);
                Isogon.attr('rotation',(Math.PI/180)*180);
                return Isogon;
            },
            //绘制 折线
            drawPolyLine:function () {
                //折线
                var PolyLine=new zrender.Polyline({
                    shape: {
                        points:[[100,100],[100,200],[500,200],[500,300]]
                    },
                    style:{
                        text:'折线',
                        // textPosition:[10,10],
                        lineDash:[5,5]
                    },
                    type:'line'
                });
                return PolyLine;
            },
            //绘制 矩形
            drawRect:function(x=0,y=0,width=20,height=100){
                var Rect=new zrender.Rect({
                    shape:{
                        x:x,
                        y:y,
                        height:height,
                        width:width
                    },
                    style:{
                        fill:"#666666",
                        textPosition:'bottom'
                    }
                });
                return Rect;
            },
            //绘制 表格
            drawForm:function (ctx) {
                for(var i=0;i<10;i++){
                    var x=i*60;
                    ctx.add(this.drawRect(x,0,20,500));
                }
            },
            //绘制向量
            drawVector:function (ctx) {
                var v=[3,3]
                var LineVector=zrender.vector.add(v,v,[1,1]);
            },
            //隐藏
            hideCanvas:function () {
                let vm=this;
                vm.zrg.eachChild(function (c) {
                    if(c.type=='line'){
                        c.hide();
                    }
                })
            },
            //显示
            showCanvas:function () {
                let vm=this;
                vm.zrg.eachChild(function (c) {
                    if(c.type=='line'){
                        c.show();
                    }
                })
            },
            //构造Task
            buildTask:function () {
                let vm=this;
                //计划y
                for(let i=0;i<vm.taskTree.length;i++){
                    let task=vm.taskTree[i];
                    vm.calcRow(task,vm.taskTree,1);
                    vm.dots.push(task.start);
                    vm.dots.push(task.end);
                    vm.taskTreeMap[task.id]=task;
                }
                //所有时间排序
                vm.dotsSort();
            },
            //排序dot
            dotsSort:function(){
                let vm=this;
                vm.dots.sort(function (a,b) {
                    return a-b;
                });
            },
            //计算Row
            calcRow(currentTask,task=[],row){
                for(let i=0;i<task.length;i++){
                    let rowTasks=this.getRowTasks(row,task);
                    let only=this.checkOnlyInRow(currentTask,rowTasks);
                    if(only){
                        currentTask.row=row;
                        break;
                    }else{
                        this.calcRow(currentTask,task,++row);
                    }
                }
            },
            //寻找row task
            getRowTasks:function (row,tasks) {
                return tasks.filter(function (value) {
                    return value.row==row;
                });
            },
            //检测该数据是否再该行唯一
            checkOnlyInRow:function (task,rowTask,type="T") {
                let x1=task.start;
                let x2=task.end;
                let only=true;//唯一
                for(let i=0;i<rowTask.length;i++){
                    let btask=rowTask[i];
                    if(task.id==btask.id){
                        continue;
                    }
                    let bx1=btask.start;
                    let bx2=btask.end;
                    //区间内存在交际
                    if(type=='T'){
                        if(!(x1>bx2||x2<bx1)){
                            only=only&&false;
                            break;
                        }
                    }else{
                        if(!(x1>=bx2||x2<=bx1)){
                            only=only&&false;
                            break;
                        }
                    }
                }
                return only;
            },
            //绘制TaskTree
            drawTasks:function(){
                let vm=this;
                for(let i=0;i<vm.taskTree.length;i++){
                    let task=vm.taskTree[i];
                    vm.zrg.add(vm.drawTaskInfo(task));
                }
                this.zr.add(vm.zrg);
            },
            //绘制任务
            drawTaskInfo(task){
                let vm=this;
                let y=task.row*vm.yScale;
                //组合
                var taskGroup=new zrender.Group();
                var Line = new zrender.Line({
                    shape: {
                        x1: task.start+10,
                        y1: y,
                        x2: task.end-10,
                        y2:y
                    },
                    style:{
                        strokeNoScale:false
                    }
                });
                var LineTopText=new zrender.Text({
                    style:{
                        text:task.name,
                    },
                    position: [task.start+20,y-15]
                });
                var LineBottomText=new zrender.Text({
                    style:{
                        text:task.duration,
                    },
                    position: [task.start+20, y+10]
                });
                //三角形
                var LineIsogon = new zrender.Isogon({
                    shape: {
                        x: task.end-14,
                        y: y,
                        r:4,
                        n:3
                    },
                    style:{
                        fill:"#FF6EBE",
                        stroke: '#FF6EBE'
                    }
                });
                //三角形旋转
                LineIsogon.attr('origin',[task.end-14,y]);
                LineIsogon.attr('rotation',(Math.PI/180)*30);
                //pre圆
                var preDot = new zrender.Circle({
                    shape: {
                        cx: task.start,
                        cy: y,
                        r: 10
                    },
                    style: {
                        text:vm.dots.indexOf(task.start)+1,
                        fill: 'transparent',
                        stroke: '#FF6EBE'
                    },
                    silent: true
                });
                //post圆
                var postDot = new zrender.Circle({
                    shape: {
                        cx: task.end,
                        cy:y,
                        r: 10
                    },
                    style: {
                        text:vm.dots.indexOf(task.end)+1,
                        fill: 'transparent',
                        stroke: '#FF6EBE'
                    },
                    silent: true
                });
                taskGroup.add(Line);
                taskGroup.add(LineTopText);
                taskGroup.add(LineBottomText);
                taskGroup.add(LineIsogon);
                taskGroup.add(preDot);
                taskGroup.add(postDot);
                return taskGroup
            },
            //构造relation
            buildRelation:function(){
                let vm=this;
                for(let i=0;i<vm.relation.length;i++){
                    let relation=vm.relation[i];
                    let targetTask=vm.taskTreeMap[relation.target];
                    let dots=vm.calcReletionDots(relation,vm.taskTree,targetTask.row);
                    relation.dots=dots;
                    console.info(relation)
                }
            },
            //计算折线点
            calcReletionDots:function(relation,task=[],row){
                let vm=this;
                let dots=[];
                let sourceTask=vm.taskTreeMap[relation.source];
                let targetTask=vm.taskTreeMap[relation.target];
                for(let i=0;i<task.length;i++){
                    let rowTasks=this.getRowTasks(row,task);
                    let only=this.checkOnlyInRow({start:sourceTask.end,end:targetTask.start},rowTasks,'R');
                    if(only){
                        dots.push([sourceTask.end+10,sourceTask.row]);//起点
                        dots.push([sourceTask.end+10,row]);//折点1
                        dots.push([targetTask.start-10,row]);//折点2
                        dots.push([targetTask.start-10,targetTask.row]);//终点
                    }else{
                        return vm.calcReletionDots(relation,task,++row);
                    }
                    return dots;
                }
            },
            //绘制Relations
            drawRelations:function () {
                let vm=this;
                for(let i=0;i<vm.relation.length;i++){
                    let relation=vm.relation[i];
                    vm.zrg.add(vm.drawRelationInfo(relation));
                }
                this.zr.add(vm.zrg);
            },
            //绘制Relation
            drawRelationInfo:function (relation) {
                let vm=this;
                let dots=relation.dots;
                let drawDots=[];
                //组合
                var relationGroup=new zrender.Group();
                for(let i=0;i<dots.length;i++){
                    let dot=dots[i];
                    drawDots.push([dot[0],dot[1]*vm.yScale]);
                }
                //折线
                var polyLine=new zrender.Polyline({
                    shape: {
                        points:drawDots
                    },
                    style:{
                        text:relation.lag,
                        // textPosition:[10,10],
                        lineDash:[5,5]
                    },
                    type:'line'
                });
                //绘制三角形
                let dots3=drawDots[2];
                let dots4=drawDots[3];
                var LineIsogon = new zrender.Isogon({
                    shape: {
                        x: dots4[0]-4,
                        y: dots4[1],
                        r:4,
                        n:3
                    },
                    style:{
                        fill:"#FF6EBE",
                        stroke: '#FF6EBE'
                    }
                });
                //三角形旋转
                LineIsogon.attr('origin',[dots4[0]-4,dots4[1]]);
                //同层向左
                if(dots3[1]==dots4[1]){
                    LineIsogon.attr('rotation',(Math.PI/180)*30);
                }
                //向下
                if(dots3[1]<dots4[1]){
                    LineIsogon.attr('rotation',(Math.PI/180)*180);
                }
                relationGroup.add(polyLine)
                relationGroup.add(LineIsogon)
                return relationGroup;
            }
        }
    }
</script>
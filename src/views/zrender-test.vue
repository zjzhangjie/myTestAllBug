\<template>
    <div class="zrender">
        <div class="container" style="width:1500px;height:500px;">
            <div   :style="style"
                   ref="myCanvas"
                   @mousedown="mousedown"
                   class="main"
                   id="main"
                   @mousewheel="handleScroll($event)"
                   style="width:1500px;height:500px;"
            >
            </div>
        </div>

    </div>
</template>

<script>
    import zrender from 'zrender';
    import debounce from "lodash.debounce";
    export default {
        name: "zrender",
        data(){
            return{
                taskTree:[
                    {
                        id:1,
                        text:'任务1',
                        start_time:3,
                        end_time:20,
                        duration:15,
                    },
                    {
                        id:2,
                        text:'任务2',
                        start_time:2,
                        end_time:4,
                        duration:4,
                    },
                    {
                        id:3,
                        text:'任务3',
                        start_time:6,
                        end_time:10,
                        duration:20,
                    },
                    {
                        id:4,
                        text:'任务4',
                        start_time:22,
                        end_time:30,
                        duration:20,
                    },
                    {
                        id:5,
                        text:'任务5',
                        start_time:3,
                        end_time:15,
                        duration:20,
                    },   {
                        id:6,
                        text:'任务6',
                        start_time:17,
                        end_time:20,
                        duration:20,
                    },
                    {
                        id:7,
                        text:'任务7',
                        start_time:4,
                        end_time:20,
                        duration:20,
                    },
                    {
                        id:8,
                        text:'任务8',
                        start_time:18,
                        end_time:21,
                        duration:20,
                    },


                ],
                links:[{
                    id:123,
                    source:1,
                    target:2,
                    type:0//开始-开始
                },{
                    id:456,
                    source:1,
                    target:3,
                    type:0//开始-开始
                }
                ],
                scale:2,//放大缩小的速度
                cardSize:50,//事件点的宽度
                X: 0,
                Y: 0,
                L: 0,
                T: 0,
                n:0,//任务占的行数
                taskTreeMap:{},//树形map
                dots:[],
                zr:null,
                zrg:null,
            }
        },
        computed: {
            style() {
                return {
                    top: '100px',
                    left: '0px'
                };
            }
        },
        mounted(){
            this.initTime()
            //  window.addEventListener('mousewheel',this.handleScroll,false)
        },
        methods:{
            //监听鼠标事件
            handleScroll:debounce(function (e) {
                let vm=this;
                let direction = e.deltaY>0?'down':'up' ;//该语句可以用来判断滚轮是向上滑动还是向下
                if(direction=='down'){
                    if(vm.cardSize<20){return}
                    vm.cardSize=vm.cardSize-vm.scale;
                    vm.initTime()
                }else{
                    if(vm.cardSize>=50){return}
                    this.cardSize=this.cardSize+vm.scale;
                    vm.initTime()
                }
            },10),
            //监听鼠标拖动事件
            mousedown($event){
                console.log($event);
                let vm=this;
                vm.initMove($event);
                window.addEventListener('mousemove', vm.mousemove);
                window.addEventListener('mouseup', vm.moveEnd);
            },
            initMove(e){
                let vm=this;
                let dv = this.$refs.myCanvas;
                vm.X = e.clientX;
                vm.Y = e.clientY;
                vm.L = dv.offsetLeft;
                vm.T = dv.offsetTop;
            },
            mousemove(e) {
                let vm=this;
                let nx = e.clientX;
                let ny = e.clientY;
                let nl = nx - (vm.X - vm.L);
                let nt = ny - (vm.Y - vm.T);
                // 代码关键处
                vm.$refs.myCanvas.style.left = nl + 'px';
                vm.$refs.myCanvas.style.top = nt + 'px';
            },
            moveEnd(e){
                window.removeEventListener('mousemove', this.mousemove);
                window.removeEventListener('mouseup', this.moveEnd);
            },
            //初始化画布
            initCanvas(){
                let vm=this
                var zr = zrender.init(document.getElementById('main'));
                vm.zr =zr;
                vm.zrg=new zrender.Group();
                return zr
            },
            //初始化时间
            initTime() {
                let vm = this;
                let zr = this.initCanvas();
                let day = 30;
                for (let j = 0; j < day / 7; j++) {//确定周数
                    let text = '第' + (j + 1) + '周';
                    let width = vm.cardSize * 7;
                    let height = vm.cardSize;
                    vm.initRect(zr, j * vm.cardSize * 7, 0, width, height, text)
                }
                for (let j = 0; j < day; j++) {//确定天数
                    let text = j + 1;
                    let width = vm.cardSize;
                    let height = vm.cardSize;
                    vm.initRect(zr, j * vm.cardSize, vm.cardSize, width, height, text)
                }
                //计划y
                for(let i = 0; i < vm.taskTree.length; i++) {
                    let task = vm.taskTree[i];
                    vm.calcRow(task,vm.taskTree,1);
                    vm.dots.push(task.start_time);
                    vm.dots.push(task.end_time);
                    vm.taskTreeMap[task.id] = task;
                }
                vm.drawTasks();//画任务
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
                let x1=task.start_time*vm.cardSize;
                let x2=task.end_time*vm.cardSize;
                let y=task.row*vm.cardSize+2*vm.cardSize;
                let r=10;
                let color='black';
                //组合
                var taskGroup=new zrender.Group();
                let Line=vm.initLine(r,x1,x2,y,task.text,color="black");
                //    let LineBottomText=vm.initText(zr,r,x1,y,text)
                var LineBottomText=new zrender.Text({
                    style:{
                        text:task.duration,
                    },
                    position: [task.start_time*vm.cardSize+20, y+10]
                });
                //三角形
                var LineIsogon = new zrender.Isogon({
                    shape: {
                        x: task.end_time*vm.cardSize-14,
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
                LineIsogon.attr('origin',[task.end_time*vm.cardSize-14,y]);
                LineIsogon.attr('rotation',(Math.PI/180)*30);
                //pre圆
                var preDot = new zrender.Circle({
                    shape: {
                        cx: task.start_time*vm.cardSize,
                        cy: y,
                        r: 10
                    },
                    style: {
                        text:vm.dots.indexOf(task.start_time*vm.cardSize)+1,
                        fill: 'transparent',
                        stroke: '#FF6EBE'
                    },
                    silent: true
                });
                //post圆
                var postDot = new zrender.Circle({
                    shape: {
                        cx: task.end_time*vm.cardSize,
                        cy:y,
                        r: 10
                    },
                    style: {
                        text:vm.dots.indexOf(task.end_time*vm.cardSize)+1,
                        fill: 'transparent',
                        stroke: '#FF6EBE'
                    },
                    silent: true
                });
                taskGroup.add(Line);
                taskGroup.add(LineBottomText);
                taskGroup.add(LineIsogon);
                taskGroup.add(preDot);
                taskGroup.add(postDot);
                return taskGroup
            },
            //计算Row
            calcRow(currentTask,task=[],row){
                for(let i=0;i<task.length;i++){
                    let rowTasks=this.getRowTasks(row,task);
                    let only=this.checkOnlyInRow(currentTask,rowTasks);//没有重复的
                    if(only){
                        currentTask.row=row;
                        break;
                    }else{
                        this.calcRow(currentTask,task,++row);
                    }
                }
            },
            //检测该数据是否再该行唯一
            checkOnlyInRow:function (task,rowTask,type="T") {
                let x1=task.start_time;
                let x2=task.end_time;
                let only=true;//唯一
                for(let i=0;i<rowTask.length;i++){
                    let btask=rowTask[i];
                    if(task.id==btask.id){
                        continue;
                    }
                    let bx1=btask.start_time;
                    let bx2=btask.end_time;
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
            //寻找row task
            getRowTasks:function (row,tasks) {
                return tasks.filter(function (value) {
                    return value.row==row;
                });
            },
            //得到target的坐标位置
            //返回前任务的位置
            preTaskPosition(id){
                let vm=this;
                let list=vm.taskLists;
                for(let i=0;i<list.length;i++){
                    if(id==list[i].id){
                        let info={
                            item:list[i],
                            index:i
                        }
                        return info
                    }
                }
            },
            //当前任务没有前置任务的时候
            noPretask(i,zr,cardSize,item,r,x1,x2,y){
                let vm=this;
                //开始的圆圈
                let text=i+1;
                vm.initCircle(zr,cardSize,r,i,x1,y,text);
                //结束的圆圈
                let text_end=vm.taskLists.length+i+1;
                vm.initCircle(zr,cardSize,r,i,x2,y,text_end);
                //实线
                text=item.text;
                vm.initLine(zr,r,x1,x2,y,text);
                text=item.duration;
                vm.initText(zr,r,x1,y,text);
                //箭头
                vm.initArraw(zr,r,x2,y);

            },
            //画虚线的折线
            initLineDash(zr,x1,y1,x2,y2,x3,y3){
                var polyline = new zrender.Polyline({
                    z:0,//z值大的会把z值小的覆盖
                    shape: {
                        points:[[x1,y1],[x2,y2],[x3,y3]]
                    },
                    style: {
                        stroke:'red',
                        lineDash:[1,3]
                    },
                });
                zr.add(polyline);
            },
            //画实线
            initLine(r,x1,x2,y,text,color="black"){
                var Line = new zrender.Line({
                    z:0,//z值大的会把z值小的覆盖
                    shape: {
                        x1: x1,
                        y1: y,
                        x2: x2,
                        y2: y,
                    },
                    style: {
                        fill:color,
                        stroke:color,
                        text:text,
                        textPosition:'top',
                    },
                });
                return Line
                //   zr.add(Line);
            },
            //画圆形
            initCircle(zr,cardSize,r,i,x,y,text,color="black"){
                let circle = new zrender.Circle({
                    z:1,
                    silent: true,
                    shape: {
                        cx: x,
                        cy: y,
                        r: r
                    },
                    style: {
                        fill: '#ffffff',
                        stroke: color,
                        text:text
                    },
                    id:i
                });
                // circle.animate('shape', false)
                //     .when(1000, {
                //         cx: 100
                //     })
                //     .when(2000,{
                //         cx: x
                //     })
                //     .start();
                zr.add(circle);
                console.log("圆id:"+circle.id);
            },
            //画箭头
            initArraw(zr,r,x,y,color="black"){
                var polygon = new zrender.Polygon({
                    z:1,
                    shape: {
                        points:[[x-r*2,y-r],[x-r*2,y+r],[x-r,y]]
                    },
                    style: {
                        fill:color,
                        stroke: color,
                    },

                });
                zr.add(polygon);
            },
            //画文本
            initText(zr,r,x1,y,text){
                var t1 = new zrender.Text({
                    style: {
                        text: '工期'+text,
                        textVerticalAlign: 'middle',
                        fontFamily: 'Lato',
                        fontWeight: 'bolder',
                        textFill: 'blue',
                        blend: 'lighten'
                    },
                    position: [x1+r, y+r*2]
                });
                zr.add(t1);
            },
            //画矩形
            initRect(zr,x,y,width,height,text){
                var rect = new zrender.Rect({
                    shape: {
                        x: x,
                        y: y,
                        width: width,
                        height:height
                    },
                    style: {
                        fill:"#ffffff",
                        stroke:'black',
                        text:text
                    },
                });

                zr.add(rect);
            },
            //得到任务的前置任务
            getPreTask(id){
                let vm=this;
                let result=[]
                for(let i=0;i<vm.links.length;i++){
                    if(id==vm.links[i].source){
                        result.push(vm.links[i])
                    }
                }
                return result
            }
        }
    }
</script>

<style scoped lang="less">
    .zrender{
        .container{
            position: fixed;
            z-index: 200;
        }
        .main{
            border: 1px solid #000000;
            position: fixed;
            z-index: 100;
        }
    }
    /*.box {*/
    /*position: fixed;*/
    /*z-index: 100;*/
    /*width: 200px;*/
    /*height: 80px;*/
    /*background-color: #b2dba1;*/
    /*}*/
</style>
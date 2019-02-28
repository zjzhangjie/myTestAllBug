<template>
    <div class="zrender">
        <div class="time-container"  id="time" ref="time">
            <!--<div class="common-time">-->
                <!--<div class="year common-time-inner" v-for="item in year"  v-bind:style="{width:item.width+'px'}" >-->
                    <!--{{item.year}}年-->
                <!--</div>-->
            <!--</div>-->
            <div class="common-time">
                <div class="year common-time-inner" v-for="item in month"  v-bind:style="{width:item.width+'px'}" >
                  {{item.year}}年{{item.month}}月
                </div>
            </div>
            <div class="common-time">
                <div class="year common-time-inner" v-for="item in day"  v-bind:style="{width:cardSize+'px'}" >
                    {{item.day}}
                </div>
            </div>
        </div>
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
    import  common from '../tools/common'
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
                        start_time:12,
                        end_time:15,
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
                    type:0,//fs
                    lag:6
                },{
                    id:456,
                    source:5,
                    target:7,
                    type:1,//ss
                    lag:10
                    },
                    {
                        id:789,
                        source:6,
                        target:8,
                        type:3,//sf
                        lag:10
                    },
                    {
                        id:789,
                        source:6,
                        target:4,
                        type:2,//ff
                        lag:10
                    }
                ],
                scale:2,//放大缩小的速度
                X: 0,
                Y: 0,
                L: 0,
                T: 0,
                n:0,//任务占的行数
                taskTreeMap:{},//树形map
                dotsMap:{},//树形map
                dots:[],
                zr:null,
                zrg:null,
                start_time:1521043200000,//2018.3.15
                end_time:1606456527000,//2019.11.27
                year:[],
                month:[],
                week:[],
                day:[],
                yearWidth:0,
                monthWidth:0,
                dayWidth:50,
                cardSize:50,//事件点的宽度
                timeMap:{}
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
            this.initTime();
            this.$nextTick(function() {
                this.caleTime()
            },1000);

        },
        methods:{
            //表头的日历
            //格式化时间
            caleTime(){
              let vm=this;
              // let start_time= vm.formatTime(vm.start_time);
              // let end_time= vm.formatTime(vm.end_time);
                let start_time='2018-12-15';
                let end_time='2019-2-28';
              var s1 = start_time.replace(/-/g, "/");
              var s2 = end_time.replace(/-/g, "/");
              let d1 = new Date(s1);
              let d2 = new Date(s2);
              var time= d2.getTime() - d1.getTime();
              var days = parseInt(time / (1000 * 60 * 60 * 24));
              console.log(days);
              let array1 = start_time.split('-');
              let array2 = end_time.split('-');
              let month1 = parseInt(array1[1]);
              let month2 = parseInt(array2[1]);
              let year1 = parseInt(array1[0]);
              let year2 = parseInt(array2[0]);
              let day1 = parseInt(array1[2]);
              let day2 = parseInt(array2[2]);
              console.log(start_time);
              console.log(end_time);
              vm.caleYear(year1,year2);
              vm.caleMonth(month1,month2);
              vm.caleDay(day1,day2);
              vm.caleWeek();
              vm.caleWidth();

            },
            caleYear(year1,year2){
                let vm=this;
                let len=year2-year1+1;
                let obj={};
                for(let i=0;i<len;i++){
                    if(year1<=year2){
                        obj={
                            year:year1,
                            width:0,
                        };
                        vm.year.push(obj);
                        year1=year1+1;
                    }
                }
            },
            caleMonth(month1,month2){
                let vm=this;
                let len= vm.year.length;
                let obj={};
                for(let i=0;i<vm.year.length;i++){
                    if(i==0){
                        for (let j=month1-1;j<12;j++) {
                            obj={
                                year:vm.year[i].year,
                                month:j+1,
                                width:0
                            }
                            vm.month.push(obj)
                        }
                    }else if(i==len-1){
                        for (let j = 0; j < 12; j++) {
                                let num =j+1;
                                if (num <= month2) {
                                    obj={
                                        year:vm.year[i].year,
                                        month:num,
                                        width:0
                                    }
                                    vm.month.push(obj)
                                }
                            }
                    }else{
                        for (let j = 0; j < 12; j++) {
                                obj={
                                    year:vm.year[i].year,
                                    month:j + 1,
                                    width:0
                                }
                                vm.month.push(obj)
                            }
                        }

                }
            },
            caleDay(day1,day2){
                let vm=this;
                let obj={};
                for(let i=0;i<vm.month.length;i++){
                    let item=vm.month[i];

                    if(i==0){
                        vm.resetDay(obj,item,day1-1)
                    }else if(i==vm.month.length-1){
                        vm.resetDay(obj,item,0,day2)
                    }else{
                        vm.resetDay(obj,item,0)
                    }
                }
              console.log(vm.day);
              console.log(vm.month)
            },
            resetDay(obj,item,day,end=0){
                let vm=this;
                if(item.month==1||item.month==3||
                    item.month==5||item.month==7||
                    item.month==8||item.month==10||
                    item.month==12){
                    if(end==0){end=31}
                    item.width=(end-day)*vm.cardSize;
                    item.length=end-day;
                    item.day=[];
                    for(let j=day;j<end;j++){
                       item.day.push(j+1);
                        obj={year:item.year, month: item.month,day:j+1};vm.day.push(obj)
                    }
                }else if(item.month==2){
                    if(item.year%4==0){
                        if(end==0){end=29}
                        item.width=(end-day)*vm.cardSize;
                        item.length=end-day;
                        item.day=[];
                        for(let j=day;j<end;j++){
                           item.day.push(j+1);
                            obj={year:item.year, month: item.month,day:j+1};vm.day.push(obj)
                        }
                    }else{
                        if(end==0){end=28}
                        item.width=(end-day)*vm.cardSize;
                        item.length=end-day;
                        item.day=[];
                        for(let j=day;j<end;j++){
                        item.day.push(j+1);
                            obj={year:item.year, month: item.month,day:j+1};vm.day.push(obj)
                        }
                    }
                }else{
                    if(end==0){end=30}
                    item.width=(end-day)*vm.cardSize;
                    item.length=end-day;
                    item.day=[];
                    for(let j=day;j<30;j++){
                        item.day.push(j+1);
                        obj={day:j+1};vm.day.push(obj)
                    }
                }
            },
            caleWeek(){},
            //计算宽度
            caleWidth(){
                let vm=this;
                $("#time").width(vm.day.length*vm.cardSize);
                let width=0;
                //计算年的宽度
                // for(let i=0;i<vm.month.length;i++){
                //    for(let j=0;j<vm.year.length;j++){
                //        if(vm.year[j].year==vm.month[i].year){
                //          vm.year[i].width=vm.year[i].width+vm.month[i].width;
                //        }
                //   }
                //  }
               if(vm.cardSize==20){
                   vm.twoDay();
                }
                //计算月的宽度
                // for(let i=0;i<vm.month.length;i++){
                //     vm.month[i].width=vm.month[i].length*vm.cardSize
                // }
                console.log(vm.cardSize);
                console.log(vm.year);
            },
            //时隔两天
            twoDay(){
                let vm=this;
                for(let i=0;i<vm.day.length;i++){
                    let item=vm.day[i].day;
                    if(i!==0&&item%2==0){
                        vm.day.splice(i,1)
                    }
                }
                vm.cardSize=40;
                console.log(vm.cardSize)
            },
            formatTime(time) {
                return common.formateTimestamp(time, "YYYY-MM-DD");
            },
            //监听鼠标事件
            handleScroll:debounce(function (e) {
                let vm=this;
                let direction = e.deltaY>0?'down':'up' ;//该语句可以用来判断滚轮是向上滑动还是向下
                if(direction=='down'){
                    if(vm.cardSize<20){return}
                    vm.cardSize=vm.cardSize-vm.scale;
                    vm.caleWidth();
                    vm.initTime()
                }else{
                    if(vm.cardSize>=70){return}
                    this.cardSize=this.cardSize+vm.scale;
                    vm.caleWidth();
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
                vm.$refs.time.style.left = nl + 'px';
            },
            moveEnd(e){
                window.removeEventListener('mousemove', this.mousemove);
                window.removeEventListener('mouseup', this.moveEnd);
            },
            //初始化画布
            initCanvas(){
                let vm=this;
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
                // for (let j = 0; j < day / 7; j++) {//确定周数
                //     let text = '第' + (j + 1) + '周';
                //     let width = vm.cardSize * 7;
                //     let height = vm.cardSize;
                //     vm.initRect(zr, j * vm.cardSize * 7, 0, width, height, text)
                // }
                // for (let j = 0; j < day; j++) {//确定天数
                //     let text = j + 1;
                //     let width = vm.cardSize;
                //     let height = vm.cardSize;
                //     vm.initRect(zr, j * vm.cardSize, vm.cardSize, width, height, text)
                // }
                vm.initTask();
                vm.initRelations();
                vm.drawTasks();//画任务
                vm.drawRelations();//画前置任务
            },
            initTask(){
                //计划y
                let vm=this;
                vm.dots=[];
                for(let i = 0; i < vm.taskTree.length; i++) {
                    let task = vm.taskTree[i];
                    vm.calcRow(task,vm.taskTree,1);
                    let obj1={time:task.start_time, id:task.id};
                    let obj2={time:task.end_time, id:task.id};
                    vm.dots.push(obj1);
                    vm.dots.push(obj2);
                    vm.taskTreeMap[task.id] = task;
                }
                //所有时间排序
                vm.dotsSort();

            },
            //排序dot
            dotsSort:function(){
                let vm=this;
                vm.dots.sort(function (a,b) {
                    return a.time-b.time;
                });
                for(let i=0;i<vm.dots.length;i++){
                    let dot=vm.dots[i];
                    let obj={
                        index:i,
                        time:dot.time,
                        id:dot.id
                    }
                    vm.dots[i]=obj;
                }
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
            //寻找row task
            getRowTasks:function (row,tasks) {
                return tasks.filter(function (value) {
                    return value.row==row;
                });
            },
            //检测该数据是否再该行唯一
            checkOnlyInRow:function(task,rowTask,type="T") {
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
            //绘制TaskTree
            drawTasks:function(){
                let vm=this;
                for(let i=0;i<vm.taskTree.length;i++){
                    let task=vm.taskTree[i];
                    vm.zrg.add(vm.drawTaskInfo(task,i));
                }
                this.zr.add(vm.zrg);
            },
            //绘制任务
            drawTaskInfo(task,i){
                let vm=this;
                let x1=task.start_time*vm.cardSize;
                let x2=task.end_time*vm.cardSize;
                let y=task.row*vm.cardSize;
                let r=10;
                let color='black';
                //组合
                let taskGroup=new zrender.Group();
                let Line=vm.initLine(r,x1,x2,y,task.text,color="black");
                let LineBottomText=vm.initText(r,x1,y,task.duration);
                let LineIsogon=vm.initArraw(r,x2-2*r+5,y)//三角形
                //三角形旋转
                LineIsogon.attr('origin',[x2-2*r+5,y]);
                LineIsogon.attr('rotation',(Math.PI/180)*30);
                let index=vm.calcIndex(task.id,task.start_time);
                let  preDot=vm.initCircle(r,x1,y,index+1,color="black");
                 index=vm.calcIndex(task.id,task.end_time);
                let  postDot=vm.initCircle(r,x2,y,index+1,color="black");
                taskGroup.id=i;
                taskGroup.add(Line);
                taskGroup.add(LineBottomText);
                taskGroup.add(LineIsogon);
                taskGroup.add(preDot);
                taskGroup.add(postDot);
                return taskGroup
            },
            calcIndex(id,time){
                let vm=this;
                let index=-1;
                for(let i=0;i<vm.dots.length;i++){
                    let dot=vm.dots[i];
                    if(id==dot.id&&time==dot.time){
                        index=dot.index
                        continue
                    }
                }
                return index

            },
            initRelations(){
                let vm=this;
                for(let i=0;i<vm.links.length;i++){
                    let link=vm.links[i];
                    let targetTask=vm.taskTreeMap[link.target];
                    let dots=vm.calcReletionDots(link,vm.taskTree,targetTask.row);
                    link.dots=dots;
                }
            },
            //计算折线点  0:fs,1:ss,2:ff,3:sf
            calcReletionDots:function(link,task=[],row){//第一条的时候
                let vm=this;
                let dots=[];
                let sourceTask=vm.taskTreeMap[link.source];
                let targetTask=vm.taskTreeMap[link.target];
                let s_x1=sourceTask.start_time;
                let s_x2=sourceTask.end_time;
                let t_x1=targetTask.start_time;
                let t_x2=targetTask.end_time;
                let caleTime={};
                let len=vm.cardSize;
                let dot1={x:s_x2*len, y:sourceTask.row*len};
                let dot2={x:s_x2*len, y:row*len};
                let dot3={x:t_x1*len, y:row*len};
                let dot4={x:t_x1*len, y:targetTask.row*len};
                if(link.type==0){//fs
                     caleTime={start:s_x2, end:t_x1}
                }else if(link.type==1){//ss
                     caleTime={start:s_x1, end:t_x1};
                     dot1={x:s_x1*len, y:sourceTask.row*len};
                     dot2={x:s_x1*len, y:row*len};
                     dot3={x:t_x1*len, y:row*len};
                     dot4={x:t_x1*len, y:targetTask.row*len};
                }else if(link.type==2){//ff
                    caleTime={start:s_x2, end:t_x2};
                    dot1={x:s_x2*len, y:sourceTask.row*len};
                    dot2={x:s_x2*len, y:row*len};
                    dot3={x:t_x2*len, y:row*len};
                    dot4={x:t_x2*len, y:targetTask.row*len};
                } else if(link.type==3){//sf
                    caleTime={start:s_x1, end:t_x2};
                    dot1={x:s_x1*len, y:sourceTask.row*len};
                    dot2={x:s_x1*len, y:row*len};
                    dot3={x:t_x2*len, y:row*len};
                    dot4={x:t_x2*len, y:targetTask.row*len};
                }
                for(let i=0;i<task.length;i++){
                    let rowTasks=this.getRowTasks(row,task);//当前行的所有任务
                    let only=this.checkOnlyInRow(caleTime,rowTasks,'R');
                    if(only){//
                        dots.push([dot1.x,dot1.y]);//起点
                        dots.push([dot2.x,dot2.y]);//折点1
                        dots.push([dot3.x,dot3.y]);//折点2
                        dots.push([dot4.x,dot4.y]);//终点
                    }else{
                        return vm.calcReletionDots(link,task,++row);
                    }
                    return dots;
                }
            },
            //判断关联的类型
            //绘制Relations
            drawRelations:function () {
                let vm=this;
                for(let i=0;i<vm.links.length;i++){
                    let link=vm.links[i];
                    vm.zrg.add(vm.drawRelationInfo(link));
                }
                this.zr.add(vm.zrg);
            },
            drawRelationInfo:function (relation) {
                let vm=this;
                let dots=relation.dots;
                let drawDots=[];
                //组合
                var relationGroup=new zrender.Group();
                for(let i=0;i<dots.length;i++){
                    let dot=dots[i];
                    drawDots.push([dot[0],dot[1]]);
                }
                //折线
                let polyLine=vm.initLineDash(drawDots,relation.lag)
                //绘制三角形
                let dots3=drawDots[2];
                let dots4=drawDots[3];
                let x=dots4[0];
                let y=dots4[1];
                let r=vm.r
                let color='red';
                let LineIsogon=vm.initArraw(r,x,y+2*9,color);
                //三角形旋转
                LineIsogon.attr('origin',[x,y+2*10]);
                //同层向左
                if(dots3[1]==dots4[1]){
                    LineIsogon.attr('rotation',(Math.PI/180)*30);
                }
                //向下
                if(dots3[1]<dots4[1]){
                    LineIsogon.attr('rotation',(Math.PI/180)*180);
                }
                relationGroup.add(polyLine);
                relationGroup.add(LineIsogon);
                return relationGroup;
            },
            //绘制折线
            initLineDash(points,text){
                var polyline = new zrender.Polyline({
                    z:0,//z值大的会把z值小的覆盖
                    shape: {
                        points:points
                    },
                    style: {
                        text:text,
                        textAlign:'center',
                        textPosition:'bottom',
                        textFill:'green',
                        stroke:'red',
                        lineDash:[6,3]
                    },
                });
             return polyline
            },
            //画三角形
            initArraw(r,x,y,color='black'){
                var LineIsogon = new zrender.Isogon({
                    z:3,//z值大的会把z值小的覆盖
                    shape: {
                        x:x,
                        y: y,
                        r:5,
                        n:3
                    },
                    style:{
                        fill:color,
                        stroke: color
                    },
                    name:'LineIsogon'
                });
                return LineIsogon
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
                        textFill: 'blue',
                        textPosition:'top',
                    },
                    name:'Line'
                });
                return Line
             //   zr.add(Line);
            },
            //画圆形
            initCircle(r,x,y,text,color="black"){
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
                    name:'circle'
                });
              return circle
               // console.log("圆id:"+circle.id);
            },
            //画文本
            initText(r,x1,y,text){
                var Text = new zrender.Text({
                    style: {
                        text: '工期'+text,
                        textVerticalAlign: 'middle',
                        fontFamily: 'Lato',
                        fontWeight: 'bolder',
                        textFill: 'blue',
                        blend: 'lighten'
                    },
                    position: [x1+r, y+r*2],
                    name:'Text'
                });
                return Text
              //  zr.add(t1);
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
            left:0;
            z-index: 200;
        }
        .main{
            border: 1px solid #000000;
            position: fixed;
            z-index: 100;
            margin-top: 70px;
        }
        .time-container{
            position: fixed;
            left: 0;
           // height: 60px;
            color: #6b6b6b;
            font-size: 12px;
            border: 1px solid #CECECE;
            .common-time{
                display: flex;
                flex-direction: row;
                height: 19px;
                border-bottom: 1px solid #CECECE;
                .common-time-inner{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-right: 1px solid #ebebeb;
                }
                .common-time-inner:last-child{
                   border-right: none;
                }
                &:first-child{

                }
                &:last-child{
                    border-bottom: none;
                }
            }

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
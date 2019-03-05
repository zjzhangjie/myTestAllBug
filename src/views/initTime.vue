<template>
    <div class="zrender">
        <div class="time-container"  id="time" ref="time">
            <!--<div class="common-time">-->
            <!--<div class="year common-time-inner" v-for="item in year"  v-bind:style="{width:item.width+'px'}" >-->
            <!--{{item.year}}年-->
            <!--</div>-->
            <!--</div>-->
            <div class="common-time">
                <div class="year common-time-inner" v-for="item in month"  v-bind:style="{width:(item.width)+'px'}" >
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
                originDay:[],
                originMonth:[],
                yearWidth:0,
                monthWidth:0,
                dayWidth:50,
                cardSize:50,//事件点的宽度
                timeMap:{},
                twoList:[],
                threeList:[],
                fiveList:[],
                sevenList:[],
                twoMonth:[],
                threeMonth:[],
                fiveMonth:[],
                sevenMonth:[],
                timer:0,
                changeWidth:0,
                day1:[],
                day2:[]
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
                vm.day1 = parseInt(array1[2]);
                vm.day2 = parseInt(array2[2]);
                console.log(start_time);
                console.log(end_time);
                vm.caleYear(year1,year2);
                vm.caleMonth(month1,month2);
                vm.caleDay(vm.day1,vm.day2);
                vm.caleChange();
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
                vm.originDay=JSON.parse(JSON.stringify(vm.day));
                vm.originMonth=JSON.parse(JSON.stringify(vm.month));
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
            caleChange(){
                let vm=this;
                vm.twoList=vm.changeDay(2);
                vm.threeList=vm.changeDay(3);
                vm.fiveList=vm.changeDay(5);
                vm.sevenList=vm.changeDay(7);
                vm.twoMonth=vm.ChangeMonth(vm.twoList);
                vm.threeMonth=  vm.ChangeMonth(vm.threeList);
                vm.fiveMonth=  vm.ChangeMonth(vm.fiveList);
                vm.sevenMonth=  vm.ChangeMonth(vm.sevenList);
                console.log("变换过的数组");
                console.log( vm.threeList);
            },
            //改变天的间隔
            changeDay(n){
                let vm=this;
                let originDay=JSON.parse(JSON.stringify(vm.originDay));
                let newDay=[];
                for(let i=0;i<originDay.length;i++){
                    if(i%n==0){
                        newDay.push(originDay[i]);
                 }
                }
                originDay=newDay;
                return originDay
            },
            //改变月的长度
            ChangeMonth(arr1){
                let vm=this;
                let arr2=JSON.parse(JSON.stringify(vm.originMonth));
                for(let j=0;j<arr2.length;j++){
                    let len=0;
                    for(let i=0;i<arr1.length;i++){
                        if(arr1[i].year==arr2[j].year&&
                            arr1[i].month==arr2[j].month
                        ){
                            len=len+1;
                            arr2[j].length=len;
                            arr2[j].width=len*vm.cardSize
                        }
                    }

                 }
                console.log(arr2);
                return arr2

            },
            //计算宽度
            minScaleWidth(){
                let vm=this;
                if(vm.cardSize==20){
                    if(vm.timer==0){
                        vm.timer=2;
                        vm.day= vm.twoList;
                        vm.month= vm.twoMonth;
                        vm.cardSize=40;
                        return
                    }
                    if(vm.timer==2){
                        vm.timer=3;
                        vm.day= vm.threeList;
                        vm.month= vm.threeMonth;
                        vm.cardSize=40;
                        return
                    }
                    if(vm.timer==3){
                        vm.timer=5;
                        vm.day= vm.fiveList;
                        vm.month= vm.fiveMonth;
                        vm.cardSize=40;
                        return
                    }
                    if(vm.timer==5){
                        vm.timer=7;
                        vm.day= vm.sevenList;
                        vm.month= vm.sevenMonth;
                        vm.cardSize=40;
                        return
                    }
                }
                console.log(vm.cardSize);
            },
            maxScaleWidth(){
                let vm=this;
                if(vm.cardSize==70){
                    if(vm.timer==7){
                        vm.timer=5;
                        vm.day= vm.fiveList;
                        vm.cardSize=40;
                        return
                    }
                    if(vm.timer==5){
                        vm.timer=3;
                        vm.day= vm.threeList;
                        vm.cardSize=40;
                        return
                    }
                    if(vm.timer==3){
                        vm.timer=2;
                        vm.day= vm.twoList;
                        vm.cardSize=40;
                        return
                    }
                    if(vm.timer==2){
                        vm.timer=0;
                        vm.day= vm.originDay;
                        vm.cardSize=40;
                        return
                    }
                }
                console.log(vm.cardSize);
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
                    $("#time").width(vm.day.length*vm.cardSize);
                    vm.minScaleWidth();
                }else{
                    if(vm.cardSize>=70){return}
                    this.cardSize=this.cardSize+vm.scale;
                    $("#time").width(vm.day.length*vm.cardSize);
                    vm.maxScaleWidth();
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
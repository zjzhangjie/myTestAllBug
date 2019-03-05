/**
*create by zhangjie ON 2018/3/4
*  props:{
*    left:左右拖动的距离
*    cardSize:放大缩小的比例
timer:缩放的比例
isReduce:是否缩小
*  }
**/
<template>
    <div>
        <div class="time-container-row" :style="style">
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
        <!--<div  :style="style" class="time-container"  @mousewheel="handleScroll($event)"  id="time" ref="time">-->
        <!--<div class="common-time">-->
        <!--<div  v-for="item in month" class="common-time-item">-->
        <!--<div class="month">{{item.year}}年{{item.month}}月</div>-->
        <!--<div class="common-time-inner">-->
        <!--<div class="day" v-for="i in item.day"  v-bind:style="{width:cardSize+'px'}" >-->
        <!--{{i}}-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
    </div>

</template>

<script>
    import debounce from "lodash.debounce";
    import  common from '../tools/common'
    export default {
        name: "calendar",
        props:{
            cardSize:{
                type:Number,
                default:50
            },
            left:{
                type:String,
                default:'0px'
            },
            timer:{
                type:Number,
                default:0
            },
            isReduce:{
                type:Boolean,
                default:false

            },
        },
        computed: {
            style() {
                return{
                    top: '100px',
                    left: this.left
                };
            },
            cTimer(){
                return this.timer
            }
        },
        watch:{
            cTimer(newVal,oldVal){
                let vm=this;
                if(vm.isReduce){
                    vm.minScaleWidth(newVal);
                    return
                }
                vm.maxScaleWidth(newVal)
            }
        },
        data(){
            return{
                scale:2,//放大缩小的速度
                X: 0,
                Y: 0,
                L: 0,
                T: 0,
                start_time:1521043200000,//2018.3.15
                end_time:1606456527000,//2019.11.27
                year:[],
                month:[],
                originMonth:[],
                originDay:[],
                week:[],
                day:[],
                yearWidth:0,
                monthWidth:0,
                dayWidth:50,
                timeMap:{},
                twoList:[],
                threeList:[],
                fiveList:[],
                sevenList:[],
                tenList:[],
            }
        },
        mounted(){
            this.$nextTick(function() {
                this.caleTime()
            },1000);
        },
        methods:{
            //计算宽度
            minScaleWidth(newVal){
                let vm=this;
                if(vm.cardSize==20){
                    if(newVal==2){
                        vm.month= vm.twoList;
                        return
                    }
                    if(newVal==3){
                        vm.month= vm.threeList;
                        return
                    }
                    if(newVal==5){
                        vm.month= vm.fiveList;
                        return
                    }
                    if(newVal==7){
                        vm.month= vm.sevenList;
                        return
                    }
                    if(newVal==10){
                        vm.month= vm.tenList;
                        return
                    }
                }
                console.log(vm.cardSize);
            },
            maxScaleWidth(newVal){
                let vm=this;
                if(vm.cardSize==70){
                    if(newVal==10){
                        vm.month= vm.sevenList;
                        return
                    }
                    if(newVal==7){
                        vm.month= vm.fiveList;
                        return
                    }
                    if(newVal==5){
                        vm.month= vm.threeList;
                        return
                    }
                    if(newVal==3){
                        vm.month= vm.twoList;
                        return
                    }
                    if(newVal==2){
                        vm.month= vm.originMonth;
                        return
                    }
                }
                console.log(vm.cardSize);
            },
            //表头的日历
            caleTime(){
                let vm=this;
                // let start_time= vm.formatTime(vm.start_time);
                // let end_time= vm.formatTime(vm.end_time);
                let start_time='2018-1-15';
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
                vm.caleWeek(year1,d1);
                vm.caleChange();

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
                console.log(vm.month);
                vm.originMonth=JSON.parse(JSON.stringify(vm.month));
                vm.originDay=JSON.parse(JSON.stringify(vm.day));
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
                        let day=vm.PrefixInteger(j+1,2);
                        item.day.push(day);
                        obj={year:item.year, month: item.month,day:day};vm.day.push(obj)
                    }
                }else if(item.month==2){
                    if(item.year%4==0){
                        if(end==0){end=29}
                        item.width=(end-day)*vm.cardSize;
                        item.length=end-day;
                        item.day=[];
                        for(let j=day;j<end;j++){
                            let day=vm.PrefixInteger(j+1,2);
                            item.day.push(day);
                            obj={year:item.year, month: item.month,day:day};vm.day.push(obj)
                        }
                    }else{
                        if(end==0){end=28}
                        item.width=(end-day)*vm.cardSize;
                        item.length=end-day;
                        item.day=[];
                        for(let j=day;j<end;j++){
                            let day=vm.PrefixInteger(j+1,2);
                            item.day.push(day);
                            obj={year:item.year, month: item.month,day:day};vm.day.push(obj)
                        }
                    }
                }else{
                    if(end==0){end=30}
                    item.width=(end-day)*vm.cardSize;
                    item.length=end-day;
                    item.day=[];
                    for(let j=day;j<30;j++){
                        let day=vm.PrefixInteger(j+1,2);
                        item.day.push(day);
                        obj={year:item.year, month: item.month,day:day};vm.day.push(obj)
                    }
                }
            },
            //如果是一位则补零
            PrefixInteger(num, n) {
                return (Array(n).join(0) + num).slice(-n);
            },
            caleWeek(year,data2){
                let vm=this;
                let date1 = new Date(year, 0, 1);
                let time=data2.getTime()-date1.getTime();
                var days = parseInt(time  / (1000 * 60 * 60 * 24));
                let week=0;
                if(days%7==0){
                    week=days/7

                }else{
                    week=parseInt(days/7)
                }
                vm.week=week;
                console.log("第几周"+vm.week)
            },
            caleChange(){
                let vm=this;
                let arr1=vm.changeDay(2);
                let arr2=vm.changeDay(3);
                let arr3=vm.changeDay(5);
                let arr4=vm.changeDay(7);
                let arr5=vm.changeDay(10);
                vm.twoList=vm.ChangeMonth(arr1);
                vm.threeList=vm.ChangeMonth(arr2);
                vm.fiveList=vm.ChangeMonth(arr3);
                vm.sevenList=vm.ChangeMonth(arr4);
                vm.tenList=vm.ChangeMonth(arr5);
                console.log("这是上旬下旬中旬的结果");
                console.log(arr5);

            },
            //改变天的间隔
            changeDay(n){
                let vm=this;
                let originDay=JSON.parse(JSON.stringify(vm.originDay));
                let week=vm.week;
                let newDay=[];
                for(let i=0;i<originDay.length;i++){
                    if(i%n==0){
                        if(n==7){
                            week=week+1;
                            originDay[i].day='第'+(week)+'周';
                            newDay.push(originDay[i]);
                        }else if(n==10){
                            originDay[i]=vm.judgeXun(originDay[i]);
                            newDay.push(originDay[i]);
                        }else{
                            newDay.push(originDay[i]);
                        }
                    }
                }
                originDay=newDay;
                return originDay
            },
            //判断上旬、中旬、下旬
            judgeXun(item){
                if(item.day<=10){
                    item.day='上旬'
                }else if(item.day>=21){
                    item.day='下旬'
                }else{
                    item.day='中旬'
                }
                return item
            },
            //改变月里面天的间隔
            ChangeMonth(arr1){
                let vm=this;
                let arr2=JSON.parse(JSON.stringify(vm.originMonth));
                for(let j=0;j<arr2.length;j++){
                    let obj=[];
                    for(let i=0;i<arr1.length;i++){
                        if(arr1[i].year==arr2[j].year&&
                            arr1[i].month==arr2[j].month
                        ){
                            obj.push(arr1[i].day);
                            arr2[j].day=obj
                        }
                    }

                }
                return arr2

            },
            formatTime(time) {
                return common.formateTimestamp(time, "YYYY-MM-DD");
            },
            //监听鼠标事件
            handleScroll:debounce(function (e) {
                // let vm=this;
                // let direction = e.deltaY>0?'down':'up' ;//该语句可以用来判断滚轮是向上滑动还是向下
                // if(direction=='down'){
                //     if(vm.cardSize<20){return}
                //     vm.cardSize=vm.cardSize-vm.scale;
                //     vm.minScaleWidth();
                //     vm.initTime()
                // }else{
                //     if(vm.cardSize>=70){return}
                //     this.cardSize=this.cardSize+vm.scale;
                //     vm.maxScaleWidth();
                //     vm.initTime()
                // }
            },10),

        }
    }
</script>

<style scoped lang="less">
    .time-container-row{
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
    /*.time-container{*/
    /*position: fixed;*/
    /*left: 0;*/
    /*color: #6b6b6b;*/
    /*font-size: 12px;*/
    /*.common-time{*/
    /*display: flex;*/
    /*flex-direction: row;*/
    /*border: 1px solid #CECECE;*/
    /*border-right: none;*/
    /*.common-time-item{*/
    /*.month{*/
    /*display: flex;*/
    /*align-items: center;*/
    /*justify-content: center;*/
    /*border-right: 1px solid #CECECE;*/
    /*border-bottom: 1px solid #CECECE;*/
    /*height: 19px;*/
    /*}*/
    /*.common-time-inner{*/
    /*display: flex;*/
    /*flex-direction: row;*/
    /*.day{*/
    /*display: flex;*/
    /*align-items: center;*/
    /*justify-content: center;*/
    /*height: 19px;*/
    /*border-right: 1px solid #CECECE;*/
    /*}*/

    /*}*/
    /*}*/

    /*//  height: 38px;*/
    /*}*/

    /*}*/

</style>
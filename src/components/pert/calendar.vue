/**
*create by zhangjie ON 2018/3/4
*  props:{
*    left:左右拖动的距离
*    cardSize:放大缩小的比例
     zoom:0：只显示年。1：只显示年月。2：只显示年月周。3：只显示月周星期 4：只显示月日
*  }
**/
<template>
    <div>
        <div class="time-container-row" :style="style" id="time">
            <div class="common-time" v-if="isYear" v-bind:style="{height:hYear+'px'}">
                <div class="year common-time-inner" v-for="item in year" v-bind:style="{width:(item.length*cardSize)+'px'}">
                    {{item.year}}年
                </div>
            </div>
            <!--月-->
            <div class="common-time" v-if="isMonth" :style="{height:hMonth+'px'}">
                <div class="year common-time-inner" v-for="item in month"  v-bind:style="{width:(item.length*cardSize)+'px'}" >
                    {{item.year}}年{{item.month}}月
                </div>
            </div>
            <!--日-->
            <div class="common-time" v-if="isDay" v-bind:style="{height:hDay+'px'}">
                <div class="year common-time-inner" v-for="item in day"  v-bind:style="{width:cardSize+'px'}" >
                    {{item.day}}日
                </div>
            </div>
            <!--周-->
            <div class="common-time" v-if="isWeek" :style="{height:hWeek+'px'}">
                <div class="year common-time-inner" v-for="item in sevenDay"  v-bind:style="{width:(item.length*cardSize)+'px'}" >
                    {{item.day}}
                </div>
            </div>
            <!--星期-->
            <div class="common-time" v-if="isWatt" :style="{height:hWatt+'px'}">
                <div class="year common-time-inner" v-for="item in day"  v-bind:style="{width:cardSize+'px'}" >
                    {{item.week}}
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import debounce from "lodash.debounce";
    import  common from '../../tools/common'
    export default {
        name: "calendar",
        props:{
            cardSize:{
                type:Number,
                default:50,
            },
            left:{
                type:String,
                default:'0px'
            },
            zoom:{
                type:Number,
                default:0
            },
            time:{
                type:Object,
                default: function() {
                    return {
                        start_time:new Date().getTime(),
                        end_time:''
                    };
                }
            }

        },
        data(){
            return{
                start_time:1521043200000,//2018.3.15
                end_time:1606456527000,//2019.11.27
                year:[],
                month:[],
                week:0,//计算是第几周
                day:[],
                originMonth:[],
                originDay:[],
                originYear:[],

                twoDay:[],
                threeDay:[],
                fiveDay:[],
                sevenDay:[],
                tenDay:[],

                twoList:[],
                threeList:[],
                fiveList:[],
                sevenList:[],
                tenList:[],

                twoYear:[],
                threeYear:[],
                fiveYear:[],
                sevenYear:[],
                tenYear:[],

                hYear:20,
                hMonth:20,
                hWeek:20,
                hDay:20,
                hWatt:20,


            }
        },
        computed: {
            zoomT(){
                console.log("变化成什么样子")
                console.log(this.zoom);
                return this.zoom
            },
            style() {
                return{
                    top: '100px',
                    left: this.left
                };
            },
            cTimer(){
                return this.timer
            },
            //zoom:0：只显示年。1：只显示年月。2：只显示年月周。3：只显示月周星期 4：只显示月日
            isYear(){
                let vm=this;
                let item=vm.zoomT;
                if(item==0){
                    vm.hYear=60
                }
                if(item==1){
                    vm.hYear=30
                }
                return item== 0|| item==1|| item==2 ? true : false;
            },
            isMonth(){
                let vm=this;
                let item=vm.zoomT;
                return item!= 0 ? true : false;
            },
            isWeek(){
                let vm=this;
                let item=vm.zoomT;
                return item== 2 ||item== 3 ? true : false;
            },
            isWatt(){
                let vm=this;
                let item=vm.zoomT;
                return item== 3? true : false;
            },
            isDay(){
                let vm=this;
                let item=vm.zoomT;
                return item== 4 ? true : false;
            },
        },
        watch:{
            cTimer(newVal,oldVal){
                let vm=this;
                if(vm.isReduce){
             //       vm.minScaleWidth(newVal);
                    return
                }
             //   vm.maxScaleWidth(newVal)
            },
            cardSize(newVal,oldVal){
                if(newVal!==oldVal){
                    this.caleWidth()
                }

            },
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
                        vm.switchChange(2);
                        return
                    }
                    if(newVal==3){
                        vm.switchChange(3);
                        return
                    }
                    if(newVal==5){
                        vm.switchChange(5);
                        return
                    }
                    if(newVal==7){
                        vm.switchChange(7);
                        return
                    }
                    if(newVal==10){
                        vm.switchChange(10);
                        return
                    }
                }
                console.log(vm.cardSize);
            },
            maxScaleWidth(newVal){
                let vm=this;
                if(vm.cardSize==70){
                    if(newVal==10){
                        vm.switchChange(7);
                        return
                    }
                    if(newVal==7){
                        vm.switchChange(5);
                        return
                    }
                    if(newVal==5){
                        vm.switchChange(3);
                        return
                    }
                    if(newVal==3){
                        vm.switchChange(2);
                        return
                    }
                    if(newVal==2){
                        vm.switchChange(0);
                        return
                    }
                }
                console.log(vm.cardSize);
            },
            switchChange(value){
                let vm=this;
                switch (value) {
                    case 0:
                        vm.month= vm.originMonth;
                        vm.day=vm.originDay;
                        vm.year=vm.originYear;
                        break;
                    case 2:
                        vm.month= vm.twoList;
                        vm.day=vm.twoDay;
                        vm.year=vm.twoYear;
                        break;
                    case 3:
                        vm.month= vm.threeList;
                        vm.day=vm.threeDay;
                        vm.year=vm.threeYear;
                        break;
                    case 5:
                        vm.month= vm.fiveList;
                        vm.day=vm.fiveDay;
                        vm.year=vm.fiveYear;
                        break;
                    case 7:
                        vm.month= vm.sevenList;
                        vm.day=vm.sevenDay;
                        vm.year=vm.sevenYear;
                        break;
                    case 10:
                        vm.month= vm.tenList;
                        vm.day=vm.tenDay;
                        vm.year=vm.tenYear;
                        break;

                }
            },
            //表头的日历
            caleTime(){
                let vm=this;
                let start_time= vm.formatTime(vm.time.start_time);
                let end_time= vm.formatTime(vm.time.end_time);
                // let start_time='2019-1-31';
                // let end_time='2019-4-28';
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
                vm.caleYear(year1,year2);//计算年
                vm.caleMonth(month1,month2);//计算月
                vm.caleDay(day1,day2);//计算天
                vm.caleWeek(year1,d1);//计算有多少周
                vm.caleChange();
                vm.caleWidth();
                vm.judgeXun();
            },
            //计算宽度
            caleWidth(){
                let vm=this;
                $("#time").width(vm.day.length*vm.cardSize);
            },
            caleYear(year1,year2){
                let vm=this;
                let len=year2-year1+1;
                let obj={};
                for(let i=0;i<len;i++){
                    if(year1<=year2){
                        obj={
                            year:year1,
                            length:0
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
                    if(vm.year.length!=1){
                        if(i==0){
                            for (let j=month1-1;j<12;j++) {
                                obj={
                                    year:vm.year[i].year,
                                    month:j+1,
                                    width:0
                                };
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
                    }else{
                        for (let j = month1-1; j < month2; j++) {
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
                vm.setWeek();//计算星期
                vm.year=vm.changeYear(vm.day);//确定年的长度
                vm.originMonth=JSON.parse(JSON.stringify(vm.month));
                vm.originDay=JSON.parse(JSON.stringify(vm.day));
                vm.originYear=JSON.parse(JSON.stringify(vm.year));
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
                    if(item.year%4==0&&
                        item.year%100!=0){
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
            setWeek(){
                let vm=this;
                var weekDay = ["天", "一", "二", "三", "四", "五", "六"];
                let day=JSON.parse(JSON.stringify(vm.day));
                for(let i=0;i<day.length;i++){
                    let item=day[i].year+'/'+day[i].month+'/'+day[i].day;
                    var myDate = new Date(Date.parse(item));
                    day[i].week=weekDay[myDate.getDay()]
                }
                vm.day=day
            },
            //如果是一位则补零
            PrefixInteger(num, n) {
                return (Array(n).join(0) + num).slice(-n);
            },
            //计算是第几周
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
            },
            caleChange(){
                let vm=this;
                let arr1=vm.changeDay(2);
                let arr2=vm.changeDay(3);
                let arr3=vm.changeDay(5);
                let arr4=vm.changeDay(7);
                let arr5=vm.judgeXun();
                vm.twoDay=arr1;
                vm.threeDay=arr2;
                vm.fiveDay=arr3;
                vm.sevenDay=arr4;
                vm.tenDay=arr5;
                vm.twoList=vm.ChangeMonth(arr1);
                vm.threeList=vm.ChangeMonth(arr2);
                vm.fiveList=vm.ChangeMonth(arr3);
                vm.sevenList=vm.ChangeMonth(arr4);
                vm.tenList=vm.ChangeMonth(arr5);

                vm.twoYear=vm.changeYear(arr1);
                vm.threeYear=vm.changeYear(arr2);
                vm.fiveYear=vm.changeYear(arr3);
                vm.sevenYear=vm.changeYear(arr4);
                vm.tenYear=vm.changeYear(arr5);
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
                            if(i==0){
                                let w=originDay[i].week;
                                originDay[i].length=vm.judgeWeekLength(w)
                            }else{
                                originDay[i].length=7
                            }
                            week=week+1;
                            originDay[i].day='第'+(week)+'周';
                            newDay.push(originDay[i]);
                        }else{
                            newDay.push(originDay[i]);
                        }
                    }
                }
                originDay=newDay;
                return originDay
            },
            judgeWeekLength(value){
                let len=0;
                switch (value) {
                    case '一':
                        len=7;break;
                    case '二':
                        len=6;break;
                    case '三':
                        len=5;break;
                    case '四':
                        len=4;break;
                    case '五':
                        len=3;break;
                    case '六':
                        len=2;break;
                    case '日':
                        len=1;break;

                }
                return len

            },
            //判断上旬、中旬、下旬
            judgeXun(item){
                let vm=this;
                let month=JSON.parse(JSON.stringify(vm.month));
                let obj={};
                let arr=[];
                for(let i=0;i<month.length;i++){
                    if(i==0){
                        month[i].day=vm.reTurnXun(month[i].day[0]);
                        for(let j=0;j<month[i].day.length;j++){
                            obj={
                                year:month[i].year,
                                month:month[i].month,
                                day:month[i].day[j]
                            };
                            arr.push(obj)
                        }
                    }else{
                        month[i].day=vm.reTurnXun(0);
                        for(let j=0;j<month[i].day.length;j++){
                            obj={
                                year:month[i].year,
                                month:month[i].month,
                                day:month[i].day[j]
                            };
                            arr.push(obj)
                        }
                    }
                }

                return arr
            },
            reTurnXun(day){
                let item=[];
                if(day<=10){
                    item=['上旬','中旬','下旬']
                }else if(day>=21){
                    item=['下旬']
                }else{
                    item=['中旬','下旬']
                }
                return item;
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
                            arr2[j].day=obj;
                            arr2[j].length= arr2[j].day.length
                        }
                    }

                }
                return arr2
            },
            //改变年的间隔
            changeYear(arr1){
                let vm=this;
                let arr2=JSON.parse(JSON.stringify(vm.year));
                for(let j=0;j<arr2.length;j++){
                    let obj=[];
                    for(let i=0;i<arr1.length;i++){
                        if(arr1[i].year==arr2[j].year
                        ){
                            obj.push(arr1[i].day);
                            arr2[j].day=obj;
                            arr2[j].length= arr2[j].day.length
                        }
                    }

                }
                return arr2
            },

            formatTime(time) {
                return common.formateTimestamp(time, "YYYY-MM-DD");
            },
        }
    }
</script>

<style scoped lang="less">
    .time-container-row{
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
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                position: relative;
            }
             .common-time-inner:after {
                content: "";
                width:1px;
                height:100%;
                background-color: #ebebeb;
                position: absolute;
                top: 0;
                z-index: 1;
                right: 0;
            }
            .common-time-inner:last-child{
               &::after{
                 display: none;
               }
            }
            &:last-child{
                border-bottom: none;
            }
        }

    }

</style>
<template>
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
                taskLists:[
                    {
                        id:1,
                        text:'任务一',
                        start_time:2,
                        end_time:17,
                        link:0,
                        link_type:'',//SS,SF,FS,FF
                        duration:15,
                    },
                    {
                        id:2,
                        text:'任务2',
                        start_time:16,
                        end_time:20,
                        link:0,
                        link_type:'',//SS,SF,FS,FF
                        duration:4,
                    },
                    {
                        id:3,
                        text:'任务3',
                        start_time:15,
                        end_time:20,
                        link:0,
                        link_type:'SS',//SS,SF,FS,FF
                        duration:5,
                    },
                    {
                        id:4,
                        text:'任务4',
                        start_time:16,
                        end_time:18,
                        link:0,
                        link_type:'SS',//SS,SF,FS,FF
                        duration:2,
                    },
                    {
                        id:5,
                        text:'任务5',
                        start_time:16,
                        end_time:26,
                        link:0,
                        link_type:'SS',//SS,SF,FS,FF
                        duration:10,
                    },
                    {
                        id:6,
                        text:'任务6',
                        start_time:15,
                        end_time:20,
                        link:2,
                        link_type:'SS',//SS,SF,FS,FF
                        duration:5,
                    },
                    {
                        id:7,
                        text:'任务7',
                        start_time:2,
                        end_time:30,
                        link:1,
                        link_type:'SS',//SS,SF,FS,FF
                        duration:15,
                    },
                    {
                        id:7,
                        text:'任务8',
                        start_time:2,
                        end_time:30,
                        link:0,
                        link_type:'SS',//SS,SF,FS,FF
                        duration:15,
                    }
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
                    console.log("滚轮向上啦")
                    if(vm.cardSize>=50){return}
                    this.cardSize=this.cardSize+vm.scale;
                    vm.initTime()
                }
            },10),
            //监听鼠标拖动事件
            mousedown($event){
                console.log($event)
                let vm=this;
                vm.initMove($event);
                window.addEventListener('mousemove', vm.mousemove);
                window.addEventListener('mouseup', vm.moveEnd);
            },
            initMove(e){
                let vm=this
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
              var zr = zrender.init(document.getElementById('main'));
              return zr
            },
            //初始化时间
            initTime(){
             let vm=this;
             let zr = this.initCanvas();
             let day=30;
             for(let j=0;j<day/7;j++){//确定周数
                    let text='第'+(j+1)+'周';
                    let width=vm.cardSize*7;
                    let height=vm.cardSize;
                    vm.initRect(zr,j*vm.cardSize*7,0,width,height,text)
             }
             for(let j=0;j<day;j++){//确定天数
                   let text=j+1;
                   let width=vm.cardSize;
                   let height=vm.cardSize;
                   vm.initRect(zr,j*vm.cardSize,vm.cardSize,width,height,text)
             }
             let task=vm.taskLists;
             for(let i=0;i<task.length;i++){
                    vm.setPosition(zr,i,task[i],vm.cardSize)//确定task的位置
                }
            },
            //每个任务的位置
            setPosition(zr,i,item,cardSize){
                let vm=this;
                let x1=item.start_time*cardSize-cardSize;
                let y=2*cardSize+30+(40*i)//距离顶部有30的距离
                let x2=item.end_time*cardSize;
                let r=10;
                if(item.link==0){
                    vm.noPretask(i,zr,cardSize,item,r,x1,x2,y);
                }else{
                    if(item.link_type=='SS'){
                        let dash=3;//虚线的密度
                        let info=vm.preTaskPosition(item.link);
                        let index=info.index
                        let preItem=info.item
                        let x1_pre=preItem.start_time*cardSize-cardSize;
                        let y1_pre=2*cardSize+30+(30*index);
                        let x2_pre=preItem.end_time*cardSize;
                        let y2_pre=preItem.end_time*cardSize;
                        let text=preItem.text;
                        //虚线
                        vm.initLineDash(zr,x1_pre,y1_pre,x1,y,x2,y)
                        //实线
                        text=item.text;
                        let color="red";
                        vm.initLine(zr,r,x1,x2,y,text,color);
                        //箭头
                        vm.initArraw(zr,r,x2,y,color);
                        //结束的圆圈
                        let text_end=vm.taskLists.length+i+1;
                        vm.initCircle(zr,cardSize,r,i,x2,y,text_end,color);
                    }

                }

            },
            havePretask(i,zr,cardSize,item,r,x1,x2,y){


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
                let vm=this
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
            initLine(zr,r,x1,x2,y,text,color="black"){
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
                zr.add(Line);

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
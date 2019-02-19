<template>
    <div class="zrender">
        <div>用zrender网络图</div>
        <div class="main" id="main"  style="width:1500px;height:500px;"></div>
    </div>
</template>

<script>
    import zrender from 'zrender';
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
                        link:1,
                        link_type:'SS',//SS,SF,FS,FF
                        duration:2,
                    },
                    {
                        id:5,
                        text:'任务5',
                        start_time:16,
                        end_time:26,
                        link:2,
                        link_type:'SS',//SS,SF,FS,FF
                        duration:10,
                    },
                    {
                        id:6,
                        text:'任务6',
                        start_time:15,
                        end_time:20,
                        link:5,
                        link_type:'FF',//SS,SF,FS,FF
                        duration:5,
                    },
                    {
                        id:7,
                        text:'任务7',
                        start_time:15,
                        end_time:30,
                        link:0,
                        link_type:'FF',//SS,SF,FS,FF
                        duration:15,
                    }
                ],
                scale:1

            }
        },
        mounted(){
              this.initTime(),
              window.addEventListener('mousewheel',this.handleScroll,false)
        },
        methods:{
            handleScroll (e) {
                let direction = e.deltaY>0?'down':'up' //该语句可以用来判断滚轮是向上滑动还是向下
                if(direction=='down'){
                    this.scale=this.scale*2
                    console.log("滚轮向下啦")
                }else{
                    console.log("滚轮向上啦")
                }
                // if(document.getElementsByTagName("li").length == 1){   //此处决定无论一次滚轮滚动的距离是多少，此事件
                //     //都得等上次滚动结束，才会执行本次
                //     this.isShow = false
                //     setTimeout(() => {
                //         this.isShow = true
                //         ++ this.nowIndex
                //         if(this.nowIndex == 3){
                //             this.nowIndex = 0
                //         }
                //     }, 10)
                // }
            },
            initCanvas(){
              var zr = zrender.init(document.getElementById('main'));
              return zr
            },
            initTime(){
             let vm=this;
             let zr = this.initCanvas();
             var cardSize =50;//宽高是50
             let day=30;
             for(let j=0;j<day/7;j++){//确定天数
                    let text='第'+(j+1)+'周';
                    let width=cardSize*7;
                    let height=cardSize;
                    vm.initRect(zr,j*cardSize*7,0,width,height,text)
             }
             for(let j=0;j<day;j++){//确定天数
                   let text=j+1;
                   let width=cardSize;
                   let height=cardSize;
                   vm.initRect(zr,j*cardSize,30,width,height,text)
             }
             let task=vm.taskLists;
             for(let i=0;i<task.length;i++){
                    vm.setPosition(zr,i,task[i],cardSize)//确定task的位置
                }
            },
            //每个任务的位置
            setPosition(zr,i,item,cardSize){
                let vm=this;
                let x1=item.start_time*cardSize-cardSize;
                let y=2*cardSize+30+(40*i)//距离顶部有30的距离
                let x2=item.end_time*cardSize;
                let r=10;
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
            //画实线
            initLine(zr,r,x1,x2,y,text){
                var Line = new zrender.Line({
                    z:0,//z值大的会把z值小的覆盖
                    scale:this.scale,
                    shape: {
                        x1: x1,
                        y1: y,
                        x2: x2,
                        y2: y,
                    },
                    style: {
                        fill:"black",
                        stroke:'black',
                        text:text,
                        textPosition:'top',
                    },
                });
                zr.add(Line);

            },
            //画圆形
            initCircle(zr,cardSize,r,i,x,y,text){
                var circle = new zrender.Circle({
                    z:1,
                    scale:this.scale,
                    shape: {
                        cx: x,
                        cy: y,
                        r: r
                    },
                    style: {
                        fill: '#ffffff',
                        stroke: 'black',
                        text:text
                    }
                });
                zr.add(circle);
            },
            //画箭头
            initArraw(zr,r,x,y){
                // let isogon=new zrender.Isogon({
                //     shape:{
                //         x:x-r*2,
                //         y:y,
                //         r:r,
                //         n:3
                //     },
                //     style:{
                //         fill:"red",
                //         stroke:"red",
                //     },
                //     // rotation:0.5
                // });
                // zr.add(isogon);
                var polygon = new zrender.Polygon({
                    z:1,
                    shape: {
                        points:[[x-r*2,y-r],[x-r*2,y+r],[x-r,y]]
                    },
                    style: {
                        fill: 'black',
                        stroke: 'black',
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



        }
    }
</script>

<style scoped lang="less">
    .zrender{
        .main{
            border: 1px solid #000000;
        }
    }

</style>
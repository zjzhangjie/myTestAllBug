<template>
    <div>
        <div>
           <div>网络图开始</div>
            <canvas id="myCanvas" width="1500" height="1000" style="border:1px solid #000000;"></canvas>
        </div>
    </div>
</template>

<script>
    export default {
        name: "networkPlanning",
        data(){
            return{
                taskLists:[
                    {
                        id:1,
                        text:'任务一',
                        start_time:15,
                        end_time:17,
                        link:0,
                        link_type:'',//SS,SF,FS,FF
                        duration:2,
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
                        duration:5,
                    }
                ]
            }
        },
        mounted(){
            this.initCanvas()
        },
        methods:{
            initCanvas(){
                var canvas=document.getElementById('myCanvas');
                var ctx=canvas.getContext('2d');
                let year=[2019,2010];
                let month=[];
                let day=30;
                var cardSize =50;//宽高是50
                //绘制背景表格
                for (var i = 0; i< 2; i++) {
                    for (var j = 0; j < day; j++) {
                        if(i==0){
                            for(let a=0;a<2;a++){
                                ctx.strokeRect(a* cardSize,i * cardSize, cardSize, cardSize);
                            }
                        }
                        if (i==1){
                            ctx.strokeRect(j * cardSize , i * cardSize, cardSize , cardSize);
                        }

                    }
                }
                for (var i = 0; i < 2; i++) {//开始绘制日期数
                    for (var j = 0; j < day; j++) {
                        if(i == 1){//确定月份填的位置
                            ctx.textAlign = "center";
                            ctx.font = (cardSize / 2) + 'px Arial';
                            ctx.fillText(j+1, j * cardSize + cardSize / 2 , i * cardSize + cardSize / 3 * 2 );
                        }

                    }
                }
             let vm=this;
             let task=vm.taskLists;
             for(let i=0;i<task.length;i++){
                    vm.setPosition(i,task[i])//确定task的位置
             }
            },
            setPosition(i,item){
                let vm=this;
                let canvas=document.getElementById('myCanvas');
                let ctx=canvas.getContext('2d');
                let cardSize =50;//宽高是50
                let x_start=item.start_time*cardSize-cardSize;
                let x_end=item.end_time*cardSize;
                let y=2*cardSize+30+(40*i);//距离顶有30的高度
                let r=10;
                let color="black";
                if(item.link==0){//不存在前置任务
                    //开始的圆圈
                    vm.drawCircle(cardSize,r,i,x_start);
                    //结束的圆圈
                    vm.drawCircle(cardSize,r,i,x_end);
                    //中间的线
                    vm.drawLines(cardSize,r,i,x_start,x_end,y,item,color);
                    //箭头
                    vm.drawRightArraw(r,x_end,y,color)
                }else{//存在前置任务
                    let preTask=vm.preTaskPosition(item.link)
                    let x_pre=preTask.item.start_time*cardSize-cardSize;
                    let y_pre=2*cardSize+30+(30*preTask.index);
                    let x_pre_end=preTask.item.end_time*cardSize;
                    let y_pre_end=2*cardSize+30+(30*preTask.index);
                    if(item.link_type=='SS'){
                        //虚线开始
                        vm.drawDashed(r,x_pre,y_pre,x_start,y);
                        let color="black";
                        vm.drawLines(cardSize,r,i,x_start-r,x_end,y,item,color);//画实线
                        vm.drawRightArraw(r,x_end,y,color);//画箭头
                        vm.drawCircle(cardSize,r,i,x_end);//画圆
                    }
                    if(item.link_type=='FF'){
                        vm.drawCircle(cardSize,r,i,x_start);
                        //中间的线
                        let color="black";
                        vm.drawLines(cardSize,r,i,x_start,x_end,y,item,color);
                        vm.drawRightArraw(r,x_end,y,color);//画箭头
                        //虚线开始
                        vm.drawDashed(r,x_end,y,x_pre_end,y_pre_end);
                    }
                }

            },
            //虚线的样式
            drawDashed(r,x_pre,y_pre,x_start,y){
                let canvas=document.getElementById('myCanvas');
                let ctx=canvas.getContext('2d');
                ctx.setLineDash([5,5]);
                ctx.beginPath();
                ctx.lineJoin="round";//创建圆角
                ctx.moveTo(x_pre, y_pre+r);//起点
                ctx.lineTo(x_pre, y);
                ctx.lineTo(x_start, y);
                ctx.strokeStyle="red";
                ctx.stroke();
            },
            //开始结束的圆圈
            drawCircle(cardSize,r,i,x){
                let canvas=document.getElementById('myCanvas');
                let ctx=canvas.getContext('2d');
                let y=2*cardSize+30+(40*i);//距离顶有30的高度
                ctx.beginPath();
                ctx.strokeStyle="black";
                ctx.setLineDash([0,0]);
                ctx.arc(x,y,r,0,2*Math.PI);
                ctx.fillStyle="#ffffff";
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle="black";//圆圈里的编号
                ctx.textAlign= "center";
                ctx.font="15px Georgia";
                ctx.fillText(i+1,x,y+r/2);
            },
            //中间的实线和箭头
            drawLines(cardSize,r,i,x_start,x_end,y,item,color){
                let canvas=document.getElementById('myCanvas');
                let ctx=canvas.getContext('2d');
                //中间的线
                ctx.setLineDash([0,0]);
                ctx.beginPath();
                ctx.strokeStyle="black";
                ctx.moveTo(x_start+r,y);//这里的r指的是圆圈的半径
                ctx.lineTo(x_end-r,y);
                ctx.stroke();
                ctx.fillStyle="black";//线上方的文字
                ctx.textAlign = "left";
                ctx.font="16px Georgia";
                ctx.fillText(item.text,x_start+r,y-r/2);
                ctx.fillStyle="blue";//线上方的文字
                ctx.fillText(item.duration,x_start+r,y+r+2);//天数
                // //画箭头
                // ctx.fillStyle=color;
                // ctx.lineTo(x_end-r*2,y-r);
                // ctx.lineTo(x_end-r*2,y+r);
                // ctx.lineTo(x_end-r*2+r,y);
                // ctx.lineTo(x_end-r*2,y);
                // ctx.fill(); //箭头是个封闭图形
                // ctx.restore();   //恢复到堆的上一个状态，其实这里没什么用。
                // ctx.closePath();
            },
            drawRightArraw(r,x_end,y,color){
                let canvas=document.getElementById('myCanvas');
                let ctx=canvas.getContext('2d');
                ctx.fillStyle=color;
                ctx.lineTo(x_end-r*2,y-r);
                ctx.lineTo(x_end-r*2,y+r);
                ctx.lineTo(x_end-r*2+r,y);
                ctx.lineTo(x_end-r*2,y);
                ctx.fill(); //箭头是个封闭图形
                ctx.restore();   //恢复到堆的上一个状态，其实这里没什么用。
                ctx.closePath();
            },
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


            }
        }
    }
</script>

<style scoped>

</style>
<template>
  <div class="about">
    <input ref="input"  v-model="keyWords"   type="search" placeholder="搜索">
    <!--<input ref="input"  v-model="keyWords"   @compositionstart="startInput"  @compositionend="endInput" type="search" placeholder="搜索">-->
  </div>
</template>
<script>
    export default {
        name: "projectTask",
        data(){
            return{
                keyWords:'',
                cpLock:false,
            }
        },
        watch:{
            keyWords: function (newval, oldval) {
                if(newval!==oldval){
                    clearTimeout(this.timer);
                    this.timer = setTimeout(function() {
                        console.log("新输入的值---"+newval);
                        console.log("旧的值-------"+oldval);
                    }, 500);
                }
            },
        },
        methods:{
            //开始输入的时候,,针对中文，输入英文得时候就失效啦，，，，
            startInput(){
                console.log("开始输入的时候")
                this.cpLock = false;
            },
            //结束输入的时候
            endInput($event){
                console.log("结束输入的时候")
                this.cpLock = true;
            }
        }
    }

</script>

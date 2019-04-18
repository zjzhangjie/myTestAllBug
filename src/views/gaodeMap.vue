<template>
    <div class="map-container">
        <!--<div id="container" class="container"></div>-->
        <vue-draggable-resizable  :draggable="true" :z-index="1" :grid=[20,20] :parent="true"   class-name="first-move">
            <div>
                父亲
            </div>
        </vue-draggable-resizable>
        <vue-draggable-resizable  :z-index="2"  :maxHeight="30" :maxWidth="30"  @activated="onActivated" :grid=[20,20]  class-name="tow-move">
            <p>child</p>
        </vue-draggable-resizable>
    </div>

</template>

<script>
    import VueDraggableResizable from 'vue-draggable-resizable'
    import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
    import Vue from 'vue'
    Vue.component('vue-draggable-resizable', VueDraggableResizable);
    export default {
        name: "gaodeMap",
        data(){
            return{
                draggable:true,
            }

        },
        mounted(){
           this.initMap()

        },
        methods:{
            onActivated(){
                this.draggable=false;
            },
            initMap(){
                var map = new AMap.Map('container',{
                    mapStyle: 'amap://styles/8a1b71d1478c027339ec10855cfabf85', //设置地图的显示样式
                });

            }
        }
    }
</script>

<style  lang="less">
    .map-container{
        position: relative;
        width: 100vw;
        height: 100vh;
        border: 1px solid red;
        background: linear-gradient(-90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px) 0% 0% / 20px 40px, linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px) 0% 0% / 20px 40px;
        .container{
            height: 1000px;
            width: 800px;

        }
        .first-move{
            background-color: red;
            .child{
                width: 100%;
                height: 100%;
                position: relative;
            }
        }
        .tow-move{
            background-color: fuchsia;
        }
        .parent{
            position: relative;
            width: 300px;
            height: 300px;
            border: 1px solid red;
            .box2{
                left: calc(100% - 100px) !important;
            }
        }

    }



</style>
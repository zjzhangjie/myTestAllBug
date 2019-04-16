<template>
    <div class="home">
        <div class="button">
            <button @click="changeZoom(7)">日</button>
            <button @click="changeZoom(6)">星期几</button>
            <button @click="changeZoom(5)">日为两个间隔</button>
            <button @click="changeZoom(4)">日为三个间隔</button>
            <button @click="changeZoom(3)">日为五个间隔</button>
            <button @click="changeZoom(2)">第几周</button>
            <button @click="changeZoom(1)">旬</button>
            <button @click="changeZoom(-1)">只显示年</button>
        </div>
        <calendar :zoom="calendarZoom"></calendar>
    </div>
</template>

<script>
    import calendar from '../components/pert/calendar'
    export default {
        name: 'home',
        data(){
            return{
                calendarZoom:7
            }

        },
        methods:{
            changeZoom(val){
                this.calendarZoom=val

            }
        },
        components: {
            calendar
        }
    }
</script>

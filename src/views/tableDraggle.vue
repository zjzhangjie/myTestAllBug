<!--被自己蠢爆了，，无话可说简直啦，，，，element的table只要加上border，就可以随便改变列宽度-->
<template>
    <el-table
            id="applyTable"
            :data="tableData"
            height="100%"
            border
            stripe
            @header-dragend="colChange">
        <el-table-column
                v-for="(item,index) in tableColumns"
                :key="index"
                :prop="item.name"
                :label="item.name">
        </el-table-column>
        <el-table-column
                label="操作"
                :resizable="false">
            <template slot-scope="scope">
                <button class="u-button">填写申请单</button>
                <button class="u-button">删除</button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    export default {
        name: "projectTask",
        data(){
            return{
                keyWords:'',
                cpLock:false,
                tableColumns:[{name:'zhangjie'},{name:'zuoqin'}],
                tableData: [{
                    zhangjie: '张洁',
                    zuoqin:'左琴'

                }],
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
            /**
             * 获取浏览器缓存的列宽
             */
            getTableColWidth () {
                var self = this
                var tableWidth = localStorage.getItem('applyTableColWidths')
                if (tableWidth) {
                    for (var item = 0; item < self.tableColumns.length; item++) {
                        self.tableColumns[item].width = JSON.parse(tableWidth)[item]
                    }
                }
            },
            /**
             * 拖动表头改变列宽
             */
            colChange (newWidth, oldWidth, column, event) {
                setTimeout(() => {
                    console.log(newWidth, oldWidth, column, event)
                    console.log('拖动表头改变列宽')
                    var applyTableColWidths = []
                    var applyTable = document.getElementById('applyTable')
                    var applyTableColgroup = applyTable.getElementsByTagName('colgroup')[0]
                    var applyTableCol = applyTableColgroup.getElementsByTagName('col')
                    for (var i = 0; i < applyTableCol.length; i++) {
                        applyTableColWidths.push(applyTableCol[i].width)
                    }
                    console.log(applyTableColWidths)
                //    localStorage.setItem('applyTableColWidths', JSON.stringify(applyTableColWidths))
                }, 100)
            } ,
            mounted() {
               // this.getTableColWidth()
            }

        }
    }

</script>

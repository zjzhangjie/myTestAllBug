<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/inputBug">inputBug</router-link>|
      <router-link to="/tableDraggle">tableDraggle</router-link>|
      <router-link to="/dhtmlGanttx">dhtmlGanttx</router-link>|
      <router-link to="/dhtmlGanttxRe">dhtmlGanttx-resource</router-link>|
      <router-link to="/calendar">calendar资源日历</router-link>|
      <router-link to="/mResources">按照多个资源分组</router-link>|
      <router-link to="/resourcesOver">资源负载图</router-link>|
      <router-link to="/networkPlanning">网络图</router-link>|
      <router-link to="/zrender">zrender</router-link>|
      <router-link to="/zuoqin">左琴宝宝的</router-link>|
      <router-link to="/initTime">表头的日历</router-link><br>
      <router-link to="/gaodeMap">高德地图</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

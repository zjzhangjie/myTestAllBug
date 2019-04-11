<template>
  <div class="home">
    <img src="../assets/logo.png">
    <imgViewer></imgViewer>
  </div>
</template>

<script>
    import imgViewer from '@zooj/img-viewer';
// @ is an alias to /src

export default {
  name: 'home',
  components: {
      imgViewer

  }
}
</script>

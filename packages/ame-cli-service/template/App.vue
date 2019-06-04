
<template>
  <div id="app">
    <div class="page-container">
      <Demo/>
    </div>
  </div>
</template>

<script>
import Demo from '~entry'

export default {
  name: 'App',
  components: {
    Demo
  }
}
</script>

<style lang="scss">
html,
body {
  height: 100%;
}
body {
  background: #f5f5f7;
}
#app {
  width: 100%;
  height: calc(100% - 20px);
  overflow: hidden;
  overflow-y: auto;
}
.page-container {
  width: 375px;
  height: 812px;
  margin: 0 auto;
  background: #fff;
  box-shadow: 0 3px 16px 0 rgba(0, 0, 0, 0.04);
}
</style>

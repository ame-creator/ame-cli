<template>
  <div class="xm-component-demo">
    <div class="title">
      {{ title }}
    </div>
    <xm-button type="primary">
      xm-vue-ui示例
    </xm-button>
  </div>
</template>

<script>
import Button from 'xm-vue-ui/lib/button'

export default {
  name: 'XmComponentDemo',

  components: {
    XmButton: Button
  },

  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss">
@import "node_modules/xm-vue-ui/lib/button/style/index.scss";
</style>

<style lang="scss" scoped>
.xm-component-demo {
  height: 100%;
  text-align: center;

  .title {
    font-size: 20px;
    margin: 10px 0;
  }
}
</style>

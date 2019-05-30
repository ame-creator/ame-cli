<template>
  <div class="am-<%= componentNameLowercase %>">
    <div class="title">
      {{ title }}
    </div>
    <v-btn color="primary">
      vuetify示例
    </v-btn>
  </div>
</template>

<script>
import { VBtn } from 'vuetify/lib'

export default {
  name: '<%= componentName %>',

  components: {
    VBtn
  },

  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="stylus">
.am-hehe
  height: 100%
  text-align: center

  .title
    font-size: 20px
    margin: 10px 0
</style>

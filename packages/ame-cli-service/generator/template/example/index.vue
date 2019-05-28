<template>
  <<%= componentName %> v-bind="options" />
</template>

<script>
import <%= componentName %> from '../src'

export default {
  components: {
    <%= componentName %>
  },

  data () {
    return {
      options: {
        title: 'Demo'
      }
    }
  }
}
</script>

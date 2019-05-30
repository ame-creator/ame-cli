<template>
  <v-app>
    <<%= componentName %> v-bind="options" />
  </v-app>
</template>

<script>
import Vue from 'vue'
import Vuetify, { VApp } from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'

import <%= componentName %> from '../src'

Vue.use(Vuetify)

export default {
  components: {
    VApp,
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

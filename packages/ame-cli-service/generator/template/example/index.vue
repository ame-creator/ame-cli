<template>
  <v-app>
    <<%= componentName %> v-bind="options" />
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Vuetify, { VApp } from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'

import <%= componentName %> from '../src'

Vue.use(Vuetify)

@Component({
  components: {
    VApp,
    <%= componentName %>
  }
})
export default class Example extends Vue {
  options = { title: 'Demo' }
}
</script>

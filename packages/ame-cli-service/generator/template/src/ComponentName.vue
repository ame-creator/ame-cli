<template>
  <div class="ac-<%= componentNameLowercase %>">
    <div class="title">
      {{ title }}
    </div>
    <v-btn color="primary">
      vuetify示例
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { VBtn } from 'vuetify/lib'

@Component({
  components: {
    VBtn
  }
})
export default class <%= componentName %> extends Vue {
  @Prop() readonly title!: string
}
</script>

<style lang="scss">
.ac-<%= componentNameLowercase %> {
  height: 100%;
  text-align: center;

  .title {
    font-size: 20px;
    margin: 10px 0;
  }
}
</style>

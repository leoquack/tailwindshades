<template>
  <div
    id="root"
    class="h-screen"
    :class="'theme-' + config.theme"
  >
    <base-component class="flex flex-col h-full" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BaseComponent from './components/Base.vue'

export default {
  name: 'app',
  components: {
    BaseComponent,
  },
  computed: {
    ...mapGetters({
      config: 'config/config',
    }),
  },
}
</script>


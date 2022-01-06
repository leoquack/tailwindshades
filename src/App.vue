<template>
  <div
    id="root"
    class="h-full"
    :class="'theme-' + theme"
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
      theme: 'theme',
    }),
  },
}
</script>


<template>
  <div id="root" :class="'theme-' + config.theme">
    <home-page />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import HomePage from './components/Homepage.vue'

export default {
  name: 'app',
  components: {
    HomePage
  },
  computed: {
    ...mapGetters({
      config: 'config/config',
    })
  },
}
</script>


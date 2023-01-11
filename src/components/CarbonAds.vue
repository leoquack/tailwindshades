<template>
  <div class="carbon-ads"></div>
</template>

<script>
export default {
  watch: {
    $route(to, from) {
      if (to.path !== from.path && this.$el.querySelector('#carbonads')) {
        this.$el.innerHTML = ''
        this.load()
      }
    },
  },
  mounted() {
    this.load()
  },
  methods: {
    load() {
      const s = document.createElement('script')
      s.id = '_carbonads_js'
      s.src =
        '//cdn.carbonads.com/carbon.js?serve=CESDVK3W&placement=wwwtailwindshadescom'
      this.$el.appendChild(s)
    },
  },
}
</script>

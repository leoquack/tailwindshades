<template>
  <div>
    shades: {{ shades }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      shades: [],
    }
  },
  methods: {
    async getShades() {
      const { data, error } = await this.$supabase.from('shades').select()
      if (error) {
        this.$notify({
          text: "Couldn't get shades",
          type: 'error',
          duration: 4000,
        })
      }
      console.log('data', data)
      this.shades = data
    },
  },
}
</script>

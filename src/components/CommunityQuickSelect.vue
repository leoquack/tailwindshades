<template>
  <div>
    Recent
    <div
      v-for="(shade, shadeIndex) in recentShades"
      :key="`recent-shade-${shadeIndex}`"
    >
      <p>id: {{shade.id }}</p>
      <p>user id : {{shade.user_id }}</p>
      <p>created_at : {{shade.created_at }}</p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      recentShades: [],
    }
  },
  computed: {
    ...mapGetters(['user']),
  },
  mounted() {
    if (!this.recentShades.length) {
      this.getRecentShades()
    }
  },
  methods: {
    ...mapActions(['fromCache']),
    async getRecentShades() {
      const cacheKey = 'shades.community.recent'
      const { data: cache, error } = await this.fromCache({
        key: cacheKey,
        expiry: new Date(+new Date() - 15 * 60000), // - 15 minutes
      })
      if (error) {
        this.loading = true
        const { data, error } = await this.$supabase
          .from('shades')
          .select()
          .eq('is_public', true)
          .order('id')
        this.loading = false
        if (error) {
          this.$notify({
            text: "Couldn't get shades",
            type: 'error',
            duration: 4000,
          })
          return
        }
        this.$store.commit('setCacheValue', { key: cacheKey, value: data })
        this.recentShades = data
        return
      }

      this.recentShades = cache
    },
  },
}
</script>

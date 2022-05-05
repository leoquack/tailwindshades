import { mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      myLikedShades: [],
      loading: false,
    }
  },
  computed: {
    ...mapGetters(['user', 'isLoggedIn']),
  },
  methods: {
    ...mapActions(['fromCache']),
    toggleLikeShade(shade) {
      if (!shade.id) {
        return
      }
      if (!this.isLoggedIn) {
        this.$notify({
          text: 'Please login to access this feature',
          type: 'error',
          duration: 4000,
        })
        return
      }

      if (this.myLikedShades && this.myLikedShades.find(l => l.shade_id === shade.id)) {
        this.unlikeShade(shade)
        return
      }
      this.likeShade(shade)
    },
    async likeShade(shade) {
      const row = {
        user_id: this.user.id,
        shade_id: shade.id,
        recorded_shade_code: shade.code,
        recorded_shade_colors: shade.colors,
      }
      const { error } = await this.$supabase.from('liked_shades').insert(row)
      if (error) {
        this.$notify({
          text: "Couldn't like shade",
          type: 'error',
          duration: 4000,
        })
        return
      }

      this.$notify({
        text: 'Shade saved in liked shades',
        type: 'info',
        duration: 2000,
      })
      this.myLikedShades.push(row)
      shade.likes++
    },
    async unlikeShade(shade) {
      const { error } = await this.$supabase
        .from('liked_shades')
        .delete()
        .match({
          user_id: this.user.id,
          shade_id: shade.id,
        })
      if (error) {
        this.$notify({
          text: "Couldn't unlike shade",
          type: 'error',
          duration: 4000,
        })
        return
      }

      this.$notify({
        text: 'Shade removed from liked shades',
        type: 'info',
        duration: 2000,
      })

      this.myLikedShades = this.myLikedShades.filter(l => l.shade_id !== shade.id)
      shade.likes--
    },
    async getMyLikedShades() {
      if (!this.isLoggedIn) {
        return
      }
      const cacheKey = 'shades.myLikedShades'
      const { data: cache, error } = await this.fromCache({
        key: cacheKey,
        expiry: new Date(+new Date() - 15 * 60000), // - 15 minutes
      })
      if (error) {
        this.loading = true
        const { data, error } = await this.$supabase
          .from('liked_shades')
          .select()
          .eq('user_id', this.user.id)
        this.loading = false
        if (error) {
          this.$notify({
            text: "Couldn't get my liked shades",
            type: 'error',
            duration: 4000,
          })
          return
        }
        this.$store.commit('setCacheValue', { key: cacheKey, value: data })
        this.myLikedShades = data
        return
      }

      this.myLikedShades = cache
    },
  },
}

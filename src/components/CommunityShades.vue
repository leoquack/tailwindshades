<template>
  <div class="flex flex-col">
    <div class="flex flex-wrap justify-center mb-auto text-theme mt-8">
      <div
        v-for="(shade, shadeIndex) in shades"
        :key="`shade-${shadeIndex}`"
        class="mb-8 mx-6 bor32der border-theme-600 rounded-lg overflow-hidden shadow-lg"
      >
        <div
          class="cursor-pointer hover:bg-theme-600 rounded-lg"
          @click="editCommunityShade(shade)"
        >
          <div class="flex justify-between items-center px-2 pt-1">
            <p class="font-bold text-lg">
              #{{ shade.id }}
              <span>{{ getColorName(shade.code) }}</span>
            </p>
            <p class="text-xs">{{ formatCreatedAt(shade.created_at) }}</p>
          </div>
          <div class="flex items-end">
            <div
              v-for="(color, colorIndex) in shade.colors"
              :key="`shade-${shadeIndex}-color-${colorIndex}`"
              class="w-12 h-12"
              :style="'background-color: ' + color"
            >
              <div
                class="-mt-2 flex justify-center"
                v-if="colorIndex === 5"
              ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-2 w-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-between px-2 text-xs py-1">
          <popper>
            <div class="popper">
              <span v-if="myLikedShades && myLikedShades.find(l => l.shade_id === shade.id)">
                Unlike shade
              </span>
              <span v-else>
                Like shade
              </span>
            </div>

            <div
              slot="reference"
              class="bottom"
            >

              <div
                @click.stop="toggleLikeShade(shade)"
                class="flex items-center hover:text-purple-500 cursor-pointer"
              >
                <svg
                  v-if="myLikedShades && myLikedShades.find(l => l.shade_id === shade.id)"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-purple-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clip-rule="evenodd"
                  />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>

                <span class="ml-1 text-xs">
                  {{ `${shade.likes} ${(shade.likes > 1 ? 'Likes' : 'Like')}` }}
                </span>
              </div>
            </div>
          </popper>
        </div>
      </div>
    </div>

    <Pagination
      :page="pagination.page"
      :max-per-page="pagination.maxPerPage"
      :total="pagination.total"
      @change="paginationChange"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import * as timeago from 'timeago.js'
import Pagination from '@/components/Pagination'
import Popper from 'vue-popperjs'
import 'vue-popperjs/dist/vue-popper.css'

export default {
  components: {
    Pagination,
    popper: Popper,
  },
  data() {
    return {
      shades: [],
      myLikedShades: [],
      pagination: {
        page: 1,
        maxPerPage: 5,
        total: 0,
      },
    }
  },
  computed: {
    ...mapGetters(['user', 'isLoggedIn']),
  },
  mounted() {
    if (!this.shades.length) {
      this.getShades()
    }
    if (!this.myLikedShades.length) {
      this.getMyLikedShades()
    }
  },
  methods: {
    ...mapActions(['fromCache']),
    editCommunityShade(shade) {
      this.$router
        .push({
          name: 'shade',
        })
        .then(() => {
          window.location.hash = shade.code
        })
    },
    formatCreatedAt(date) {
      return timeago.format(date)
    },
    getColorName(code) {
      const params = new URLSearchParams(code)
      return params.get('name')
    },
    toggleLikeShade(shade) {
      if (!this.isLoggedIn) {
        this.$notify({
          text: 'Please login to access this feature',
          type: 'error',
          duration: 4000,
        })
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
    paginationChange(event) {
      if (Math.ceil(this.pagination.total / this.pagination.maxPerPage) < event || event < 1) {
        return
      }

      this.pagination.page = event
      this.getShades()
    },
    refreshShades() {
      clearTimeout(this.delay.refreshShades.n)
      this.delay.refreshShades.n = setTimeout(() => {
        this.$store.commit('setCacheValue', { key: 'shades.community.shades', value: null })
        this.getShades()
      }, this.delay.refreshShades.t)
    },
    async getShades() {
      const cacheKey = 'shades.community.shades'
      const { data: cache, error } = await this.fromCache({
        key: cacheKey,
        expiry: new Date(+new Date() - 15 * 60000), // - 15 minutes
      })
      if (error) {
        this.loading = true
        const { data, error, count } = await this.$supabase
          .from('shades')
          .select('*', { count: 'exact' })
          .eq('is_public', true)
          .range(this.pagination.page - 1 * this.pagination.maxPerPage, this.pagination.maxPerPage)
          .order('id', { ascending: false })
        this.loading = false
        if (error) {
          this.$notify({
            text: "Couldn't get most liked shades",
            type: 'error',
            duration: 4000,
          })
          return
        }
        this.$store.commit('setCacheValue', { key: cacheKey, value: { data, count } })
        this.shades = data
        this.pagination.total = count
        return
      }

      this.shades = cache.data
      this.pagination.total = cache.count
    },
  },
}
</script>

<template>
  <div class="flex flex-col">
    <div class="md:max-w-[300px] md:self-end">
      <div class="text-xl font-bold flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-2 w-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>

        <span class="mx-1">
          Community shades
        </span>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-2 w-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </div>

      <div class="flex items-center justify-between px-2 border-b border-theme-reverse mx-2 py-1 mt-3 mb-1">
        <p class="text-sm font-bold">
          Most liked
        </p>

        <div
          @click="refreshMostLikedShades"
          class="ml-2 hover:text-purple-500 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </div>
      </div>
      <div
        v-for="(shade, shadeIndex) in mostLikedShades"
        :key="`most-liked-shade-${shadeIndex}`"
        @click="editCommunityShade(shade)"
        class="pt-2 pb-[2px] mb-1 cursor-pointer px-2 rounded hover:bg-theme-600"
      >
        <div class="flex items-end">
          <div
            v-for="(color, colorIndex) in shade.colors"
            :key="`shade-${shadeIndex}-color-${colorIndex}`"
            class="w-8 h-8"
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

        <div class="flex items-center justify-between">
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
                class="flex items-center hover:text-purple-500"
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
          <div class="text-xs">
            {{ formatCreatedAt(shade.created_at) }}
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between px-2 border-b border-theme-reverse mx-2 py-1 mt-8 mb-1">
        <p class="text-sm font-bold">
          Recent
        </p>

        <div
          @click="refreshRecentShades"
          class="ml-2 hover:text-purple-500 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </div>
      </div>
      <div
        v-for="(shade, shadeIndex) in recentShades"
        :key="`recent-shade-${shadeIndex}`"
        @click="editCommunityShade(shade)"
        class="pt-2 pb-[2px] mb-1 cursor-pointer px-2 rounded hover:bg-theme-600"
      >
        <div class="flex items-end">
          <div
            v-for="(color, colorIndex) in shade.colors"
            :key="`shade-${shadeIndex}-color-${colorIndex}`"
            class="w-8 h-8"
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

        <div class="flex items-center justify-between">
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
                class="flex items-center hover:text-purple-500"
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
          <div class="text-xs">
            {{ formatCreatedAt(shade.created_at) }}
          </div>
        </div>
      </div>

      <router-link to="/community/shades">See all</router-link>

    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import * as timeago from 'timeago.js'
import Popper from 'vue-popperjs'
import 'vue-popperjs/dist/vue-popper.css'

export default {
  components: {
    popper: Popper,
  },
  data() {
    return {
      recentShades: [],
      mostLikedShades: [],
      myLikedShades: [],
      delay: {
        refreshShades: {
          n: null,
          t: 250,
        },
      },
      loading: false,
    }
  },
  computed: {
    ...mapGetters(['user', 'isLoggedIn']),
  },
  mounted() {
    if (!this.recentShades.length) {
      this.getRecentShades()
    }
    if (!this.mostLikedShades.length) {
      this.getMostLikedShades()
    }
    if (!this.myLikedShades.length) {
      this.getMyLikedShades()
    }
  },
  methods: {
    ...mapActions(['fromCache']),
    formatCreatedAt(date) {
      return timeago.format(date)
    },
    editCommunityShade(shade) {
      window.location.hash = shade.code
    },
    toggleLikeShade(shade) {
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
    refreshRecentShades() {
      clearTimeout(this.delay.refreshShades.n)
      this.delay.refreshShades.n = setTimeout(() => {
        this.$store.commit('setCacheValue', { key: 'shades.community.recent', value: null })
        this.getRecentShades()
      }, this.delay.refreshShades.t)
    },
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
          .limit(4)
          .order('id', { ascending: false })
        this.loading = false
        if (error) {
          this.$notify({
            text: "Couldn't get recent shades",
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
    refreshMostLikedShades() {
      clearTimeout(this.delay.refreshShades.n)
      this.delay.refreshShades.n = setTimeout(() => {
        this.$store.commit('setCacheValue', { key: 'shades.community.mostLiked', value: null })
        this.getMostLikedShades()
      }, this.delay.refreshShades.t)
    },
    async getMostLikedShades() {
      const cacheKey = 'shades.community.mostLiked'
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
          .gt('likes', 0)
          .limit(4)
          .order('likes', { ascending: false })
        this.loading = false
        if (error) {
          this.$notify({
            text: "Couldn't get most liked shades",
            type: 'error',
            duration: 4000,
          })
          return
        }
        this.$store.commit('setCacheValue', { key: cacheKey, value: data })
        this.mostLikedShades = data
        return
      }

      this.mostLikedShades = cache
    },
  },
}
</script>

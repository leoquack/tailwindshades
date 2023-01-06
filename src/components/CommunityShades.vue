<template>
  <div class="flex flex-col">
    <div class="flex flex-wrap justify-center mb-auto text-theme mt-8">
      <div
        v-for="(shade, shadeIndex) in shades"
        :key="`shade-${shadeIndex}`"
        class="mb-8 mx-6 bor32der border-theme-600 rounded-lg overflow-hidden shadow-lg cursor-pointer"
        @click="editCommunityShade(shade)"
      >
        <div class="hover:bg-theme-600 rounded-lg">
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
          <v-popover trigger="hover">
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
                {{ `${shade.likes} ${(shade.likes === 1 ? 'Like' : 'Likes')}` }}
              </span>
            </div>

            <slot name="popover">
              <span v-if="myLikedShades && myLikedShades.find(l => l.shade_id === shade.id)">
                Unlike shade
              </span>
              <span v-else>
                Like shade
              </span>
            </slot>
          </v-popover>
          <p class="text-xs">Created {{ formatCreatedAt(shade.created_at) }}</p>
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
import Pagination from '@/components/Pagination.vue'
import community from '@/composables/community.js'

export default {
  props: {
    mode: String,
  },
  components: {
    Pagination,
  },
  mixins: [community],
  data() {
    return {
      shades: [],
      pagination: {
        page: 1,
        maxPerPage: 18,
        total: 0,
      },
      delay: {
        shade: {
          n: null,
          t: 150,
        },
      },
    }
  },
  watch: {
    mode() {
      this.getShades()
    },
  },
  computed: {
    ...mapGetters(['user', 'isLoggedIn']),
  },
  mounted() {
    if (!this.myLikedShades.length) {
      this.getMyLikedShades()
    }

    const queryPage = this.$route.query.page
    if (queryPage) {
      this.pagination.page = parseInt(queryPage)
    }

    if (!this.shades.length) {
      this.getShades()
    }
  },
  methods: {
    ...mapActions(['fromCache']),
    editCommunityShade(shade) {
      this.$store.commit('setOriginShade', shade)
      this.$router.push({
        name: 'shade',
        hash: `#${shade.code}`,
      })
    },
    formatCreatedAt(date) {
      return timeago.format(date)
    },
    paginationChange(event) {
      if (this.loading) {
        return
      }
      if (Math.ceil(this.pagination.total / this.pagination.maxPerPage) < event || event < 1) {
        return
      }

      this.$router.push({ name: 'community-shades', query: { page: event } })
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
    getShades() {
      clearTimeout(this.delay.shade.n)
      this.delay.shade.n = setTimeout(() => {
        this._getShades()
      }, this.delay.shade.t)
    },
    async _getShades() {
      this.loading = true
      const from = (this.pagination.page - 1) * this.pagination.maxPerPage
      let to = (this.pagination.page - 1) * this.pagination.maxPerPage + this.pagination.maxPerPage - 1
      if (this.pagination.total !== 0 && to > this.pagination.total) {
        to = this.pagination.total
      }

      let query = {}
      if (this.mode === 'my-liked') {
        query = this.$supabase
          .from('liked_shades')
          .select('shades!inner(*)', { count: 'exact' })
          .eq('user_id', this.user.id)
          .eq('shades.is_public', true)
          .range(from, to)
          .order('id', { ascending: false })
      } else {
        query = this.$supabase
          .from('shades')
          .select('*', { count: 'exact' })
          .eq('is_public', true)
          .range(from, to)
          .order('id', { ascending: false })
      }

      const { data, error, count } = await query
      this.loading = false
      if (error) {
        this.$notify({
          text: "Couldn't get most liked shades",
          type: 'error',
          duration: 4000,
        })
        return
      }

      if (this.mode === 'my-liked') {
        this.shades = data.map(d => d.shades)
      } else {
        this.shades = data
      }

      this.pagination.total = count
    },
  },
}
</script>

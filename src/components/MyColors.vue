<template>
  <div class="text-theme">
    <div class="text-center font-bold text-2xl">
      <div
        class="py-8"
        v-if="loading"
      >Loading...</div>
      <div
        class="py-8"
        v-else-if="!this.shades.length"
      >
        <p>No saved colors</p>
        <router-link
          to="/"
          class="text-sm text-blue-600 hover:text-blue-700"
        >Go back to add one!</router-link>
      </div>
    </div>
    <div class="px-2 flex flex-col items-center w-full">
      <div class="flex py-4 -mx-2 w-full">

        <!-- <div class="mx-2">
          <p class="text-lg text-center font-bold">My collections</p>
        </div> -->

        <div class="mx-2 flex flex-wrap w-full">
          <!-- <p class="text-lg text-center font-bold">My shades</p> -->
          <div class="flex flex-wrap justify-center">
            <div
              v-for="(shade, shadeIndex) in shades"
              :key="`shade-${shadeIndex}`"
              class="mb-8 mx-6 bor32der border-theme-600 rounded-lg overflow-hidden shadow-lg"
            >
              <div
                class="cursor-pointer hover:bg-theme-600 rounded-lg"
                @click="editShade(shade)"
              >
                <div class="flex justify-between items-center px-2 pt-1">
                  <p class="font-bold text-lg">
                    #{{ shade.id }}
                    <span>{{ getColorName(shade.code) }}</span>
                  </p>
                  <p class="text-xs">{{ formatDate(shade.created_at) }}</p>
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
                <div
                  class="flex"
                  v-if="publishActive"
                >
                  <div
                    v-if="shade.is_public"
                    class="mr-4"
                  >
                    <i class="fas fa-heart"></i>
                    {{ `${shade.likes} ${(shade.likes === 1 ? 'Like' : 'Likes')}` }}
                  </div>
                  <div
                    v-if="shade.is_public"
                    class="cursor-pointer select-none"
                    @click="setIsPublic(shade, false)"
                  >
                    <i class="fas fa-globe mr-1"></i>
                    Make private
                  </div>
                  <div
                    v-else
                    class="cursor-pointer select-none"
                    @click="setIsPublic(shade, true)"
                  >
                    <i class="fas fa-globe mr-1"></i>
                    Make public
                  </div>
                </div>
                <div class="text-right">
                  <p
                    class="text-xs text-red-600"
                    v-if="confirmDeleteShade === shade.id"
                  >Click again to confirm</p>
                  <p
                    class="cursor-pointer select-none delete-handle"
                    @click="deleteShade(shade)"
                  >
                    <i class="fas fa-trash mr-1"></i>
                    Delete
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      shades: [],
      confirmDeleteShade: null,
      loading: false,
      publishActive: true,
    }
  },
  computed: {
    ...mapGetters(['user']),
  },
  mounted() {
    if (!this.shades.length) {
      this.getShades()
    }

    document.addEventListener('click', this.resetConfirm)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.resetConfirm)
  },
  methods: {
    ...mapActions(['fromCache']),
    formatDate(rawDate) {
      const date = new Date(rawDate)

      return (
        date
          .getDate()
          .toString()
          .padStart(2, '0') +
        '/' +
        (date.getMonth() + 1).toString().padStart(2, '0') +
        '/' +
        date.getFullYear() +
        ' ' +
        date.getHours() +
        ':' +
        date.getMinutes()
      )
    },
    getColorName(code) {
      const params = new URLSearchParams(code)
      return params.get('name')
    },
    async getShades() {
      const cacheKey = 'shades.mine'
      const { data: cache, error } = await this.fromCache({
        key: cacheKey,
        expiry: new Date(+new Date() - 15 * 60000), // - 15 minutes
      })
      if (error) {
        this.loading = true
        const { data, error } = await this.$supabase
          .from('shades')
          .select()
          .eq('user_id', this.user.id)
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
        this.shades = data
        return
      }

      this.shades = cache
    },
    editShade(shade) {
      this.$store.commit('setOriginShade', shade)
      this.$router.push({
        name: 'shade',
        params: { shade },
      })
    },
    async setIsPublic(shade, value) {
      const { error } = await this.$supabase
        .from('shades')
        .update({ is_public: value })
        .match({ id: shade.id })
      if (error) {
        this.$notify({
          text: "Couldn't change is_public",
          type: 'error',
          duration: 4000,
        })
        return
      }
      shade.is_public = value
      this.$store.commit('setCacheValue', { key: 'shades.mine', value: null })
    },
    async deleteShade(shade) {
      if (this.confirmDeleteShade !== shade.id) {
        this.confirmDeleteShade = shade.id
        return
      }
      const { error } = await this.$supabase
        .from('shades')
        .delete()
        .match({ id: shade.id })
      if (error) {
        this.$notify({
          text: "Couldn't delete shade",
          type: 'error',
          duration: 4000,
        })
        return
      }

      this.shades = Object.assign(
        [],
        this.shades.filter(s => s.id !== shade.id)
      )
      this.$notify({
        text: 'Shade deleted successfully',
        type: 'info',
        duration: 4000,
      })
      this.$store.commit('setCacheValue', { key: 'shades.mine', value: null })
    },
    resetConfirm(event) {
      if (event?.target.classList.contains('delete-handle')) {
        return false
      }
      this.confirmDeleteShade = null
    },
  },
}
</script>

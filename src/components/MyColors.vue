<template>
  <div class="text-theme">
    <div
      class="text-center font-bold text-2xl"
      v-if="loading"
    >Loading...</div>
    <div class="px-2 flex flex-col items-center w-full">
      <div class="flex py-4 -mx-2">

        <div class="mx-2">
          <!-- <p class="text-lg text-center font-bold">My collections</p> -->
        </div>

        <div class="mx-2">
          <!-- <p class="text-lg text-center font-bold">My shades</p> -->
          <div class="flex flex-col items-center">
            <div
              v-for="(shade, shadeIndex) in shades"
              :key="`shade-${shadeIndex}`"
              class="mb-4 border border-theme-600 rounded-lg"
            >
              <div
                class="cursor-pointer bg-theme-500 hover:bg-theme-700 rounded-lg"
                @click="editShade(shade)"
              >
                <div class="flex justify-between items-end px-2 py-1">
                  <p class="font-bold text-xl">
                    #{{ shade.id }}
                    <span>{{ getColorName(shade.code) }}</span>
                  </p>
                  <p class="text-sm">{{ formatDate(shade.created_at) }}</p>
                </div>
                <div class="flex">
                  <div
                    v-for="(color, colorIndex) in shade.colors"
                    :key="`shade-${shadeIndex}-color-${colorIndex}`"
                    class="w-12 h-12"
                    :style="'background-color: ' + color"
                  ></div>
                </div>
              </div>
              <div class="flex justify-end px-2 text-xs bg-theme-600 py-1">
                <div
                  class="flex"
                  v-if="publishActive"
                >
                  <div
                    v-if="shade.is_public"
                    class="mr-4"
                  >
                    <i class="fas fa-heart"></i>
                    {{ shade.likes }}
                    Likes
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
export default {
  data() {
    return {
      shades: [],
      confirmDeleteShade: null,
      loading: false,
      publishActive: false,
    }
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
      this.loading = true
      const { data, error } = await this.$supabase.from('shades').select()
      this.loading = false
      if (error) {
        this.$notify({
          text: "Couldn't get shades",
          type: 'error',
          duration: 4000,
        })
        return
      }
      this.shades = data
    },
    editShade(shade) {
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

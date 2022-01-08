<template>
  <div class="px-2 flex flex-col items-center w-full">
    <div class="flex py-4 -mx-2">

      <div class="mx-2">
        <p class="text-xl text-center">My collections</p>
      </div>

      <div class="mx-2">
        <p class="text-xl text-center">My shades</p>
        <div class="flex items-center">
          <div
            v-for="(shade, shadeIndex) in shades"
            :key="`shade-${shadeIndex}`"
            class="bg-theme-200 hover:bg-theme-300 rounded-lg px-4 pt-4 pb-6 cursor-pointer"
            @click="editShade(shade)"
          >
            <div class="flex justify-between items-end">
              <p class="font-bold text-2xl">
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
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      shades: [
        {
          id: 21,
          user_id: 'f5096129-5fd6-4930-8854-c723a65b26ff',
          collection_id: null,
          is_public: false,
          likes: 0,
          created_at: '2022-01-08T11:24:04.866108+00:00',
          code: 'color=229%2C72%2C61&step-up=6&step-down=13&hue-shift=-35&name=royal-blue&overrides=e30%3D',
          colors: [
            '#CADEF6',
            '#BDD4F4',
            '#A3BFF0',
            '#89A6EC',
            '#6E8CE7',
            '#546EE3',
            '#2238D3',
            '#19229A',
            '#101060',
            '#080627',
          ],
        },
      ],
    }
  },
  mounted() {
    if (!this.shades.length) {
      // this.getShades()
    }
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
      const { data, error } = await this.$supabase.from('shades').select()
      if (error) {
        this.$notify({
          text: "Couldn't get shades",
          type: 'error',
          duration: 4000,
        })
      }
      this.shades = data
    },
    editShade(shade) {
      this.$router.push({
        name: 'shade',
        params: { shade },
      })
    },
  },
}
</script>

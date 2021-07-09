<template>
  <div>
    <notifications position="bottom right" />

    <div class="bg-theme-lighter px-4 py-4 text-theme">
      <div class="flex flex-wrap justify-between items-center">
        <div>
          <p class="text-lg md:text-2xl font-black mb-0 leading-none tracking-wide inline-block logo-text cursor-default">tailwindshades</p>
        </div>
        <div class="w-1/3 text-right flex justify-end items-center">
          <button
            type="button"
            class="btn py-1 text-xs md:text-sm focus:outline-none"
            :class="config.theme === 'light' ? 'bg-blue-400 text-blue-100' : 'border border-theme-600'"
            @click="changeTheme('light')"
          >Light</button>
          <button
            type="button"
            class="btn py-1 text-xs md:text-sm focus:outline-none ml-1 md:ml-2"
            :class="config.theme === 'dark' ? 'bg-blue-600 text-white' : 'border border-theme-600'"
            @click="changeTheme('dark')"
          >Dark</button>
          <div class="inline-block ml-2 md:ml-8">
            <a
              href="https://github.com/anheric/tailwindshades"
              class="text-2xl cursor-pointer text-theme-lighter hover:text-theme"
              target="_blank"
            >
              <i class="fab fa-github"></i>
            </a>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="step === 'base' && !hasURLHash"
      class="px-2 md:px-0 h-full text-center flex items-center justify-center"
    >
      <div class="leading-none text-theme-lighter -mt-12">
        <p class="text-lg md:text-xl text-left">Start by</p>
        <p class="text-3xl md:text-4xl font-bold mt-1 text-left">selecting a <u>base</u> color</p>
        <input
          type="text"
          v-model="hex"
          v-maska="{ mask: '!#HHHHHH', tokens: { 'H': { pattern: /[0-9a-fA-F]/, uppercase: true }}}"
          class="form-control form-no-outline font-black text-2xl mt-6 py-6 px-8"
        >
        <div class="mt-8">
          <p class="text-left">Default tailwindcss palette colors (*-500)</p>
          <div class="flex justify-between h-12 mt-2">
            <div
              class="flex-grow cursor-pointer"
              :class="{ 'border-2 light:border-black': hex === color.hex}"
              :style="`background-color: ${color.hex};`"
              v-for="color in defaultTailwindPaletteBaseColors"
              :key="'tailwind-default-base-' + color.name"
              :title="color.name"
              @click="hex = color.hex, focus = 'suggestion'"
            ></div>
          </div>
        </div>
        <transition name="fade">
          <div
            class="btn mt-8 py-4 px-8"
            :style="`background-color: ${hex}; color: ${textColorByBrightness()}`"
            v-show="validHex"
            @click="step = 'shades'"
          >
            <p class="text-xl md:text-2xl">Shade</p>
            <p class="text-xs mt-1">{{ hex }}</p>
          </div>
        </transition>

        <carbon-ads
          v-if="isProduction"
          class="flex justify-center items-center mt-24"
        />
      </div>
    </div>

    <div
      class="flex flex-col h-full"
      v-if="step === 'shades' || hasURLHash"
    >
      <div class="flex justify-between bg-theme-lighter border-t border-theme py-2 px-2">
        <button
          class="text-theme text-sm hover:text-blue-400 focus:outline-none"
          @click="backToBaseSelection"
          title="Back to base selection"
        >
          <i class="fas fa-angle-left"></i>
          back to base color selection.
        </button>

        <button
          class="text-theme text-sm hover:text-blue-400 focus:outline-none"
          @click="copyShareLink"
          title="Copy share link"
        >
          <i class="fas fa-share"></i>
          share
        </button>
      </div>

      <shades-component
        :initial="hex"
        ref="shadesComponent"
      />
    </div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ShadesComponent from '@/components/Shades'
import CarbonAds from '@/components/CarbonAds'
import converter from 'color-convert'

export default {
  components: {
    ShadesComponent,
    CarbonAds,
  },
  metaInfo: {
    title: 'Tailwind Shades',
    meta: [
      {
        name: 'description',
        content: 'A tool to help generate color shades for Tailwind CSS.',
      },
    ],
  },
  data() {
    return {
      isProduction: process.env.NODE_ENV === 'production',
      step: 'base',
      hex: '',
      defaultTailwindPaletteBaseColors: [
        { name: 'gray', hex: '#A0AEC0' },
        { name: 'red', hex: '#F56565' },
        { name: 'orange', hex: '#ED8936' },
        { name: 'yellow', hex: '#ECC94B' },
        { name: 'green', hex: '#48BB78' },
        { name: 'teal', hex: '#38B2AC' },
        { name: 'blue', hex: '#4299E1' },
        { name: 'indigo', hex: '#667EEA' },
        { name: 'purple', hex: '#9F7AEA' },
        { name: 'pink', hex: '#ED64A6' },
      ],
      hasURLHash: window.location.hash.length > 2,
    }
  },
  computed: {
    validHex() {
      let hex = this.hex
      if (this.hex.charAt(0) !== '#') {
        hex = '#' + hex
      }
      return /^#[0-9A-F]{6}$/i.test(hex)
    },
    ...mapGetters({
      config: 'config/config',
    }),
  },
  mounted() {
    if (process.env.NODE_ENV === 'production') {
      this.$ga.page('/')
    }

    window.addEventListener('hashchange', this.handleHashChange)
  },
  beforeDestroy() {
    window.removeEventListener('hashchange', this.handleHashChange)
  },
  methods: {
    handleHashChange() {
      this.hasURLHash = window.location.hash.length > 2
      if (!this.hasURLHash) {
        return
      }

      // Force reload in case the URL hash changes manually.
      let h = window.location.hash.substring(1)
      if (h !== this.$refs.shadesComponent.urlHash()) {
        window.location.reload()
      }
    },
    copyShareLink() {
      var textarea = document.createElement('textarea')
      textarea.textContent = window.location
      textarea.style.position = 'fixed'
      document.body.appendChild(textarea)
      textarea.select()

      let failText = "Couldn't copy code, please try manual copy-paste"
      try {
        let copied = document.execCommand('copy')
        this.$notify({
          text: copied ? 'Share link copied to clipboard' : failText,
          type: 'info',
          duration: 4000,
        })
      } catch (err) {
        this.$notify({
          text: failText,
          type: 'error',
          duration: 4000,
        })
      }

      document.body.removeChild(textarea)
      window.getSelection().removeAllRanges()
    },
    backToBaseSelection() {
      window.location.hash = ''
      history.pushState('', document.title, window.location.pathname + window.location.search)
      this.step = 'base'
    },
    textColorByBrightness() {
      if (!this.validHex) {
        return
      }
      let rgb = converter.hex.rgb(this.hex)

      // https://www.w3.org/TR/AERT/#color-contrast
      let brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000
      return brightness > 125 ? 'black' : 'white'
    },
    changeTheme(theme) {
      this['config/changeTheme'](theme)
    },
    ...mapActions(['config/changeTheme']),
  },
}
</script>

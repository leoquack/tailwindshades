<template>
  <div>
    <notifications position="bottom right" />

    <div class="bg-theme-lighter px-4 py-3 text-theme">
      <div class="flex flex-wrap justify-between items-center">
        <div>
          <p class="text-lg md:text-2xl font-black mb-0 leading-none tracking-wide inline-block logo-text cursor-default">tailwindshades</p>
        </div>
        <div class="w-2/3 text-right flex justify-end items-center">
          <UserControl
            v-if="!isProduction"
            class="text-left mr-6"
          />
          <div
            class="btn bg-theme-500 hover:bg-theme-700"
            @click="toggleTheme"
          >
            <i
              class="text-xl fas fa-moon"
              v-if="theme === 'light'"
            ></i>
            <svg
              v-show="theme === 'dark'"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              width="20px"
              height="20px"
              fill="#ffffff"
            >
              <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"></path>
            </svg>
          </div>

          <div class="inline-block ml-2 md:ml-8">
            <a
              href="https://github.com/anheric/tailwindshades"
              class="text-2xl cursor-pointer text-theme-lighter hover:text-theme"
              target="_blank"
            >
              <img
                src="/icon/github.svg"
                alt="Github logo"
                class="h-8"
              >
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
              :class="{ 'border-2 light:border-black': hex === color}"
              :style="`background-color: ${color};`"
              v-for="color in defaultTailwindPaletteBaseColors"
              :key="'tailwind-default-base-' + color"
              @click="hex = color, focus = 'suggestion'"
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

        <div>
          <button
            v-if="isLoggedIn && shadeIsUnsaved"
            class="text-theme text-sm hover:text-blue-400 focus:outline-none mr-6"
            @click="saveShade"
            title="Save shade"
          >
            <i class="fas fa-save"></i>
            save
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
      </div>

      <shades-component
        :initial="hex"
        ref="shadesComponent"
      />
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ShadesComponent from '@/components/Shades'
import CarbonAds from '@/components/CarbonAds'
import UserControl from '@/components/UserControl'
import converter from 'color-convert'

export default {
  components: {
    ShadesComponent,
    CarbonAds,
    UserControl,
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
      // shade used for cloud storage.
      shade: {
        id: null,
        code: '',
      },
      hex: '',
      defaultTailwindPaletteBaseColors: [
        '#6B7280',
        '#EF4444',
        '#F59E0B',
        '#10B981',
        '#3B82F6',
        '#6366F1',
        '#8B5CF6',
        '#EC4899',
      ],
      hasURLHash: window.location.hash.length > 2,
    }
  },
  computed: {
    shadeHasUnsavedChanges() {
      return this.shade.code !== this.$refs.shadesComponent.urlHash()
    },
    shadeIsUnsaved() {
      return !this.shade.id || this.shadeHasUnsavedChanges
    },
    validHex() {
      let hex = this.hex
      if (this.hex.charAt(0) !== '#') {
        hex = '#' + hex
      }
      return /^#[0-9A-F]{6}$/i.test(hex)
    },
    ...mapGetters(['theme', 'user', 'isLoggedIn']),
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
    saveShade() {
      if (this.shade.id) {
        this.dbUpdateShade()
        return
      }
      this.dbInsertShade()
    },
    async dbUpdateShade() {
      const { data, error } = await this.$supabase
        .from('shades')
        .update({
          user_id: this.user.id,
          code: window.location.hash.substring(1),
        })
        .match({
          id: this.shade.id,
        })
      if (error) {
        this.$notify({
          text: "Couldn't update shade",
          type: 'error',
          duration: 4000,
        })
        return
      }

      this.shade = Object.assign({}, this.shade, data[0])
      this.$notify({
        text: 'Shade updated successfully',
        type: 'info',
        duration: 2000,
      })
    },
    async dbInsertShade() {
      const { data, error } = await this.$supabase.from('shades').insert({
        user_id: this.user.id,
        code: window.location.hash.substring(1),
      })
      if (error) {
        this.$notify({
          text: "Couldn't save shade",
          type: 'error',
          duration: 4000,
        })
        return
      }

      this.shade = Object.assign({}, this.shade, data[0])
      this.$notify({
        text: 'Shade saved successfully',
        type: 'info',
        duration: 2000,
      })
    },
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
    toggleTheme() {
      this.$store.commit('setTheme', this.theme === 'light' ? 'dark' : 'light')
    },
  },
}
</script>

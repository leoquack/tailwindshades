<template>
  <div class="flex flex-col">
    <div
      v-if="step === 'base' && !hasURLHash"
      class="px-2 md:px-0 text-center flex items-center justify-center flex-grow"
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
      class="flex flex-col"
      v-if="step === 'shades' || hasURLHash"
    >
      <div class="flex justify-between bg-theme-lighter border-t border-theme">
        <button
          class="text-theme text-sm hover:text-blue-400 focus:outline-none p-2"
          @click="backToBaseSelection"
          title="Back to base selection"
        >
          <i class="fas fa-angle-left"></i>
          back to base color selection.
        </button>

        <div class="flex items-center">
          <div
            v-if="loginFeatures && (shadeHasUnsavedChanges || shade.id)"
            class="text-theme font-bold text-sm bg-theme-500 h-full flex items-center"
          >
            <p
              v-if="shade.id"
              class="px-4"
            >my shade #{{ shade.id }}</p>

            <div
              class="text-sm focus:outline-none flex items-center justify-between bg-theme-600 h-full pl-4 select-none"
              :class="[
              shadeHasUnsavedChanges ? 'text-theme hover:text-theme' : 'text-theme-500',
              { 'pr-4' : !shade.id },
              ]"
            >
              <div
                class="mr-2 cursor-pointer"
                @click="saveShade"
              >
                <span
                  class="text-sm"
                  v-if="shadeHasUnsavedChanges"
                >*</span>
                <!-- <i class="fas fa-save mr-1"></i> -->
                save
              </div>
              <DropdownComponent
                class="h-full"
                placement="right"
                :disabled="!shadeHasUnsavedChanges"
                v-if="shade.id"
              >
                <div
                  slot="button"
                  class="flex h-full items-center bg-theme-600 text-theme px-1"
                >
                  <svg
                    class="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    :fill="shadeHasUnsavedChanges ? '#FFFFFF' : '#262626'"
                  >
                    <path d="M4.516 7.548c.436-.446 1.043-.481 1.576 0L10 11.295l3.908-3.747c.533-.481 1.141-.446 1.574 0 .436.445.408 1.197 0 1.615-.406.418-4.695 4.502-4.695 4.502a1.095 1.095 0 0 1-1.576 0S4.924 9.581 4.516 9.163c-.409-.418-.436-1.17 0-1.615z" />
                  </svg>
                </div>

                <div slot="content">
                  <div
                    class="block px-2 my-1 cursor-pointer rounded hover:bg-purple-500 hover:text-white"
                    @click="dbInsertShade"
                  >
                    Save as new
                  </div>
                </div>
              </DropdownComponent>
            </div>

          </div>

          <button
            class="text-theme text-sm hover:text-blue-400 focus:outline-none ml-2 p-2"
            @click="copyShareLink"
            title="Copy share link"
          >
            <i class="fas fa-share"></i>
            share
          </button>
        </div>
      </div>

      <shades-component
        :initialHEX="hex"
        :dbShade="shade"
        :colors.sync="colors"
        ref="shadesComponent"
      />
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ShadesComponent from '@/components/Shades'
import CarbonAds from '@/components/CarbonAds'
import converter from 'color-convert'
import DropdownComponent from '@/components/Dropdown'

export default {
  components: {
    ShadesComponent,
    CarbonAds,
    DropdownComponent,
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
      shade: this.emptyShade(),
      colors: [],
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
      shadeHasUnsavedChanges: false,
    }
  },
  computed: {
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
    ...mapGetters(['theme', 'user', 'isLoggedIn', 'loginFeatures']),
  },
  mounted() {
    if (process.env.NODE_ENV === 'production') {
      this.$ga.page('/')
    }

    const shade = this.$route.params.shade
    if (shade) {
      this.shade = shade
      this.hex = shade.colors[5]
      this.step = 'shades'
    }

    window.addEventListener('hashchange', this.handleHashChange)
  },
  beforeDestroy() {
    window.removeEventListener('hashchange', this.handleHashChange)
  },
  methods: {
    saveShade() {
      if (!this.shadeHasUnsavedChanges) {
        return
      }

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
          colors: this.colors,
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
      this.shadeHasUnsavedChanges = this.shade.code !== window.location.hash.substring(1)
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
        colors: this.colors,
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
      this.shadeHasUnsavedChanges = this.shade.code !== window.location.hash.substring(1)

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
      this.shadeHasUnsavedChanges = this.shade.code !== h
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
      this.shade = this.emptyShade()
      this.hex = ''
      this.step = 'base'
    },
    emptyShade() {
      return {
        id: null,
        code: '',
      }
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
  },
}
</script>

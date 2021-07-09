<template>
  <div class="flex flex-col h-full pb-2">
    <div
      class="flex flex-col rounded text-theme h-full px-2"
      v-if="result.shades && result.shades.length"
    >
      <div
        class="flex flex-wrap -mx-2 h-full"
        v-if="Object.entries(overrides).length"
      >
        <div class="flex flex-col w-full md:w-2/3 px-2 md:h-full">
          <div class="flex flex-col h-full mt-4">
            <div
              v-for="{ stop, hex, hsl, override, textColor } in result.shades"
              :key="'shade-' + stop * 100"
              :class="[ 'px-2 flex flex-grow', { 'font-black': stop === 5 } ]"
              :style="`background-color: #${(override ? override.hex : hex)}; color: ${(override ? override.textColor : textColor)};`"
            >
              <div class="flex w-full justify-between items-center">
                <p class="w-3/12 text-xs">({{ stop * 100 }})</p>
                <p class="w-6/12 text-center">#{{ override ? override.hex : hex }}</p>
                <div class="w-2/12">

                  <div class="flex-grow">
                    <div>
                      <slider-input
                        :number-input-enabled="false"
                        slim
                        :title="(overrides[String(stop)].saturation !== -1 ? '* ' : '') + 'Saturation'"
                        :value="overrides[String(stop)].saturation !== -1 ? overrides[String(stop)].saturation : hsl[1]"
                        @input="overrideValue($event, stop, 'saturation')"
                        :min="0"
                        :max="100"
                      />
                    </div>
                    <div>
                      <slider-input
                        :number-input-enabled="false"
                        slim
                        :title="(overrides[String(stop)].lightness !== -1 ? '* ' : '') + 'Lightness'"
                        :value="overrides[String(stop)].lightness !== -1 ? overrides[String(stop)].lightness : hsl[2]"
                        @input="overrideValue($event, stop, 'lightness')"
                        :min="0"
                        :max="100"
                      />
                    </div>
                  </div>

                </div>
                <div class="w-1/12 flex items-center justify-center ">
                  <div
                    class="px-4 py-3 bg-theme-900 cursor-pointer text-white border border-theme-800"
                    :class="{ 'opacity-10': !override }"
                    @click="resetOverride(stop)"
                  >
                    <i class="fas fa-undo"></i>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div class="w-full md:w-1/3 pr-6 pl-2 mt-4">
          <div class="border border-theme-600 pb-2">
            <div class="flex items-center leading-none border-b border-theme-600">
              <p class="text-xl font-black mr-3 border-r border-theme-600 w-10 h-10 flex items-center justify-center">1</p>
              <p class="text-xl py-2 px-2 text-theme-darker font-bold">Fine tune base color</p>
            </div>

            <div class="md:px-2 pt-2">
              <div class="flex mt-1">
                <div class="pr-2 flex">
                  <div
                    class="text-xs leading-4 flex flex-col justify-center px-1 md:px-2 select-none"
                    :style="'background-color: #' + result.color.hex + '; color: ' + textColorFromBrightness(result.color.hex) + ';'"
                  >
                    <p><strong>HEX:</strong> {{ result.color.hex | displayHEX }}</p>
                    <p><strong>RGB:</strong> {{ result.color.rgb | displayRGB }}</p>
                    <p><strong>HSL:</strong> {{ result.color.hsl | displayHSL }}</p>
                    <p>
                      <strong>Initial selection: </strong>
                      <a
                        class="underline cursor-pointer hover:bg-theme hover:text-theme-lighter"
                        title="reset"
                        @click="reset"
                      >{{ initial }}</a>
                    </p>
                  </div>
                </div>

                <div class="flex-grow">
                  <div>
                    <slider-input
                      title="Hue"
                      v-model="hsl[0]"
                      :min="0"
                      :max="360"
                    />
                  </div>
                  <div>
                    <slider-input
                      title="Saturation"
                      v-model="hsl[1]"
                      :min="0"
                      :max="100"
                    />
                  </div>
                  <div>
                    <slider-input
                      title="Lightness"
                      v-model="hsl[2]"
                      :min="0"
                      :max="100"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="border border-theme-600 mt-6">
            <div class="mb-2">
              <div class="flex items-center leading-none border-b border-theme-600">
                <p class="text-xl font-black mr-3 border-r border-theme-600 w-10 h-10 flex items-center justify-center">2</p>
                <p class="text-xl py-2 px-2 text-theme-darker font-bold">Uniform shades</p>
              </div>
            </div>
            <div class="mb-2 px-2">
              <slider-input
                title="Step up %"
                v-model="groupOptions.stepUp"
                :min="3"
                :max="20"
              />
            </div>
            <div class="mb-2 px-2">
              <slider-input
                title="Step down %"
                v-model="groupOptions.stepDown"
                :min="3"
                :max="20"
              />
            </div>
          </div>

          <div
            class="border border-theme-600 mt-6"
            v-if="code.visible"
          >
            <div class="mb-2">
              <div class="flex items-center leading-none border-b border-theme-600">
                <p class="text-xl font-black mr-3 border-r border-theme-600 w-10 h-10 flex items-center justify-center">3</p>
                <p class="text-xl py-2 px-2 text-theme-darker font-bold">Get code</p>
              </div>
            </div>
            <div class="px-2 relative">
              <label class="text-sm font-bold">Color name:</label>
              <input
                class="form-control"
                type="text"
                v-model="code.name"
              />
              <prism-component language="javascript">{{ code.name | appendColon }}{{ codeDisplay }}</prism-component>
              <input
                type="hidden"
                id="final-code"
                :value="$options.filters.appendColon(code.name) + codeDisplay"
              />
              <div
                class="absolute right-0 top-0 mt-20 mr-4 bg-theme-700 px-4 py-2 text-xl rounded-full cursor-pointer hover:bg-theme-800"
                @click="copyCodeToClipboard"
              >
                <i class="far fa-copy"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import converter from 'color-convert'
import { ntc } from '@/lib/ntc.js'
import SliderInput from '@/components/SliderInput'
import PrismComponent from 'vue-prism-component'
import _ from 'lodash'

export default {
  props: {
    initial: String,
  },
  components: {
    SliderInput,
    PrismComponent,
  },
  data() {
    return {
      stops: [0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      hsl: [],
      groupOptions: {
        stepUp: 10,
        stepDown: 10,
      },
      code: {
        visible: true,
        name: '',
      },
      doubleKey: {
        t: null,
        d: 275,
        k: '',
      },
      delay: {
        hash: {
          n: null,
          t: 150,
        },
      },
      overrides: {},
    }
  },
  watch: {
    'result.shades'() {
      this.updateURLHash()
    },
    'code.name'() {
      this.updateURLHash()
    },
    resultBaseShade() {
      this.code.name = ntc
        .name('#' + this.result.color.hex)[1]
        .replace(/[\s']+/g, '-')
        .toLowerCase()
    },
  },
  computed: {
    resultBaseShade() {
      return this.result.color.hex
    },
    codeDisplay() {
      let shades = [`  DEFAULT: '#${this.result.color.hex}'`]

      shades.push(
        ...this.result.shades.map(({ stop, hex, override }) => {
          return `  '${stop * 100}': '#${override ? override.hex : hex}'`
        })
      )

      return `{\n${shades.join(',\n')}\n},`
    },
    initialHSL() {
      return converter.rgb.hsl.raw(converter.hex.rgb(this.initial))
    },
    result() {
      let hsl = this.hsl
      let stepUp = this.groupOptions.stepUp
      let stepDown = this.groupOptions.stepDown
      let rgb = converter.hsl.rgb(hsl)

      let shades = this.stops.map(stop => {
        let distance = 5 - stop
        let direction = distance > 0 ? stepUp : stepDown
        let lightness = this.clamp(hsl[2] + direction * distance, 0, 100)
        let hex = converter.rgb.hex(converter.hsl.rgb([hsl[0], hsl[1], lightness]))

        let override = this.overrides[String(stop)]

        // If overriden = calculate hex and text color.
        let overriden =
          override &&
          ((override?.saturation !== -1 && override?.saturation !== hsl[1]) ||
            (override?.lightness !== -1 && override?.lightness !== lightness))
        if (overriden) {
          let overrideHSL = [hsl[0], hsl[1], lightness]
          if (override.saturation !== -1 && override.saturation !== hsl[1]) {
            overrideHSL[1] = override.saturation
          }
          if (override.lightness !== -1 && override.lightness !== lightness) {
            overrideHSL[2] = override.lightness
          }

          override.hex = converter.rgb.hex(converter.hsl.rgb(overrideHSL))
          override.textColor = this.textColorFromBrightness(override.hex)
        }

        return {
          stop: stop,
          hex,
          override: overriden ? override : false,
          hsl: [hsl[0], hsl[1], lightness],
          textColor: this.textColorFromBrightness(hex),
        }
      })

      return {
        color: {
          hsl,
          rgb,
          hex: converter.rgb.hex(rgb),
        },
        shades,
      }
    },
  },
  mounted() {
    for (let i in this.stops) {
      this.$set(this.overrides, [this.stops[i]], this.defaultOverridable())
    }

    if (!this.parseURLHash()) {
      this.hsl = [...this.initialHSL]
    }
  },
  methods: {
    defaultOverridable() {
      return { saturation: -1, lightness: -1 }
    },
    updateURLHash() {
      clearTimeout(this.delay.hash.n)
      this.delay.hash.n = setTimeout(() => {
        window.location.hash = this.urlHash()
      }, this.delay.hash.t)
    },
    urlHash() {
      let parts = {
        color: this.result.color.hex,
        'step-up': this.groupOptions.stepUp,
        'step-down': this.groupOptions.stepDown,
        name: this.code.name,
      }

      let defaultOverridable = this.defaultOverridable()
      let urlOverridables = {}
      for (let i in this.overrides) {
        let override = this.overrides[i]
        if (!_.isEqual(override, defaultOverridable)) {
          urlOverridables[i] = override
        }
      }

      if (Object.entries(urlOverridables)) {
        parts.overrides = window.btoa(JSON.stringify(urlOverridables))
      }

      return Object.entries(parts)
        .map(part => part.map(encodeURIComponent).join('='))
        .join('&')
    },
    parseURLHash() {
      if (window.location.hash.length < 2) {
        return
      }
      let h = window.location.hash.substring(1)
      let parts = h.split('&').map(part => part.split('=').map(decodeURIComponent))

      // All "parameters" should have value.
      if (!parts.every(p => p[1]?.length > 0)) {
        return
      }

      // Validate values.
      let color = parts.find(p => p[0] === 'color')[1]
      let hexPattern = new RegExp(/^#?[a-f0-9]{6}$/i)
      if (!hexPattern.test(color)) {
        return
      }

      let stepUp = parts.find(p => p[0] === 'step-up')[1]
      stepUp = this.clamp(parseInt(stepUp), 0, 12)

      let stepDown = parts.find(p => p[0] === 'step-down')[1]
      stepDown = this.clamp(parseInt(stepDown), 0, 12)

      let name = parts.find(p => p[0] === 'name')[1]
      let namePattern = new RegExp(/[A-z /]+$/i)
      if (!namePattern.test(name)) {
        return
      }

      let urlOverridesRaw = parts.find(p => p[0] === 'overrides')
      if (urlOverridesRaw) {
        let urlOverrides = ''
        try {
          urlOverrides = JSON.parse(window.atob(urlOverridesRaw[1]))
        } catch {
          return
        }
        this.overrides = Object.assign({}, this.overrides, urlOverrides)
      }

      // Set shades.
      this.hsl = converter.rgb.hsl.raw(converter.hex.rgb('#' + color))
      this.groupOptions.stepUp = stepUp
      this.groupOptions.stepDown = stepDown
      this.$nextTick(() => (this.code.name = name))

      return true
    },
    clamp(val, min, max) {
      return Math.min(Math.max(val, min), max)
    },
    reset() {
      this.hsl = [...this.initialHSL]
    },
    textColorFromBrightness(hex) {
      let rgb = converter.hex.rgb('#' + hex)

      // https://www.w3.org/TR/AERT/#color-contrast
      let brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000
      return brightness > 125 ? 'black' : 'white'
    },
    copyCodeToClipboard() {
      let codeInput = document.querySelector('#final-code')
      codeInput.setAttribute('type', 'text')
      codeInput.select()

      let failText = "Couldn't copy code, please try manual copy-paste"
      try {
        let copied = document.execCommand('copy')
        this.$notify({
          text: copied ? 'Code copied to clipboard' : failText,
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

      codeInput.setAttribute('type', 'hidden')
      window.getSelection().removeAllRanges()
    },
    resetOverride(stop) {
      if (!stop) {
        return
      }

      // Set default values.
      this.$set(this.overrides, String(stop), this.defaultOverridable())
    },
    overrideValue(event, stop, attribute) {
      if (this.overrides[String(stop)][attribute]) {
        this.overrides[String(stop)][attribute] = event
      }
    },
  },
  filters: {
    displayHEX(value) {
      return `#${value}`
    },
    displayRGB(value) {
      return `${value[0]}, ${value[1]}, ${value[2]}`
    },
    displayHSL(value) {
      return `${value[0]?.toFixed(2)}, ${value[1]?.toFixed(2)}%, ${value[2]?.toFixed(2)}%`
    },
    appendColon(value) {
      return value ? `'${value}': ` : ''
    },
  },
}
</script>

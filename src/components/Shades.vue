<template>
  <div class="flex flex-col pb-2">
    <div
      class="flex flex-col rounded text-theme px-2"
      v-if="result.shades && result.shades.length"
    >
      <div
        class="flex flex-wrap -mx-2"
        v-if="Object.entries(overrides).length"
      >
        <div class="flex flex-col flex-grow w-full md:w-2/3 px-2">
          <div class="flex flex-col flex-grow mt-4">
            <div class="flex text-xs select-none text-center">
              <div class="w-80 px-2 border border-theme-600 border-r-0 border-b-0 flex justify-between">
                <p>Fine tune</p>
                <a
                  v-if="hasOverrides"
                  class="underline cursor-pointer hover:bg-theme text-blue hover:text-blue-600 px-2"
                  @click="resetOverrides"
                  v-tooltip="'⚠️ reset ALL fine tunings ⚠️'"
                >reset</a>
                <label class="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    class="form-checkbox"
                    v-model="fineTuneLimitLightness"
                  />
                  <span
                    class="ml-1"
                    v-tooltip="'* limit between the lightness of the previous and next shades'"
                  >limit lightness</span>
                </label>
                <!-- <a
                  v-if="!hasOverrides"
                  class="underline cursor-pointer hover:bg-theme text-blue hover:text-blue-600 px-2"
                  @click="auto"
                >auto</a> -->
              </div>
              <div class="flex-grow px-2 border border-theme-600 border-b-0"></div>
            </div>
            <div
              v-for="{ stop, hex, hsl, override, textColor } in result.shades"
              :key="'shade-' + stop * 100"
              class="border-l border-r border-theme-600"
              :class="[
                'flex flex-grow',
                { 'font-black': stop === baseShadeStop },
                { 'border-t': stops[0] === stop },
                { 'border-b': stops[stops.length - 1] === stop },
              ]"
              :style="`background-color: #${(override ? override.hex : hex)}; color: ${(override ? override.textColor : textColor)};`"
            >
              <div class="flex w-full justify-between items-center">
                <div class="w-80 h-full">
                  <div
                    class="h-full flex justify-center items-center text-theme bg-theme"
                    :class="[{'border-t-0': stops[0] !== stop}, (override ? 'opacity-100': 'opacity-90 hover:opacity-100') ]"
                  >
                    <div class="w-3/12 flex">
                      <div
                        class="px-2 py-3 ml-2 bg-theme-700 cursor-pointer text-white"
                        :class="{ 'opacity-10': !override }"
                        @click="resetOverride(stop)"
                      >
                        <i class="fas fa-undo"></i>
                      </div>
                    </div>
                    <div class="w-9/12">
                      <div class="flex-grow mr-2">
                        <div>
                          <slider-input
                            :number-input-enabled="false"
                            slim
                            :title="(overrides[String(stop)].hue !== -1 ? '* ' : '') + 'Hue'"
                            :modelValue="overrides[String(stop)].hue !== -1 ? overrides[String(stop)].hue : hsl[0]"
                            @input="overrideValue($event.target.value, stop, 'hue')"
                            :min="0"
                            :max="360"
                          />
                        </div>
                        <div>
                          <slider-input
                            :number-input-enabled="false"
                            slim
                            :title="(overrides[String(stop)].saturation !== -1 ? '* ' : '') + 'Saturation'"
                            :modelValue="overrides[String(stop)].saturation !== -1 ? overrides[String(stop)].saturation : hsl[1]"
                            @input="overrideValue($event.target.value, stop, 'saturation')"
                            :min="0"
                            :max="100"
                          />
                        </div>
                        <div>
                          <slider-input
                            :number-input-enabled="false"
                            slim
                            :title="(overrides[String(stop)].lightness !== -1 ? '* ' : '') + 'Lightness'"
                            :modelValue="overrides[String(stop)].lightness !== -1 ? overrides[String(stop)].lightness : hsl[2]"
                            @input="overrideValue($event.target.value, stop, 'lightness')"
                            :min="!fineTuneLimitLightness ? 0 : hslValueAtStop(stops.indexOf(stop) + 1, 2, 0)"
                            :max="!fineTuneLimitLightness ? 100 : hslValueAtStop(stops.indexOf(stop) - 1, 2, 100)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex flex-grow text-center items-center justify-center">
                  <div
                    class="text-3xl font-normal"
                    v-if="stop === baseShadeStop"
                  >[</div>
                  <div class="px-2">
                    <p class="text-xs leading-2">
                      {{ stop * 100 }}
                    </p>
                    <p class="leading-4">
                      #{{ override ? override.hex : hex }}
                    </p>
                  </div>
                  <div
                    class="text-3xl font-normal"
                    v-if="stop === baseShadeStop"
                  >]</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex-grow w-full md:w-1/3 pr-6 pl-2 mt-4">
          <div class="border border-theme-600 pb-2">
            <div class="flex items-center leading-none border-b border-theme-600">
              <p class="text-xl font-black mr-3 border-r border-theme-600 w-10 h-10 flex items-center justify-center">1</p>
              <p class="text-xl py-2 px-2 text-theme-darker font-bold">Fine tune base color</p>
            </div>

            <div class="md:px-2 pt-2">
              <div class="flex mt-1">
                <div class="w-1/3 pr-2 flex">
                  <div
                    class="text-xs leading-4 flex flex-col justify-center px-1 md:px-2 select-none w-full"
                    :style="'background-color: #' + result.color.hex + '; color: ' + textColorFromBrightness(result.color.hex) + ';'"
                  >
                    <p><strong>HEX:</strong> {{ displayHEX(result.color.hex) }}</p>
                    <p><strong>RGB:</strong> {{ displayRGB(result.color.rgb) }}</p>
                    <p><strong>HSL:</strong> {{ displayHSL(result.color.hsl) }}</p>
                    <p v-if="initialHEX && initialHEX !== displayHEX(result.color.hex)">
                      <strong>Initial: </strong>
                      <a
                        class="underline cursor-pointer hover:bg-theme hover:text-theme-lighter"
                        v-tooltip="'⚠️ click to reset to initial base selection ⚠️'"
                        @click="reset"
                      >{{ initialHEX }}</a>
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
              <BaseStopSelect
                class="mt-2"
                :base-shade-stop="baseShadeStop"
                title="Move base stop"
                :small="true"
                @set="$emit('set-base-shade-stop', $event.target.value)"
              />
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
                :min="0"
                :max="20"
              />
            </div>
            <div class="mb-2 px-2">
              <slider-input
                title="Step down %"
                v-model="groupOptions.stepDown"
                :min="0"
                :max="20"
              />
            </div>
            <div class="mb-2 px-2">

              <slider-input
                title="Hue shift"
                restorable
                :restore-to="0"
                :modelValue="groupOptions.hueShift"
                @input="groupOptions.hueShift = parseInt($event.target.value)"
                :min="-100"
                :max="100"
              >
              </slider-input>
            </div>
          </div>

          <div
            class="border border-theme-600 mt-6"
            v-if="code.visible"
          >
            <div class="mb-2">
              <div class="flex items-center leading-none border-b border-theme-600">
                <p class="text-xl font-black mr-3 border-r border-theme-600 w-10 h-10 flex items-center justify-center">3</p>
                <p class="text-xl py-2 px-2 text-theme-darker font-bold w-1/3">Get code</p>
                <div class="px-4">
                  <input
                    class="form-control"
                    type="text"
                    v-model="code.name"
                  />
                </div>
              </div>
            </div>
            <div class="px-2 relative">
              <input
                type="hidden"
                id="final-code"
                :modelValue="appendColon(code.name) + codeDisplay"
              />
              <div
                class="absolute right-0 top-0 mr-4 bg-theme-700 px-4 py-2 text-xl rounded-full cursor-pointer hover:bg-theme-800"
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
import { mapGetters } from 'vuex'
import converter from 'color-convert'
import { ntc } from '@/lib/ntc.js'
import SliderInput from '@/components/SliderInput.vue'
import BaseStopSelect from '@/components/BaseStopSelect.vue'
import _ from 'lodash'

export default {
  props: {
    initialHEX: String,
    colors: Array,
    baseShadeStop: Number,
    dbShade: {},
  },
  components: {
    SliderInput,
    BaseStopSelect,
  },
  data() {
    return {
      stops: [0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      hsl: [0, 0, 0],
      groupOptions: {
        stepUp: 8,
        stepDown: 11,
        hueShift: 0,
      },
      code: {
        visible: true,
        name: '',
      },
      delay: {
        hash: {
          n: null,
          t: 350,
        },
      },
      overrides: {},
      hslNames: ['hue', 'saturation', 'lightness'],
      fineTuneLimitLightness: false,
    }
  },
  watch: {
    'result.shades'() {
      this.updateURLHash()
      this.$emit(
        'update:colors',
        this.result.shades.map(s => (s.override ? '#' + s.override.hex : '#' + s.hex))
      )
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
    ...mapGetters(['originShade']),
    hasOverrides() {
      return !_.isEqual(this.overrides, this.defaultOverrides())
    },
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
      return converter.rgb.hsl.raw(converter.hex.rgb(this.initialHEX))
    },
    result() {
      let hsl = this.hsl
      let stepUp = this.groupOptions.stepUp
      let stepDown = this.groupOptions.stepDown
      let rgb = converter.hsl.rgb(hsl)
      let baseShadeStop = this.baseShadeStop

      let shades = this.stops.map(stop => {
        const distance = baseShadeStop - stop
        let direction = distance > 0 ? stepUp : stepDown
        let lightness = this.clamp(hsl[2] + direction * distance, 0, 100)

        let hue = hsl[0]
        if (this.groupOptions.hueShift !== 0) {
          const hsh = (this.groupOptions.hueShift * distance) / 10
          const max = 360
          hue = (hue + hsh + max) % max // Clamp number in the hue wheel.
        }

        const hex = converter.rgb.hex(converter.hsl.rgb([hue, hsl[1], lightness]))

        let override = this.overrides[String(stop)]

        let overridden =
          override &&
          ((override?.hue !== -1 && override?.hue !== hue) ||
            (override?.saturation !== -1 && override?.saturation !== hsl[1]) ||
            (override?.lightness !== -1 && override?.lightness !== lightness))
        if (overridden) {
          let overrideHSL = [hue, hsl[1], lightness]
          if (override.hue !== -1 && override.hue !== hue) {
            overrideHSL[0] = override.hue
          }
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
          override: overridden ? override : false,
          hsl: [hue, hsl[1], lightness],
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
    this.resetOverrides()

    let parsed = false
    if (this.dbShade?.id) {
      parsed = this.parseURLHash(this.dbShade?.code)
      this.updateURLHash()
    } else if (window.location.hash.length > 1) {
      parsed = this.parseURLHash(window.location.hash.substring(1))
    }

    if (!parsed) {
      this.hsl = [...this.initialHSL]
    }
  },
  methods: {
    hslValueAtStop(stopIndex, hslIndex, fallback) {
      if (!this.stops[stopIndex]) {
        return fallback || 0
      }
      const stop = this.stops[stopIndex]

      if (!this.result.shades[stopIndex]) {
        return fallback || 0
      }

      if (this.overrides[String(stop)]) {
        const override = this.overrides[String(stop)][this.hslNames[hslIndex]]
        if (override !== -1) {
          return override
        }
      }

      return this.result.shades[stopIndex].hsl[hslIndex]
    },
    mod(n, m) {
      return ((n % m) + m) % m
    },
    // auto is not used currently.
    auto() {
      const baseShade = this.result.shades[this.baseShadeStop]

      for (let i in this.result.shades) {
        let currentShade = this.result.shades[i]
        if (currentShade.stop == this.baseShadeStop) {
          continue
        }

        i = parseInt(i)
        let scale = Math.abs(i - this.baseShadeStop)

        // Looping HSL values here [h, s, l].
        for (let j = 0; j <= 2; j++) {
          let diff = Math.abs(currentShade.hsl[j] - baseShade.hsl[j]) || baseShade.hsl[j] / scale
          let add = Math.log(scale) / Math.log(diff)
          add = Math.exp(add * scale)
          this.overrideValue(currentShade.hsl[j] + add, currentShade.stop, this.hslNames[j])
        }
      }
    },
    resetOverrides() {
      this.overrides = Object.assign({}, this.overrides, this.defaultOverrides())
    },
    defaultOverrides() {
      let o = {}
      for (let i in this.stops) {
        o[this.stops[i]] = this.defaultOverridable()
      }

      return o
    },
    defaultOverridable() {
      return { hue: -1, saturation: -1, lightness: -1 }
    },
    updateURLHash() {
      clearTimeout(this.delay.hash.n)
      this.delay.hash.n = setTimeout(() => {
        const newURLHash = this.urlHash()

        if (this.originShade.id && !this.hashCompares(this.originShade.code, newURLHash)) {
          this.$store.commit('setOriginShade', {})
        }

        window.history.replaceState(null, '', `#${newURLHash}`)
        this.$emit('hash-changed', newURLHash)
      }, this.delay.hash.t)
    },
    hashCompares(hash, currentHash) {
      if (!hash) {
        return false
      }
      if (!currentHash.length) {
        currentHash = this.urlHash()
      }
      let hashParts = hash.split('&').map(part => part.split('=').map(decodeURIComponent))
      if (!hashParts.find(p => p[0] === 'base-stop')?.length) {
        hashParts.push(['base-stop', '5'])
      }

      let currentHashParts = currentHash.split('&').map(part => part.split('=').map(decodeURIComponent))
      for (let hashPart of hashParts) {
        let found = false
        for (let currentHashPart of currentHashParts) {
          if (currentHashPart[0] === hashPart[0] && currentHashPart[1] === hashPart[1]) {
            found = true
            break
          }
        }
        if (!found) {
          return false
        }
      }
      return true
    },
    urlHash() {
      let parts = {
        color: this.result.color.hsl,
        'step-up': this.groupOptions.stepUp,
        'step-down': this.groupOptions.stepDown,
        'hue-shift': this.groupOptions.hueShift,
        name: this.code.name,
        'base-stop': this.baseShadeStop,
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
    parseURLHash(hash) {
      if (!hash) {
        return false
      }
      let parts = hash.split('&').map(part => part.split('=').map(decodeURIComponent))

      // Skip parse on authentication redirection.
      if (parts.find(p => p[0] === 'access_token') !== undefined) {
        return false
      }

      // All "parameters" should have value.
      if (!parts.every(p => p[1]?.length > 0)) {
        return false
      }

      // color must be a valid hsl (3 numbers, comma separated).
      let color = parts
        .find(p => p[0] === 'color')[1]
        ?.split(',')
        ?.map(Number)
      if (!color || color.length < 2) {
        // accepting HEX value only for backwards compatible URLs.
        color = parts.find(p => p[0] === 'color')[1]
        let hexPattern = new RegExp(/^#?[a-f0-9]{6}$/i)
        if (!hexPattern.test(color)) {
          return false
        }
        color = converter.rgb.hsl.raw(converter.hex.rgb('#' + color))
      }

      let lookup = parts.find(p => p[0] === 'step-up')
      if (lookup?.length) {
        let stepUp = lookup[1]
        stepUp = this.clamp(parseInt(stepUp), 0, 20)
        this.groupOptions.stepUp = stepUp
      }

      lookup = parts.find(p => p[0] === 'step-down')
      if (lookup?.length) {
        let stepDown = lookup[1]
        stepDown = this.clamp(parseInt(stepDown), 0, 20)
        this.groupOptions.stepDown = stepDown
      }

      lookup = parts.find(p => p[0] === 'hue-shift')
      if (lookup?.length) {
        let hueShift = lookup[1]
        hueShift = this.clamp(parseInt(hueShift), -100, 100)
        this.groupOptions.hueShift = hueShift
      }

      let name = parts.find(p => p[0] === 'name')[1]
      let namePattern = new RegExp(/[A-z /]+$/i)
      if (!namePattern.test(name)) {
        return false
      }

      lookup = parts.find(p => p[0] === 'base-stop')
      if (lookup?.length) {
        let baseStop = parseInt(lookup[1])
        if (this.stops.includes(baseStop)) {
          this.$emit('set-base-shade-stop', baseStop)
        }
      } else {
        // for backwards-compatible URLs.
        this.$emit('set-base-shade-stop', 5)
      }

      let urlOverridesRaw = parts.find(p => p[0] === 'overrides')
      if (urlOverridesRaw) {
        let urlOverrides = ''
        try {
          urlOverrides = JSON.parse(window.atob(urlOverridesRaw[1]))
        } catch {
          return false
        }
        this.overrides = Object.assign({}, this.overrides, urlOverrides)
      }

      this.hsl = color
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

      this.overrides[String(stop)] = this.defaultOverridable()
    },
    overrideValue(value, stop, attribute) {
      if (value < 0) {
        value = 0
      } else if (attribute === 'hue' && value > 360) {
        value = 360
      } else if (attribute === 'saturation' && value > 100) {
        value = 100
      } else if (attribute === 'lightness' && value > 100) {
        value = 100
      }
      if (this.overrides[String(stop)][attribute] !== undefined) {
        this.overrides[String(stop)][attribute] = parseInt(value)
      }
    },
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

<template>
  <div class="flex flex-col h-full">
    <div
      class="flex flex-col rounded text-theme h-full overflow-hidden"
      v-if="result.shades && result.shades.length"
    >

      <div class="flex flex-wrap -mx-2 h-full">
        <div class="flex flex-col w-full md:w-2/3 px-2 md:h-full">
          <!-- <p class="text-lg text-theme-lighter font-black">Preview</p> -->
          <div class="flex flex-col h-full">
            <div
              v-for="(shade, i) in result.shades"
              :key="'shade-' + i"
              class="px-2 flex flex-grow"
              :class="{'font-black': i === 4 }"
              :style="`background-color: #${shade.hex}; color: ${shade.textColor};`"
            >
              <div class="flex w-full justify-between items-center">
                <p class="w-1/3 text-xs">({{ (i + 1) * 100 }})</p>
                <p class="w-1/3 text-center">#{{ shade.hex }}</p>
                <p class="w-1/3"></p>
              </div>
            </div>
          </div>
        </div>

        <div class="w-full md:w-1/3 pr-6 pl-2 mt-6">
          <div class="overflow-hidden border border-theme-600 pb-2">
            <div class="flex items-center leading-none border-b border-theme-600">
              <p class="text-4xl font-black mr-3 bg-theme-600 w-12 h-12 flex items-center justify-center">1</p>
              <p class="text-xl text-theme-darker font-bold">Fine tune base color</p>
            </div>

            <div class="flex mt-1 -px-2">
              <div class="flex flex-wrap items-end mt-2 px-2">
                <div class="mr-1">
                  <div
                    class="w-16 h-16"
                    :style="'background-color: #' + result.color.hex + ';'"
                  ></div>
                </div>
                <div class="text-xs leading-4">
                  <p><strong>HEX:</strong> {{ result.color.hex | displayHEX }}</p>
                  <p><strong>RGB:</strong> {{ result.color.rgb | displayRGB }}</p>
                  <p><strong>HSL:</strong> {{ result.color.hsl | displayHSL }}</p>
                  <p>
                    <strong>Initial selection:</strong>
                    <a
                      class="underline text-blue-500 cursor-pointer"
                      title="reset"
                      @click="reset"
                    >{{ initial }}</a>
                  </p>
                </div>
              </div>

              <div class="flex-grow px-2">
                <div>
                  <range-picker
                    title="Hue"
                    v-model="hsl[0]"
                    :min="0"
                    :max="360"
                  />
                </div>
                <div>
                  <range-picker
                    title="Saturation"
                    v-model="hsl[1]"
                    :min="0"
                    :max="100"
                  />
                </div>
                <div>
                  <range-picker
                    title="Lightness"
                    v-model="hsl[2]"
                    :min="0"
                    :max="100"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="border border-theme-600 mt-6">
            <div class="mb-2">
              <div class="flex items-center leading-none border-b border-theme-600">
                <p class="text-4xl font-black mr-3 bg-theme-600 w-12 h-12 flex items-center justify-center">2</p>
                <p class="text-xl text-theme-darker font-bold">Uniform shades</p>
              </div>
            </div>
            <div class="mb-2 px-2">
              <range-picker
                title="Step up %"
                v-model="groupOptions.stepUp"
                :min="3"
                :max="20"
              />
            </div>
            <div class="mb-2 px-2">
              <range-picker
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
                <p class="text-4xl font-black mr-3 bg-theme-600 w-12 h-12 flex items-center justify-center">3</p>
                <p class="text-xl text-theme-darker font-bold">Get code</p>
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
              >
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
import RangePicker from '@/components/RangePicker'
import PrismComponent from 'vue-prism-component'
import Noty from 'noty'

export default {
  props: {
    initial: String,
  },
  components: {
    RangePicker,
    PrismComponent,
  },
  data() {
    return {
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
    }
  },
  watch: {
    resultBaseShade() {
      this.code.name = ntc.name(this.result.shades[4].hex)[1].replace(/\s+/g, '-').toLowerCase()
    },
  },
  computed: {
    resultBaseShade() {
      if (!this.result?.shades[4]?.hex) {
        return ''
      }
      return this.result.shades[4]
    },
    codeDisplay() {
      if (!this.result.shades || !this.result.shades.length) {
        return {}
      }
      let shades = [`  default: '#${this.result.shades[4].hex}'`]
      for (let i in this.result.shades) {
        shades.push(`  '${parseInt(i) + 1}00': '#${this.result.shades[i].hex}'`)
      }
      return `{\n${shades.join(',\n')}\n},`
    },
    initialHSL() {
      return converter.rgb.hsl(converter.hex.rgb(this.initial))
    },
    result() {
      let hsl = this.hsl

      let stepUp = this.groupOptions.stepUp
      let stepDown = this.groupOptions.stepDown

      let shades = []
      for (let i = 4; i >= 1; i--) {
        let lightness = hsl[2] + i * stepUp
        let hex = converter.rgb.hex(converter.hsl.rgb([hsl[0], hsl[1], lightness > 100 ? 100 : lightness]))
        shades.push({
          hex,
          textColor: this.textColorFromBrightness(hex),
        })
      }
      {
        let hex = converter.rgb.hex(converter.hsl.rgb(hsl))
        shades.push({
          hex,
          textColor: this.textColorFromBrightness(hex),
        })
      }
      for (let i = 1; i < 5; i++) {
        let lightness = hsl[2] - i * stepDown
        let hex = converter.rgb.hex(converter.hsl.rgb([hsl[0], hsl[1], lightness < 0 ? 0 : lightness]))
        shades.push({
          hex,
          textColor: this.textColorFromBrightness(hex),
        })
      }

      let rgb = converter.hsl.rgb(hsl)
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
    this.hsl = [...this.initialHSL]
  },
  methods: {
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
        new Noty({
          text: copied ? 'Code copied to clipboard' : failText,
          type: 'info',
          layout: 'bottomRight',
          timeout: 4000,
        }).show()
      } catch (err) {
        new Noty({
          text: failText,
          type: 'error',
          layout: 'bottomRight',
          timeout: 4000,
        }).show()
      }

      codeInput.setAttribute('type', 'hidden')
      window.getSelection().removeAllRanges()
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
      return `${value[0]}, ${value[1]}%, ${value[2]}%`
    },
    appendColon(value) {
      return value ? `'${value}': ` : ''
    },
  },
}
</script>

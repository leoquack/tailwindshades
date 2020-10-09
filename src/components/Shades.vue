<template>
  <div class="h-full">
    <div
      class="mb-8 rounded py-1 text-theme px-2 h-full"
      v-if="result.shades && result.shades.length"
    >

      <div class="flex flex-wrap h-full -mx-2">
        <div class="w-full md:w-1/3 px-2">
          <div class="mb-4">
            <div>
              <p class="text-lg text-theme-lighter font-black">Fine tune base color</p>
              <p class="text-sm mb-2">
                Initial selection:
                <a
                  class="underline text-blue-500 cursor-pointer"
                  title="reset"
                  @click="reset"
                >{{ initial }}</a>
              </p>
            </div>
            <div class="flex flex-wrap">
              <div class="mr-2">
                <div
                  class="w-16 h-16 mb-4"
                  :style="'background-color: #' + result.color.hex + ';'"
                ></div>
              </div>
              <div class="text-sm">
                <p>HEX: {{ result.color.hex | displayHEX }}</p>
                <p>RGB: {{ result.color.rgb | displayRGB }}</p>
                <p>HSL: {{ result.color.hsl | displayHSL }}</p>
              </div>
            </div>

            <div class="mb-4">
              <range-picker
                title="Hue"
                v-model="hsl[0]"
                :min="0"
                :max="360"
              />
            </div>
            <div class="mb-4">
              <range-picker
                title="Saturation"
                v-model="hsl[1]"
                :min="0"
                :max="100"
              />
            </div>
            <div class="mb-4">
              <range-picker
                title="Lightness"
                v-model="hsl[2]"
                :min="0"
                :max="100"
              />
            </div>
          </div>
        </div>

        <div class="w-full md:w-1/3 px-2">
          <p class="text-lg text-theme-lighter font-black">Preview</p>
          <div class="flex flex-col">
            <div
              v-for="(shade, i) in result.shades"
              :key="'shade-' + i"
              class="px-1 py-2"
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

        <div class="w-full md:w-1/3 px-2">
          <div class="mb-4">
            <p class="text-lg text-theme-lighter font-black">Shades</p>
          </div>
          <div class="mb-4">
            <range-picker
              title="Step up %"
              v-model="groupOptions.stepUp"
              :min="3"
              :max="20"
            />
          </div>
          <div class="mb-4">
            <range-picker
              title="Step down %"
              v-model="groupOptions.stepDown"
              :min="3"
              :max="20"
            />
          </div>
        </div>

        <div
          class="w-full sm:w-1/3 px-2 py-4"
          v-if="code.visible"
        >
          <div class="w-64 mx-auto">
            <label class="block">Color name:</label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              v-model="code.name"
            />
            <pre class="text-xs bg-white text-black p-2 mt-2">{{ code.name | appendColon }}{{ codeDisplay }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import converter from 'color-convert'
import RangePicker from '@/components/RangePicker'
// import Noty from 'noty'

export default {
  props: {
    initial: String,
  },
  components: {
    RangePicker,
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
  computed: {
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
    // new Noty({
    //   text: 'test',
    //   timeout: 4000,
    // }).show()
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

<template>
  <div>
    <div
      class="mb-8 rounded py-1 px-"
      v-if="result.shades && result.shades.length"
    >
      <div class="flex flex-wrap">
        <div class="w-full sm:w-1/3 px-2 py-4">
          <div
            v-for="(shade, i) in result.shades"
            :key="'shade-' + i"
          >
            <div
              class="h-12 p-1 flex justify-center items-center"
              :style="'background-color: hsl(' + shade.hsl[0] + ', ' + shade.hsl[1] + '%, ' + shade.hsl[2] + '%); color:' + textColorFromBrightness(shade.rgb) + ';'"
            >
              <!-- {{ 'hsl(' + shade.hsl[0] + ', ' + shade.hsl[1] + '%, ' + shade.hsl[2] + '%)' }} -->
              #{{ shade.hex }}
            </div>
          </div>
        </div>

        <div class="w-full sm:w-1/3 px-2 py-4">
          <div class="mb-4">
            <div>
              <p class="text-2xl">Base color</p>
              <p class="text-sm mb-2">
                Initial selection:
                <a
                  class="underline text-blue-500 cursor-pointer"
                  title="reset"
                  @click="resetBaseColor"
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
                v-model="baseColorEdit.hsl.h"
                :min="0"
                :max="360"
              />
            </div>
            <div class="mb-4">
              <range-picker
                title="Saturation"
                v-model="baseColorEdit.hsl.s"
                :min="0"
                :max="100"
              />
            </div>
            <div class="mb-4">
              <range-picker
                title="Lightness"
                v-model="baseColorEdit.hsl.l"
                :min="0"
                :max="100"
              />
            </div>
          </div>
        </div>

        <div class="w-full sm:w-1/3 px-2 py-4">
          <div class="mb-4">
            <p class="text-2xl">Shades</p>
          </div>
          <div class="mb-4">
            <range-picker
              title="Max Step Up %"
              v-model="options.maxStepUp"
              :min="1"
              :max="20"
            />
          </div>
          <div class="mb-4">
            <range-picker
              title="Max Step Down %"
              v-model="options.maxStepDown"
              :min="1"
              :max="20"
            />
          </div>
          <!-- <div class="mb-4">
            <range-picker title="Lightness Range Limit" v-model="options.lightnessRangeLimit" :min="50" :max="100"/>
          </div>
          <div class="mb-4">
            <range-picker title="Max Lightness %" v-model="options.maxLightness" :min="50" :max="100"/>
          </div>
          <div class="mb-4">
            <range-picker title="Min Lightness %" v-model="options.minLightness" :min="0" :max="50"/>
          </div>-->
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
import convert from 'color-convert'
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
      baseColorEdit: {
        hsl: {
          h: null,
          s: null,
          l: null,
        },
      },
      options: {},
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
    baseColor() {
      let hsl = convert.hex.hsl(this.initial)
      // let rgb = convert.hex.rgb(hex)

      if (this.baseColorEdit.hsl.h !== null && this.baseColorEdit.hsl.s !== null && this.baseColorEdit.hsl.l !== null) {
        hsl = [...Object.values(this.baseColorEdit.hsl)]
        // rgb = convert.hsl.rgb[hsl]
        // hex = convert.rgb.hex[rgb]
      }
      return { hsl }
      // return { hex, hsl, rgb }
    },
    result() {
      if (!Object.entries(this.options).length) {
        return {}
      }
      let hsl = this.baseColor.hsl

      // as readable as possible for now

      let edgeLimit = (100 - this.options.lightnessRangeLimit) / 2

      // get max lightness
      let maximum = 100 - edgeLimit > this.options.maxLightness ? this.options.maxLightness : 100 - edgeLimit
      let stepUp = maximum / 4
      stepUp = stepUp < 0 ? 0 : stepUp
      stepUp = stepUp > this.options.maxStepUp ? this.options.maxStepUp : stepUp

      // get min lightness
      let minimum = hsl[2] - edgeLimit < this.options.minLightness ? this.options.minLightness : hsl[2] - edgeLimit
      let stepDown = minimum / 4
      stepDown = stepDown < 0 ? 0 : stepDown
      stepDown = stepDown > this.options.maxStepDown ? this.options.maxStepDown : stepDown

      // console.log('lightness', hsl[2])
      // console.log('edgeLimit', edgeLimit)
      // console.log('right edgeLimit', 100 - edgeLimit)
      // console.log('left edgeLimit', hsl[2] - edgeLimit)
      // console.log('maxLightness', this.options.maxLightness)
      // console.log('minLightness', this.options.minLightness)
      // console.log('maximum', maximum)
      // console.log('minimum', minimum)
      // console.log('stepUp', stepUp)
      // console.log('stepDown', stepDown)
      // console.log('------')

      let shades = []

      for (let i = 4; i >= 1; i--) {
        let hslup = [hsl[0], hsl[1], hsl[2] + i * stepUp]
        shades.push({
          hex: convert.rgb.hex(convert.hsl.rgb(hslup)),
          hsl: hslup,
          rgb: convert.hsl.rgb(hslup),
        })
      }
      shades.push({
        hex: convert.rgb.hex(convert.hsl.rgb(hsl)),
        hsl,
        rgb: convert.hsl.rgb(hsl),
      })

      for (let i = 1; i < 5; i++) {
        let hsldown = [hsl[0], hsl[1], hsl[2] - i * stepDown]
        shades.push({
          hex: convert.rgb.hex(convert.hsl.rgb(hsldown)),
          hsl: hsldown,
          rgb: convert.hsl.rgb(hsldown),
        })
      }

      // Just in case hsl gets edited in the future.
      let rgb = convert.hsl.rgb(hsl)
      let hex = convert.rgb.hex(rgb)
      return {
        color: {
          hsl,
          rgb,
          hex,
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
    this.options = this.initialOptions()
    this.baseColorEdit.hsl.h = this.baseColor.hsl[0]
    this.baseColorEdit.hsl.s = this.baseColor.hsl[1]
    this.baseColorEdit.hsl.l = this.baseColor.hsl[2]
  },
  methods: {
    initialOptions() {
      return {
        maxStepUp: 10,
        maxStepDown: 10,
        minLightness: 50,
        maxLightness: 100,
        lightnessRangeLimit: 100,
      }
    },
    textColorFromBrightness(rgb) {
      // https://www.w3.org/TR/AERT/#color-contrast
      let brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000
      return brightness > 125 ? 'black' : 'white'
    },
    resetBaseColor() {
      let hsl = convert.hex.hsl(this.initial)
      this.baseColorEdit.hsl.h = hsl[0]
      this.baseColorEdit.hsl.s = hsl[1]
      this.baseColorEdit.hsl.l = hsl[2]
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

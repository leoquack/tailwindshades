<template>
  <div>

    <div class="mt-1 flex flex-wrap items-end">
      <div class="w-full lg:w-2/3">
        <div
          class="inline-block relative"
          v-for="(version, i) in versions"
          :key="'version-' + i"
        >
          <div
            class="inline-block px-1 text-red-500 text-xs cursor-pointer hover:bg-theme-300"
            title="Delete version (double D)"
            @click="deleteVersion(i)"
          >
            <i class="far fa-trash-alt"></i>
          </div>

          <div
            class="mr-1 py-1 px-2 text-center hover:bg-theme-300"
            :class="{ 'bg-theme-300': selectedVersion === i }"
            @click="changeVersion(i)"
          >

            <div v-for="(shade, j) in version.shades" :key="'shade-' + j">
              <div
                class="h-2 w-10 p-1 flex justify-center items-center"
                :style="'background-color: hsl(' + shade.hsl[0] + ', ' + shade.hsl[1] + '%, ' + shade.hsl[2] + '%); color:' + textColorFromLuminance(shade.rgb) + ';'"
              ></div>
            </div>

            <span
              class="text-xs"
              :class="{ 'font-bold': selectedVersion === i }"
            >{{ i + 1 }}</span>
          </div>
        </div>
      </div>
      <div class="w-full lg:w-1/3 text-right mb-2">
        <div
          class="btn btn-action bg-blue-700 text-white mr-2"
          @click="update"
          title="Update version (S)"
          v-if="selectedVersion !== null"
        ><i class="far fa-save"></i></div>
        <div
          class="btn btn-action bg-blue-500 text-white"
          @click="save"
          title="Save new version (N)"
        ><i class="far fa-plus-square"></i></div>
      </div>
    </div>

    <div class=" bg-theme-400 mb-8 rounded py-1 px-" v-if="result.shades && result.shades.length">
      <div class="flex flex-wrap">

        <div class="w-full sm:w-1/3 px-2 py-4">
          <div v-for="(shade, i) in result.shades" :key="'shade-' + i">
            <div
              class="h-12 p-1 flex justify-center items-center"
              :style="'background-color: hsl(' + shade.hsl[0] + ', ' + shade.hsl[1] + '%, ' + shade.hsl[2] + '%); color:' + textColorFromLuminance(shade.rgb) + ';'"
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
                Initial:
                <a class="underline text-blue-500 cursor-pointer" title="reset" @click="resetBaseColor">{{ color }}</a>
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
              <range-picker title="Hue" v-model="baseColorEdit.hsl.h" :min="0" :max="360"/>
            </div>
            <div class="mb-4">
              <range-picker title="Saturation" v-model="baseColorEdit.hsl.s" :min="0" :max="100"/>
            </div>
            <div class="mb-4">
              <range-picker title="Lightness" v-model="baseColorEdit.hsl.l" :min="0" :max="100"/>
            </div>
          </div>
        </div>

        <div class="w-full sm:w-1/3 px-2 py-4">
          <div class="mb-4">
            <p class="text-2xl">Shades</p>
          </div>
          <div class="mb-4">
            <range-picker title="Max Step Up %" v-model="options.maxStepUp" :min="1" :max="20"/>
          </div>
          <div class="mb-4">
            <range-picker title="Max Step Down %" v-model="options.maxStepDown" :min="1" :max="20"/>
          </div>
          <!-- <div class="mb-4">
            <range-picker title="Lightness Range Limit" v-model="options.lightnessRangeLimit" :min="50" :max="100"/>
          </div>
          <div class="mb-4">
            <range-picker title="Max Lightness %" v-model="options.maxLightness" :min="50" :max="100"/>
          </div>
          <div class="mb-4">
            <range-picker title="Min Lightness %" v-model="options.minLightness" :min="0" :max="50"/>
          </div> -->
        </div>

        <div class="w-full sm:w-1/3 px-2 py-4" v-if="code.visible">
          <div class="w-64 mx-auto">
            <label class="block">Color name:</label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              v-model="code.name"
            >
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
import crypto from 'crypto'
import Noty from 'noty'

export default {
  props: {
    color: String,
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
        }
      },
      options: {},
      versions: [],
      maxVersions: 10,
      selectedVersion: null,
      code: {
        visible: true,
        name: '',
      },
      doubleKey: {
        t: null,
        d: 275,
        k: '',
      }
    }
  },
  computed: {
    codeDisplay() {
      if (!this.result.shades || !this.result.shades.length) {
        return {}
      }
      let shades = [
        `  default: '#${this.result.shades[4].hex}'`
      ]
      for (let i in this.result.shades) {
        shades.push(`  '${parseInt(i) + 1}00': '#${this.result.shades[i].hex}'`)
      }
      return `{\n${shades.join(',\n')}\n}`
    },
    baseColor() {
      // let hex = this.color
      let hsl = convert.hex.hsl(this.color)
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
      let maximum = (100 - edgeLimit) > this.options.maxLightness ? this.options.maxLightness : 100 - edgeLimit
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
        let hslup = [ hsl[0], hsl[1], hsl[2] + i * stepUp ]
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
        let hsldown = [ hsl[0], hsl[1], hsl[2] - i * stepDown ]
        shades.push({
          hex: convert.rgb.hex(convert.hsl.rgb(hsldown)),
          hsl: hsldown,
          rgb: convert.hsl.rgb(hsldown),
        })
      }

      // here in case hsl gets edited in the future
      let rgb = convert.hsl.rgb(hsl)
      let hex = convert.rgb.hex(rgb)
      return {
        color: {
          hsl,
          rgb,
          hex,
        },
        shades
      }
    }
  },
  mounted() {
    this.options = this.initialOptions()
    this.baseColorEdit.hsl.h = this.baseColor.hsl[0]
    this.baseColorEdit.hsl.s = this.baseColor.hsl[1]
    this.baseColorEdit.hsl.l = this.baseColor.hsl[2]

    document.addEventListener('keydown', this.keyboardInput)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.keyboardInput)
  },
  methods: {
    keyboardInput(event) {
      if (event.ctrlKey) {
        return
      }
      if (event.code === 'KeyS') {
        this.update()
        return
      }
      if (event.code === 'KeyN') {
        this.save()
        return
      }

      // change to version number
      if (event.key === '0') {
        if (this.versions.length < 10) {
          return
        }
        this.changeVersion(9)
        return
      } else if (event.key > 0 && event.key < this.maxVersions) {
        let version = parseInt(event.key)
        if (this.versions.length < version) {
          return
        }
        this.changeVersion(version - 1)
        return
      }

      // change version with arrows
      if (event.code === 'ArrowRight' && this.versions.length > this.selectedVersion + 1) {
        this.changeVersion(this.selectedVersion + 1)
      }
      if (event.code === 'ArrowLeft' && this.selectedVersion - 1 >= 0) {
        this.changeVersion(this.selectedVersion - 1)
      }

      // delete (double D)
      if (event.code === 'KeyD' && event.code === this.doubleKey.k) {
        this.doubleKey.k = ''
        this.deleteVersion(this.selectedVersion)
        return
      }
      this.doubleKey.k = event.code
      if (this.doubleKey.t) {
        clearTimeout(this.doubleKey.t)
      }
      this.doubleKey.t = setTimeout(() => {
        this.doubleKey.k = ''
      }, this.doubleKey.d)
    },
    deleteVersion(index) {
      this.versions.splice(index, 1)
      if (index - 1 >= 0) {
        this.changeVersion(index - 1)
      }
    },
    changeVersion(index) {
      this.selectedVersion = index
      // creating new when unsaved is not a good idea. (delete side effect)
      // let n = this.newVersion()
      // if (!this.versions.some(v => v.hash === n.hash)) {
      //   this.save()
      // }

      let version = this.versions[index]
      this.baseColorEdit.hsl = Object.assign({}, version.baseColorEdit.hsl)
      this.options = Object.assign({}, version.options)

    },
    newVersion() {
      let version = {
        baseColorEdit: {
          hsl: Object.assign({}, this.baseColorEdit.hsl)
        },
        options: Object.assign({}, this.options),
      }
      // no need for hmac
      let shasum = crypto.createHash('sha256')
      shasum.update(JSON.stringify(version))
      version.hash = shasum.digest('hex')
      return version
    },
    update() {
      if (this.selectedVersion === null) {
        return
      }
      let version = this.newVersion()
      let selected = this.versions[this.selectedVersion]
      selected.hash = version.hash
      this.$set(selected.baseColorEdit, 'hsl', version.baseColorEdit.hsl)
      this.$set(selected, 'options', version.options)
      this.$set(selected, 'shades', this.result.shades)
    },
    save() {
      if (this.versions.length + 1 > this.maxVersions) {
        new Noty({
          text: 'Max versions',
          timeout: 4000,
        }).show()
        return
      }
      let version = this.newVersion()

      version.shades = this.result.shades

      // no duplicates
      if (this.versions.some(v => v.hash === version.hash)) {
        return false
      }

      this.versions.push(version)
      this.selectedVersion = this.versions.length - 1
    },
    initialOptions() {
      return {
        lightnessRangeLimit: 100,
        maxStepUp: 5,
        maxStepDown: 5,
        minLightness: 50,
        maxLightness: 100,
      }
    },
    textColorFromLuminance(rgb) {
      // https://www.w3.org/TR/AERT/#color-contrast
      let lumi = (.299 * rgb[0] + .587 * rgb[1] + .114 * rgb[2]) / 255
      return lumi > .5 ? 'black' : 'white'
    },
    resetBaseColor() {
      let hsl = convert.hex.hsl(this.color)
      this.baseColorEdit.hsl.h = hsl[0]
      this.baseColorEdit.hsl.s = hsl[1]
      this.baseColorEdit.hsl.l = hsl[2]
    }
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
    }
  }
}
</script>

<template>
  <div>

    <div class=" bg-theme-lighter py-4 mb-4 text-theme">
      <div class="container">
        <div class="flex flex-wrap justify-between px-4 sm:px-0">
          <div>
            <div class="flex items-center text-white light:text-theme-darker">
              <span class="mr-2 text-xl leading-loose">
                <i class="fas fa-swatchbook"></i>
              </span>
              <h1 class="text-3xl mb-0 leading-none tracking-wide inline-block">
                tailwindshades
              </h1>
            </div>
            <p class="mt-0">
              A tool to help generate color shades for Tailwind CSS
            </p>
          </div>
          <div class="text-right mt-1 self-center flex items-center">
            <button
              type="button"
              class="btn focus:outline-none"
              :class="config.theme === 'light' ? 'bg-blue-400 text-blue-100' : 'border border-theme-600'"
              @click="changeTheme('light')"
            >
              Light
            </button>
            <button
              type="button"
              class="btn focus:outline-none ml-2"
              :class="config.theme === 'dark' ? 'bg-blue-600 text-white' : 'border border-theme-600'"
              @click="changeTheme('dark')"
            >
              Dark
            </button>
            <div class="inline-block ml-8">
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
    </div>

    <div class="container text-theme">

      <div v-if="!colors.length">
        <div class="px-2">
          <div class="flex flex-wrap -mx-2 py-4 bg-theme-400">
            <div class="w-full md:w-2/3 px-2">
              <div class="flex flex-wrap items-center">
                <p class="text-2xl">Suggestions</p>
                <span class="ml-4 cursor-pointer hover:text-blue-500" @click="suggestionsRefresh = !suggestionsRefresh">
                  <i class="fas fa-sync"></i>
                </span>
              </div>
              <div class="flex h-64">
                <div
                  class="w-12 flex-grow mr-1 cursor-pointer"
                  :class="{ 'px-2 border-2 light:border-black': selectedSuggestion === suggestion}"
                  :style="'background-color:rgb(' + suggestion.rgb.join(',') + ';'"
                  v-for="(suggestion, i) in suggestions"
                  :key="'suggestion-' + i"
                  @click="selectedSuggestion = suggestion, focus = 'suggestion'"
                ></div>
              </div>
            </div>
            <div class="w-full md:w-1/3 px-2">
              <p class="text-2xl">Select manually</p>
              <input
                class="shadow appearance-none text-gray-500 border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline mb-2"
                type="text"
                placeholder="hex"
                v-model="hexinput"
                @focus="focus = 'input'"
              >
              <div @click="focus = 'vue-color'">
                <chrome-picker v-model="selection" :disable-alpha="true" :disable-fields="true"/>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mt-4 bg-theme-400 p-4" v-show="selected">
          <p class="text-2xl leading-none">
            Selected: <span class="font-bold">{{ selected }}</span>
          </p>
          <p class="text-xs">({{ focus }})</p>
          <button class="btn btn-blue mt-4" @click="addColor">Generate shades</button>
        </div>
      </div>

      <div v-else>
        <button class="btn btn-red text-xs" @click="clear">Start again</button>
      </div>

      <div v-for="(color, i) in colors" :key="'color-' + i">
        <color-shades :color="color"/>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Chrome } from 'vue-color'
import ColorShades from '@/components/ColorShades'
import convert from 'color-convert'

export default {
  components: {
    ChromePicker: Chrome,
    ColorShades,
  },
  metaInfo: {
    title: 'Tailwind Shades',
    meta: [
      { name: 'description', content: 'A tool to help generate color shades for Tailwind CSS.' },
    ],
  },
  data() {
    return {
      selection: {},
      hexinput: '',
      colors: [],
      randomizer: {
        lightnessRange: [45, 55],
        saturationRange: [20, 65],
        dupeTolerance: 20, // hue
      },
      suggestionsRefresh: true,
      selectedSuggestion: null,
      focus: null,
    }
  },
  computed: {
    selected() {
      if (this.focus === 'suggestion' && this.selectedSuggestion) {
        return '#' + convert.rgb.hex(this.selectedSuggestion.rgb)
      }
      if (this.focus === 'input' && this.hexinput) {
        // validate
        let input = this.hexinput
        if (input.charAt(0) !== '#') {
          input = '#' + input
        }
        if (false === /^#[0-9A-F]{6}$/i.test(input)) {
          return 'invalid'
        }
        return input
      }
      if (this.focus === 'vue-color' && this.selection) {
        return this.selection.hex
      }
      return null
    },
    suggestions() {
      this.suggestionsRefresh
      let colors = []
      for (let i = 0; i < 10; i++) {
        let color = this.randomSuggestion(colors)
        colors.push(color)
      }
      return colors
    },
    ...mapGetters({
      config: 'config/config',
    })
  },
  methods: {
    randomSuggestion(colors) {
      let hue = Math.floor(Math.random() * 360)
      // check duplicate hue (as simple as possible for now)
      if (colors.some(c => Math.abs(c.hsl.h - hue) < this.randomizer.dupeTolerance)) {
        return this.randomSuggestion(colors)
      }
      let lr = this.randomizer.lightnessRange[1] - this.randomizer.lightnessRange[0]
      let lightness = 0
      if (lr > 0) {
        lightness = this.randomizer.lightnessRange[0] + Math.floor(Math.random() * lr)
      }
      let sr = this.randomizer.saturationRange[1] - this.randomizer.saturationRange[0]
      let saturation = 0
      if (sr > 0) {
        saturation = this.randomizer.saturationRange[0] + Math.floor(Math.random() * sr)
      }
      let hsl = { h: hue, s: saturation, l:lightness }
      return {
        hsl,
        rgb: convert.hsl.rgb(Object.values(hsl))
      }
    },
    clear() {
      this.colors = []
    },
    addColor() {
      if (!this.selected || this.selected === 'invalid') {
        return
      }
      // pass hex only
      this.colors.push(this.selected)
    },
    changeTheme(theme) {
      this['config/changeTheme'](theme)
    },
    ...mapActions([
      'config/changeTheme'
    ]),
    track () {
      this.$ga.page('/')
    }
  }
}
</script>

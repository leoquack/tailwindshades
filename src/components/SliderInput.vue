<template>
  <div>
    <label
      class="block text-xs select-none"
      :class="numberInputEnabled ? 'ml-1 font-bold' : 'text-center font-normal'"
      v-if="!slim"
    >
      {{ title }}
      <span
        class="font-normal"
        v-if="numberInputEnabled"
      >{{ min }} - {{ max }}</span>
      <span
        class="font-normal"
        v-else
      >{{ Number(value).toFixed(2) }}</span>
    </label>
    <div class="flex flex-wrap relative">
      <input
        v-if="numberInputEnabled"
        class="appearance-none rounded-full w-12 px-1 text-xs text-theme-lighter mr-1 bg-theme-600"
        :id="kebabTitle"
        type="number"
        :value="value"
        :min="min"
        :max="max"
        @input="$emit('input', parseInt($event.target.value))"
      >
      <div class="flex flex-grow items-center">
        <div
          class="mr-1 text-theme-200 light:text-theme-800 hover:text-blue cursor-pointer rounded-lg text-xs"
          v-if="slim"
          @click="step(-1)"
        >
          <i class="fas fa-angle-left"></i>
        </div>
        <div
          v-if="slim"
          style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"
          class="select-none text-xs pointer-events-none text-theme-300 light:text-theme-800"
        >{{ title }}</div>
        <input
          class="flex-grow"
          :class="{ 'slim': slim }"
          :id="kebabTitle + '-range'"
          type="range"
          :min="min"
          :max="max"
          :value="value"
          @input="$emit('input', parseInt($event.target.value))"
        >
        <div
          class="ml-1 text-theme-200 light:text-theme-800 hover:text-blue cursor-pointer rounded-lg text-xs"
          v-if="slim"
          @click="step(1)"
        >
          <i class="fas fa-angle-right"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'slider-input',
  props: {
    title: String,
    value: Number,
    min: Number,
    max: Number,
    numberInputEnabled: {
      type: Boolean,
      default: true,
    },
    slim: Boolean,
  },
  computed: {
    kebabTitle() {
      return this.toKebabCase(this.title)
    },
  },
  methods: {
    step(amount) {
      let newValue = this.value + amount
      if (newValue >= this.min && newValue <= this.max) {
        this.$emit('input', newValue)
      }
    },
    toKebabCase(str) {
      return str
        .match(/[A-Z]{2,}(?=[A-Z][a-z0-9]*|\b)|[A-Z]?[a-z0-9]*|[A-Z]|[0-9]+/g)
        .filter(Boolean)
        .map(x => x.toLowerCase())
        .join('-')
    },
  },
}
</script>

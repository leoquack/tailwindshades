<template>
  <div>
    <label class="block text-sm font-bold" :for="kebabTitle">
      {{ title }}
      <span class="text-xs text-theme-darker light:text-theme-lighter">{{ min }} - {{ max }}</span>
    </label>
    <div class="flex flex-wrap">
      <input
        class="shadow appearance-none border rounded w-full sm:w-2/12 mb-1 sm:mb-0 py-2 px-3 sm:px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        :id="kebabTitle"
        type="number"
        :value.sync="value"
        :min="min"
        :max="max"
        @input="$emit('input', parseInt($event.target.value))"
      >
      <input
        class="shadow appearance-none border rounded w-full sm:w-10/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none"
        :id="kebabTitle + '-range'"
        type="range"
        :min="min"
        :max="max"
        :value.sync="value"
        @input="$emit('input', parseInt($event.target.value))"
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'ranger-picker',
  props: {
    title: String,
    value: Number,
    min: Number,
    max: Number,
  },
  computed: {
    kebabTitle() {
      return this.toKebabCase(this.title)
    }
  },
  methods: {
    toKebabCase(str) {
      return str.match(/[A-Z]{2,}(?=[A-Z][a-z0-9]*|\b)|[A-Z]?[a-z0-9]*|[A-Z]|[0-9]+/g)
        .filter(Boolean)
        .map(x => x.toLowerCase())
        .join('-')
    }
  }
}
</script>

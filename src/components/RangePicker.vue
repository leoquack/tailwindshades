<template>
  <div>
    <label class="block font-bold text-xs select-none ml-1">
      {{ title }}
      <span class="font-normal">{{ min }} - {{ max }}</span>
    </label>
    <div class="flex flex-wrap">
      <input
        class="appearance-none rounded-full w-12 px-1 text-xs text-theme-lighter mr-1 bg-theme-600"
        :id="kebabTitle"
        type="number"
        :value="value"
        :min="min"
        :max="max"
        @input="$emit('input', parseInt($event.target.value))"
      >
      <input
        class="flex-grow"
        :id="kebabTitle + '-range'"
        type="range"
        :min="min"
        :max="max"
        :value="value"
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
    },
  },
  methods: {
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

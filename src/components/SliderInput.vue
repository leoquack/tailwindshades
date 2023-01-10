<template>
  <div class="select-none">
    <div
      class="block text-xs select-none"
      :class="numberInputEnabled ? 'ml-1 font-bold' : 'text-center font-normal'"
      v-if="!slim"
    >
      <slot></slot>
      {{ title }}
      <span
        class="font-normal"
        v-if="numberInputEnabled"
      >{{ min }} - {{ max }}</span>
      <span
        class="font-normal"
        v-else
      >{{ Number(modelValue).toFixed(2) }}</span>
    </div>
    <div class="flex flex-wrap relative">
      <input
        v-if="numberInputEnabled"
        class="appearance-none rounded-full w-12 px-1 text-xs text-theme-lighter mr-1 bg-theme-600"
        :id="kebabTitle"
        type="number"
        :value="modelValue"
        :min="min"
        :max="max"
        @change="$emit('update:modelValue', parseInt($event.target.value))"
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
        >{{ title }}: {{ Number(modelValue).toFixed(0) }}</div>
        <input
          class="flex-grow"
          :class="{ 'slim': slim }"
          :id="kebabTitle + '-range'"
          type="range"
          :min="min"
          :max="max"
          :value="modelValue"
          @change="$emit('update:modelValue', parseInt($event.target.value))"
        >
        <div
          class="ml-1 text-theme-200 light:text-theme-800 hover:text-blue cursor-pointer rounded-lg text-xs"
          v-if="slim"
          @click="step(1)"
        >
          <i class="fas fa-angle-right"></i>
        </div>
        <div
          class="ml-1 text-theme-200 light:text-theme-800 hover:text-blue cursor-pointer rounded-lg text-xs"
          v-if="restorable"
          @click="modelValue = restoreValue"
        >
          <i class="fas fa-undo"></i>
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
    modelValue: Number,
    min: Number,
    max: Number,
    numberInputEnabled: {
      type: Boolean,
      default: true,
    },
    slim: Boolean,
    restorable: Boolean,
    restoreTo: Number,
  },
  data() {
    return {
      initialValue: null,
    }
  },
  computed: {
    kebabTitle() {
      return this.toKebabCase(this.title)
    },
    restoreValue() {
      if (isNaN(this.restoreTo)) {
        return this.initialValue
      }
      return Number(this.restoreTo)
    },
  },
  mounted() {
    this.initialValue = this.modelValue
  },
  methods: {
    step(amount) {
      let newValue = this.modelValue + amount
      if (newValue >= this.min && newValue <= this.max) {
        this.$emit('update:modelValue', newValue)
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

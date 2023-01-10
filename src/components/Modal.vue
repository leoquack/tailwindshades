<template>
  <div
    class="fixed top-0 left-0 w-screen h-screen flex justify-center items-center py-8 z-50 overflow-y-auto"
    v-show="!!modelValue"
  >

    <div
      class="fixed top-0 left-0 w-full h-full bg-theme-900 z-0 opacity-90"
      @click.stop="$emit('update:modelValue', !modelValue)"
    ></div>

    <div
      class="shadow-md bg-theme m-4 py-2 px-4 z-10 rounded"
      :class="{
        'w-full sm:w-3/12': size === 'small',
        'w-full sm:w-6/12': size === 'medium',
        'w-full sm:w-9/12': size === 'large',
        'w-11/12': size === 'full',
      }"
    >
      <div
        class="bg-theme-400 -mx-4 -mt-2 py-3 px-8 text-center font-bold text-xl"
        name="title"
      >
        <slot name="title"></slot>
      </div>
      <slot v-if="!!modelValue"></slot>
    </div>

  </div>
</template>

<script>
export default {
  name: 'modal-component',
  props: {
    modelValue: {},
    size: {
      type: String,
      default: 'full',
    },
  },
  data() {
    return {}
  },
  watch: {
    modelValue() {
      if (this.modelValue) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'visible'
      }
    },
  },
  beforeUnmount() {
    document.body.style.overflow = 'visible'
  },
}
</script>

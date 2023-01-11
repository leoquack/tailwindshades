<template>
  <div class="mt-8">
    <p class="text-left" :class="{ 'text-sm': small }">{{ title }}</p>
    <div class="flex" :class="small ? 'mt-1' : 'mt-2'">
      <div
        v-for="stop in stops"
        :key="'base-stop-' + stop"
        class="flex-grow bg-theme-600 cursor-pointer select-none text-sm text-center"
        :class="[
          small ? 'py-1' : 'py-2',
          { 'bg-theme-800': baseShadeStop === stop },
        ]"
        @click="$emit('set', stop)"
      >
        {{ stop * 100 }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Move base stop (default 500)',
    },
    baseShadeStop: Number,
    small: Boolean,
  },
  data() {
    return {
      stops: [0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    }
  },
}
</script>

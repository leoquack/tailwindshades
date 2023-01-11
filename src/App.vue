<template>
  <div id="root" :class="'theme-' + theme">
    <notifications position="bottom right" />

    <div class="flex flex-col min-h-full">
      <div class="bg-theme-lighter px-4 py-3 text-theme flex-shrink">
        <div class="flex flex-wrap justify-between items-center">
          <div
            class="text-lg md:text-2xl font-black mb-0 leading-none tracking-wide inline-block logo-text"
          >
            <router-link v-if="$route.path != '/'" to="/"
              >tailwindshades</router-link
            >
            <p v-else>tailwindshades</p>
          </div>
          <div class="w-2/3 text-right flex justify-end items-center">
            <UserControl v-if="loginFeatures" class="text-left mr-6" />
            <div
              class="btn bg-theme-500 hover:bg-theme-700 select-none"
              @click="toggleTheme"
            >
              <i class="text-xl fas fa-moon" v-if="theme === 'light'"></i>
              <svg
                v-show="theme === 'dark'"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                width="20px"
                height="20px"
                fill="#ffffff"
              >
                <path
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                ></path>
              </svg>
            </div>

            <div class="inline-block ml-2 md:ml-8">
              <a
                href="https://github.com/leoquack/tailwindshades"
                class="text-2xl cursor-pointer"
                target="_blank"
              >
                <svg
                  viewBox="0 0 1024 1024"
                  class="h-8 w-8 light:text-[#1B1F23] dark:text-[#f0f6fc]"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
                    transform="scale(64)"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <router-view class="flex-grow" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserControl from '@/components/UserControl.vue'

export default {
  name: 'app',
  components: {
    UserControl,
  },
  data() {
    return {
      isProduction: import.meta.env.PROD,
    }
  },
  computed: {
    ...mapGetters(['theme', 'loginFeatures']),
  },
  methods: {
    toggleTheme() {
      this.$store.commit('setTheme', this.theme === 'light' ? 'dark' : 'light')
    },
  },
}
</script>

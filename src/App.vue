<template>
  <div
    id="root"
    :class="'theme-' + theme"
  >

    <notifications position="bottom right" />

    <div class="flex flex-col min-h-full">
      <div class="bg-theme-lighter px-4 py-3 text-theme flex-shrink">
        <div class="flex flex-wrap justify-between items-center">
          <div class="text-lg md:text-2xl font-black mb-0 leading-none tracking-wide inline-block logo-text">
            <router-link
              v-if="$route.path != '/'"
              to="/"
            >tailwindshades</router-link>
            <p v-else>tailwindshades</p>
          </div>
          <div class="w-2/3 text-right flex justify-end items-center">
            <UserControl
              v-if="!isProduction"
              class="text-left mr-6"
            />
            <div
              class="btn bg-theme-500 hover:bg-theme-700"
              @click="toggleTheme"
            >
              <i
                class="text-xl fas fa-moon"
                v-if="theme === 'light'"
              ></i>
              <svg
                v-show="theme === 'dark'"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                width="20px"
                height="20px"
                fill="#ffffff"
              >
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"></path>
              </svg>
            </div>

            <div class="inline-block ml-2 md:ml-8">
              <a
                href="https://github.com/anheric/tailwindshades"
                class="text-2xl cursor-pointer text-theme-lighter hover:text-theme"
                target="_blank"
              >
                <img
                  src="/icon/github.svg"
                  alt="Github logo"
                  class="h-8"
                >
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
import UserControl from '@/components/UserControl'

export default {
  name: 'app',
  components: {
    UserControl,
  },
  data() {
    return {
      isProduction: process.env.NODE_ENV === 'production',
    }
  },
  computed: {
    ...mapGetters(['theme']),
  },
  methods: {
    toggleTheme() {
      this.$store.commit('setTheme', this.theme === 'light' ? 'dark' : 'light')
    },
  },
}
</script>


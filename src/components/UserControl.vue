<template>
  <div>
    <ModalComponent
      v-model="modal.active"
      size="small"
    >
      <div
        slot="title"
        class="text-sm"
      >Authentication</div>
      <div class="flex flex-col p-4 select-none">
        <div
          class="flex items-center mt-3 rounded-lg py-2 px-4 cursor-pointer"
          style="background-color:#333"
          @click="signIn3rdParty('github')"
        >
          <img
            src="/icon/github.svg"
            alt="Github logo"
            class="h-8 mr-4"
          >
          <span>Login with Github</span>
        </div>
        <div
          class="flex items-center mt-4 rounded-lg py-2 px-4 cursor-pointer bg-white text-black"
          @click="signIn3rdParty('google')"
        >
          <img
            src="/icon/google.svg"
            alt="Google logo"
            class="h-8 mr-4"
          >
          <span>Login with Google</span>
        </div>
      </div>
    </ModalComponent>

    <div
      class="btn bg-theme-500 hover:bg-theme-700"
      @click="modal.active = true"
      v-if="!isLoggedIn"
    >Login</div>

    <div v-if="isLoggedIn">
      <DropdownComponent placement="right">
        <div
          slot="button"
          class="flex items-center"
        >
          <img
            v-if="user.user_metadata.avatar_url"
            class="w-8 h-8 rounded-full border border-theme-500 mr-3"
            :src="user.user_metadata.avatar_url"
          />
          <i
            v-else
            class="text-3xl fas fa-user-circle mr-3"
          ></i>

          <span class="mr-2 text-sm">{{ user.user_metadata.full_name }}</span>

          <svg
            class="w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="#222222"
          >
            <path d="M4.516 7.548c.436-.446 1.043-.481 1.576 0L10 11.295l3.908-3.747c.533-.481 1.141-.446 1.574 0 .436.445.408 1.197 0 1.615-.406.418-4.695 4.502-4.695 4.502a1.095 1.095 0 0 1-1.576 0S4.924 9.581 4.516 9.163c-.409-.418-.436-1.17 0-1.615z" />
          </svg>
        </div>

        <div slot="content">
          <div class="px-3 py-2 my-1 cursor-pointer rounded hover:bg-purple-500 hover:text-white">My colors</div>

          <div
            class="px-3 py-1 text-xs mb-1 mt-4 cursor-pointer rounded hover:bg-theme-500 hover:text-white"
            @click="signOut"
          >
            <i class="fas fa-sign-out-alt mr-2"></i>
            Logout
          </div>
        </div>
      </DropdownComponent>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ModalComponent from '@/components/Modal'
import DropdownComponent from '@/components/Dropdown'

export default {
  components: {
    ModalComponent,
    DropdownComponent,
  },
  data() {
    return {
      modal: {
        active: false,
      },
    }
  },
  computed: {
    ...mapGetters(['user']),
    isLoggedIn() {
      if (!this.user) {
        return false
      }
      return Object.entries(this.user).length > 0
    },
  },
  methods: {
    async signIn3rdParty(provider) {
      const { error } = await this.$supabase.auth.signIn({
        provider,
      })
      if (error) {
        console.log(`there was an error in sign in with ${provider}`, error)
        return
      }
    },
    async signOut() {
      const { error } = await this.$supabase.auth.signOut()
      if (error) {
        console.log('there was an error in sign out', error)
        return
      }

      this.$store.commit('setUser', {})
    },
  },
}
</script>

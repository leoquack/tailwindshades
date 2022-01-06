<template>
  <div>
    <ModalComponent
      v-model="modal.active"
      size="small"
    >
      <div slot="title">Authentication</div>
      <div class="flex flex-col p-4">
        <div
          class="flex items-center mt-4 rounded-lg py-2 px-4 cursor-pointer bg-white text-black"
          @click="signInWithGoogle"
        >
          <img
            src="/icon/google.svg"
            alt="Google logo"
            class="h-8 mr-4"
          >
          <span>Login with Google</span>
        </div>
        <div
          class="flex items-center mt-6 rounded-lg py-2 px-4 cursor-pointer"
          style="background-color:#333"
        >
          <img
            src="/icon/github.svg"
            alt="Github logo"
            class="h-8 mr-4"
          >
          <span>Login with Github</span>
        </div>
      </div>
    </ModalComponent>

    <div @click="modal.active = true">Login</div>
  </div>
</template>

<script>
import ModalComponent from '@/components/Modal'

export default {
  components: {
    ModalComponent,
  },
  data() {
    return {
      modal: {
        active: true,
      },
    }
  },
  mounted() {
    const test = this.$supabase.auth.user()
    console.log('test', test)
  },
  methods: {
    async signInWithGoogle() {
      const { user, session, error } = await this.$supabase.auth.signIn({
        provider: 'google',
      })

      if (error) {
        console.log('there was an error', error)
      }
      console.log('login', user, session)
    },
  },
}
</script>

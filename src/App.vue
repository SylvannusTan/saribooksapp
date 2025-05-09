<template>
  <div class="container">
    <h1>Sari Books App</h1>
    <p>Welcome to the Sari Books App! This is a minimal version to ensure proper deployment.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from './lib/supabase'

const router = useRouter()
const user = ref(null)

const setUser = async () => {
  const { data } = await supabase.auth.getUser()
  user.value = data?.user
}

onMounted(async () => {
  await setUser()

  supabase.auth.onAuthStateChange(async (event, session) => {
    user.value = session?.user || null

    if (event === 'SIGNED_IN' && user.value) {
      router.push('/dashboard')
    } else if (event === 'SIGNED_OUT') {
      router.push('/')
    }
  })
})

const handleSignOut = async () => {
  try {
    await supabase.auth.signOut()
    router.push('/')
  } catch (error) {
    console.error('Error signing out:', error.message)
  }
}
</script>

<style>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  text-align: center;
}

h1 {
  color: #1976D2;
}
</style>

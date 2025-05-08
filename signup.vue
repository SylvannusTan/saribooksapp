<template>
    <v-container class="fill-height" fluid>
      <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="pa-4" elevation="8">
            <v-card-title class="text-h5 text-center text-primary">Sign Up</v-card-title>
            <v-form @submit.prevent="signUp">
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                prepend-icon="mdi-email"
                required
              />
              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                prepend-icon="mdi-lock"
                required
              />
              <v-btn block color="primary" type="submit">Create Account</v-btn>
            </v-form>
            <v-divider class="my-4"></v-divider>
            <p class="text-center">
              Already have an account?
              <RouterLink to="/login" class="text-primary">Log in</RouterLink>
            </p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { supabase } from '@/lib/supabase'
  import { useRouter } from 'vue-router'
  
  const email = ref('')
  const password = ref('')
  const router = useRouter()
  
  const signUp = async () => {
    const { error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    })
    if (error) {
      alert(error.message)
    } else {
      alert('Check your email to confirm your account.')
      router.push('/login')
    }
  }
  </script>
  
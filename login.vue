<template>
    <v-container class="fill-height" fluid>
      <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="pa-4" elevation="8">
            <v-card-title class="text-h5 text-center text-primary">Log In</v-card-title>
            <v-form @submit.prevent="login">
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
              <v-btn block color="primary" type="submit">Log In</v-btn>
            </v-form>
            <v-divider class="my-4"></v-divider>
            <p class="text-center">
              Don't have an account?
              <RouterLink to="/signup" class="text-primary">Sign up</RouterLink>
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
  
  const login = async () => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })
    if (error) {
      alert(error.message)
    } else {
      router.push('/dashboard')
    }
  }
  </script>
  
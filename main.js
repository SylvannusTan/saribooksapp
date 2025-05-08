import { createApp } from 'vue'
import App from './App.vue'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'greenTheme',
    themes: {
      greenTheme: {
        dark: false,
        colors: {
          background: '#f1fdf5',
          surface: '#e0f2e9',
          primary: '#4CAF50',
          secondary: '#81C784',
          accent: '#A5D6A7',
          error: '#E57373',
        },
      },
    },
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})

const app = createApp(App)
app.use(vuetify)
app.mount('#app')

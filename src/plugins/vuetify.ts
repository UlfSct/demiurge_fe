import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import { aliases, md } from 'vuetify/iconsets/md'

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'md',
    aliases,
    sets: {
      md,
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          'gold-accent': '#d4af37',
          'gold-accent-light': '#8b7355',
          'brown-primary': '#2c1810',
          'brown-dark-shades': '#1a0f0a',
        },
      },
    },
  },
})

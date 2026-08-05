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
    defaultTheme: 'dark',
    themes: {
      light: {
        colors: {
          'gold-accent': '#D4AF37',
          'gold-light': '#E6C34A',
          'gold-dark': '#8B7355',

          'brown-primary': '#2C1810',
          'brown-secondary': '#1E1109',
          'brown-dark': '#1A0F0A',

          'text-light': '#C4B5A5',
          'text-gold': '#D4AF37',
          'text-muted': '#8B7355',
          'text-error': '#CC4444',

          'bg-primary': '#1A0F0A',
          'bg-secondary': '#2C1810',
          'bg-tertiary': '#1E1109',

          'border-default': 'rgba(212, 175, 55, 0.2)',
          'border-hover': 'rgba(212, 175, 55, 0.4)',
          'border-focus': 'rgba(212, 175, 55, 0.6)',

          'red-accent': '#CC4444',

          surface: '#2C1810',
          background: '#1A0F0A',
          primary: '#D4AF37',
          secondary: '#8B7355',
          error: '#CC4444',
          'on-surface': '#C4B5A5',
          'on-background': '#C4B5A5',
          'on-primary': '#2C1810',
          'on-secondary': '#2C1810',
          'on-error': '#FFFFFF',
        },
      },
    },
  },
})

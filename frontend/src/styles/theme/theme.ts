// Theme Tokens
// Centralized styling tokens mapped to the CSS variables in index.css

export const colors = {
  primary: {
    burgundy: 'var(--color-burgundy)',
    burgundyDark: 'var(--color-burgundy-dark)',
  },
  accent: {
    cheese: 'var(--color-cheese)',
    cheeseDark: 'var(--color-cheese-dark)',
    tomato: 'var(--color-tomato)',
  },
  neutral: {
    cream: 'var(--color-cream)',
  },
  background: {
    charcoal: 'var(--color-charcoal)',
    charcoalLight: 'var(--color-charcoal-light)',
    charcoalDark: 'var(--color-charcoal-dark)',
    charcoalBlack: 'var(--color-charcoal-black)',
    charcoalGray: 'var(--color-charcoal-gray)',
    charcoalMuted: 'var(--color-charcoal-muted)',
    charcoalBorder: 'var(--color-charcoal-border)',
    pureBlack: 'var(--color-black-pure)',
  }
};

export const typography = {
  fonts: {
    sans: 'var(--font-sans)',
    display: 'var(--font-display)',
    script: 'var(--font-script)',
    mono: 'var(--font-mono)',
  }
};

export const theme = {
  colors,
  typography,
};

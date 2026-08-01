/* ==========================================================================
   ULC — Tailwind build config (Node / CLI)
   Mirrors assets/js/tailwind.config.js, which serves the same theme to the
   Play CDN during prototyping. Keep the two in sync — the tokens themselves
   live in assets/css/ulc.css as CSS custom properties.
   ========================================================================== */
module.exports = {
  content: [
    './index.html',
    './project.html',
    './projects/*.html',
    './assets/js/*.js',
  ],
  theme: {
    extend: {
      colors: {
        obsidian:  '#0B0708',
        ink:       '#16090B',
        line:      '#2E1A1C',
        maroon:    '#8B0000',
        maroonlift:'#A81212',
        gold:      '#FFD700',
        goldsoft:  '#FFE566',
        brown:     '#8B4513',
        brownsoft: '#CD8B4C',
        body:      '#ECE3E1',
        muted:     '#9A8B8C',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      letterSpacing: { eyebrow: '0.22em' },
      maxWidth: { content: '72rem' },
    },
  },
  plugins: [],
};

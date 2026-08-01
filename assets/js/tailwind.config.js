/* ==========================================================================
   ULC — Tailwind theme
   Mirrors the tokens in assets/css/ulc.css so utility classes in the markup
   (bg-obsidian, text-gold, border-line …) stay in sync with the components.

   Prototype: loaded after the Play CDN, which re-renders on config assignment.
   Production: rename to tailwind.config.js at the project root and build with
     npx tailwindcss -i assets/css/ulc.css -o dist/ulc.min.css --minify
   ========================================================================== */

window.tailwind = window.tailwind || {};
window.tailwind.config = {
  content: ['./index.html', './project.html', './projects/*.html', './assets/js/*.js'],
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
};

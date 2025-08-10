// --- IMPORTANT ---
// This file MUST be named `postcss.config.cjs`
// It uses the CommonJS module syntax (`module.exports`) which is required for .cjs files.
// This will resolve the "Unexpected token 'export'" error.

module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};


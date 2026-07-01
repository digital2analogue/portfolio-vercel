import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescript from 'eslint-config-next/typescript'

const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'test-results/**', 'playwright-report/**'],
  },
  {
    rules: {
      // The terminal aesthetic renders literal "//" glyphs as decorative
      // (aria-hidden) text — not accidental code comments.
      'react/jsx-no-comment-textnodes': 'off',
      // Prose-heavy site; raw apostrophes in JSX copy are intentional.
      'react/no-unescaped-entities': 'off',
    },
  },
]

export default eslintConfig

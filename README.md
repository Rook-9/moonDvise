# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## API Setup

Create a `.env` file in the project root and add:

```bash
VITE_ASTROLOGER_API=your_astrologer_api_key_here
VITE_OPENCAGE_API=your_opencage_api_key_here
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

### Required API Keys:

1. **VITE_ASTROLOGER_API**: Your RapidAPI key for the Astrologer API (https://rapidapi.com/astrologer-api-astrologer-api-default/api/astrologer/)
2. **VITE_OPENCAGE_API**: Your OpenCage API key (optional fallback for geocoding)
3. **VITE_OPENAI_API_KEY**: Your OpenAI API key for cosmic analysis (https://platform.openai.com/api-keys)

### Services Used:

- **Nominatim** (OpenStreetMap): Primary geocoding service (free, no API key required)
- **geo-tz**: Timezone resolution from coordinates
- **Astrologer API**: Synastry aspects calculation
- **OpenCage**: Fallback geocoding service (if Nominatim fails)
- **OpenAI GPT-4o-mini**: Cosmic career analysis and interpretation

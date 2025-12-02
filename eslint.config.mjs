import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import nextPlugin from '@next/eslint-plugin-next'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import importPlugin from 'eslint-plugin-import'
import unicornPlugin from 'eslint-plugin-unicorn'
import tailwindPlugin from 'eslint-plugin-tailwindcss'
import prettierConfig from 'eslint-config-prettier'
import globals from 'globals'

const TAILWIND_RULES = {
  'tailwindcss/classnames-order': 'off',
  'tailwindcss/enforces-negative-arbitrary-values': 'error',
  'tailwindcss/enforces-shorthand': 'error',
  'tailwindcss/migration-from-tailwind-2': 'error',
  'tailwindcss/no-custom-classname': 'error',
}

export default tseslint.config(
  // Global ignores
  {
    ignores: [
      'next-env.d.ts',
      '.next/**',
      'node_modules/**',
      'out/**',
      '.eslintcache',
    ],
  },

  // Base ESLint recommended rules
  eslint.configs.recommended,

  // TypeScript ESLint recommended rules
  ...tseslint.configs.recommended,

  // Next.js plugin
  {
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },

  // Prettier config (disables conflicting rules)
  prettierConfig,

  // Rules for all JS/TS files
  {
    files: ['**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}'],
    plugins: {
      import: importPlugin,
      unicorn: unicornPlugin,
    },
    rules: {
      'prefer-object-has-own': 'error',
      'logical-assignment-operators': ['error', 'always', { enforceForIfStatements: true }],
      'no-else-return': ['error', { allowElseIf: false }],
      'no-lonely-if': 'error',
      'prefer-destructuring': ['error', { VariableDeclarator: { object: true } }],
      'import/no-duplicates': 'error',
      'no-negated-condition': 'off',
      'unicorn/no-negated-condition': 'error',
      'prefer-regex-literals': ['error', { disallowRedundantWrapping: true }],
      'object-shorthand': ['error', 'always'],
      'unicorn/prefer-regexp-test': 'error',
      'unicorn/no-array-for-each': 'error',
      'unicorn/prefer-string-replace-all': 'error',
      '@typescript-eslint/prefer-for-of': 'error',
      // todo: enable
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  // Rules for React files
  {
    files: ['components/**/*.{js,jsx,ts,tsx}', 'pages/**/*.{js,jsx,ts,tsx}', 'src/**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react/prop-types': 'off',
      'react/no-unknown-property': ['error', { ignore: ['jsx'] }],
      'react-hooks/exhaustive-deps': 'error',
      'react/self-closing-comp': 'error',
      'no-restricted-syntax': [
        'error',
        {
          // ❌ useMemo(…, [])
          selector:
            'CallExpression[callee.name=useMemo][arguments.1.type=ArrayExpression][arguments.1.elements.length=0]',
          message:
            "`useMemo` with an empty dependency array can't provide a stable reference, use `useRef` instead.",
        },
        {
          // ❌ z.object(…)
          selector: 'MemberExpression[object.name=z] > .property[name=object]',
          message: 'Use z.strictObject is more safe.',
        },
      ],
      'react/jsx-filename-extension': [
        'error',
        { extensions: ['.tsx', '.jsx'], allow: 'as-needed' },
      ],
      'react/jsx-curly-brace-presence': 'error',
      'react/jsx-boolean-value': 'error',
    },
  },

  // Rules for TypeScript files
  {
    files: ['**/*.{ts,tsx,cts,mts}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/non-nullable-type-assertion-style': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
    },
  },

  // Tailwind CSS rules for components and pages
  {
    files: ['components/**/*.{js,jsx,ts,tsx}', 'pages/**/*.{js,jsx,ts,tsx}', 'src/**/*.{js,jsx,ts,tsx}'],
    plugins: {
      tailwindcss: tailwindPlugin,
    },
    settings: {
      tailwindcss: {
        config: 'tailwind.config.js',
        callees: ['cn'],
      },
    },
    rules: {
      ...tailwindPlugin.configs.recommended.rules,
      ...TAILWIND_RULES,
    },
  },

  // Node.js config files
  {
    files: [
      '*.config.js',
      '*.config.mjs',
      '.prettierrc.js',
      'prettier.config.js',
      'postcss.config.js',
      'tailwind.config.js',
      'next.config.mjs',
      'eslint.config.mjs',
      'next-sitemap.config.js',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // Declaration files
  {
    files: ['**/*.d.ts'],
    rules: {
      'no-var': 'off',
    },
  },
)

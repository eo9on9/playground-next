import js from '@eslint/js'
import pluginNext from '@next/eslint-plugin-next'
import eslintConfigPrettier from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'

export default [
  /** ESLint 기본 권장 룰 */
  js.configs.recommended,

  /** 타입스크립트 권장 룰 */
  ...tseslint.configs.recommended,

  {
    /** 리액트 권장 룰 */
    ...pluginReact.configs.flat.recommended,
    /** 자동으로 React 버전 감지해서 적용 */
    settings: { react: { version: 'detect' } },
  },

  {
    plugins: {
      'react-hooks': pluginReactHooks,
      '@next/next': pluginNext,
      prettier: prettierPlugin,
    },
    rules: {
      /** 리액트 훅 권장 룰 */
      ...pluginReactHooks.configs.recommended.rules,
      /** Next 권장 룰 */
      ...pluginNext.configs.recommended.rules,
      /** Next Core Vital 권장 룰 */
      ...pluginNext.configs['core-web-vitals'].rules,
      /** Prettier 포맷팅 오류를 ESLint 오류로 처리 */
      'prettier/prettier': 'error',
      /** import React 룰 끔 */
      'react/react-in-jsx-scope': 'off',
    },
  },

  /** Prettier와 충돌할 수 있는 ESLint 포맷팅 룰 끔 */
  eslintConfigPrettier,

  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ],
  },
]

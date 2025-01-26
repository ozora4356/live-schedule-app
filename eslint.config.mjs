import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
  ),
  {
    rules: {
      // React
      'react/jsx-boolean-value': 'error', // booleanプロップの記法を強制
      'react/self-closing-comp': 'error', // 自己終了タグを強制
      // TypeScript
      '@typescript-eslint/no-unused-vars': [
        // 未使用変数の警告
        'error',
        {
          argsIgnorePattern: '^_', // _で始まる引数は無視
          varsIgnorePattern: '^_', // _で始まる変数は無視
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        // 型インポートの一貫性
        'error',
        {
          prefer: 'type-imports', // type importを強制
        },
      ],

      // Common
      'no-console': ['error', { allow: ['warn', 'error'] }], // console.logの警告
      eqeqeq: 'error', // 厳密等価演算子の強制
      'no-var': 'error', // varの使用を警告
      'prefer-const': 'error', // letよりconstを推奨
    },
  },
];

export default eslintConfig;

import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

export default [
    {
        ignores: ['lib/**', 'public/**', 'index.js', 'test/.coverage/**', 'test/bundles/**']
    },
    js.configs.recommended,
    importPlugin.flatConfigs.recommended,
    importPlugin.flatConfigs.typescript,
    {
        settings: {
            'import/resolver': {typescript: {}}
        }
    },
    {
        files: ['**/*.{js,mjs,cjs,ts}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: globals.node
        },
        rules: {
            quotes: [
                'error',
                'single',
                {
                    avoidEscape: true
                }
            ],

            'import/order': [
                'error',
                {
                    'newlines-between': 'always',
                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: false
                    }
                }
            ]
        }
    },
    {
        files: ['**/*.ts'],
        languageOptions: {parser: tsParser},
        plugins: {'@typescript-eslint': tsPlugin},
        rules: {
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'error',
            'no-undef': 'off',
            'no-dupe-class-members': 'off',
            'no-redeclare': 'off',
            '@typescript-eslint/no-redeclare': 'error'
        }
    },
    {
        files: ['src/@types/**/*.ts'],
        rules: {'@typescript-eslint/no-unused-vars': 'off'}
    }
];

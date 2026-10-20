import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

export default [
    {
        ignores: ['lib/**', 'public/**', 'index.js', 'test/.coverage/**', 'test/bundles/**']
    },
    js.configs.recommended,
    importPlugin.flatConfigs.recommended,
    {
        files: ['**/*.{js,mjs,cjs}'],
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
        files: [
            '**/*.spec.js',
            'test/**/*.js'
        ],
        languageOptions: {
            globals: globals.jest
        }
    }
];

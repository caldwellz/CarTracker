module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        allowImportExportEverywhere: true,
    },
    settings: { react: { version: '18.2' } },
    plugins: ['react-refresh'],
    extends: [
        'eslint:recommended',
        'plugin:n/recommended',
        'plugin:promise/recommended',
        'plugin:unicorn/all',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',
        'plugin:prettier/recommended',
    ],
    overrides: [
        {
            files: ['.eslintrc.{js,cjs}'],
            env: {
                node: true,
            },
            parserOptions: {
                sourceType: 'script',
            },
        },
        {
            files: ['*.test.js'],
            rules: {
                'n/no-unpublished-import': [
                    'error',
                    {
                        allowModules: ['chai', 'sinon', 'supertest'],
                    },
                ],
            },
        },
        {
            files: ['vite.config.js'],
            rules: {
                'n/no-unpublished-import': 'off',
            },
        },
    ],
    rules: {
        indent: ['warn', 4],
        'n/exports-style': [
            'warn',
            'module.exports',
            {
                allowBatchAssign: true,
            },
        ],
        'n/no-process-exit': 'off', // Use unicorn's version of this rule instead
        'n/prefer-promises/dns': 'warn',
        'n/prefer-promises/fs': 'warn',
        'no-constant-condition': ['error', { checkLoops: false }],
        'promise/prefer-await-to-then': 'warn',
        'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        'unicorn/catch-error-name': 'off',
        'unicorn/filename-case': [
            'warn',
            {
                cases: {
                    camelCase: true,
                    pascalCase: true,
                },
            },
        ],
        'unicorn/no-array-reduce': 'off',
        'unicorn/no-null': 'off',
        'unicorn/prevent-abbreviations': 'off',
    },
    ignorePatterns: ['dist'],
};

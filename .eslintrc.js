module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true
    },
    extends: 'standard',
    overrides: [
        {
            env: {
                node: true
            },
            files: [
                '.eslintrc.{js,cjs}'
            ],
            parserOptions: {
                sourceType: 'script'
            }
        }
    ],
    parserOptions: {
        ecmaVersion: 'latest'
    },
    rules: {
        indent: ['error', 4],
        semi: 'off',
        'space-before-function-paren': [
            'warn',
            {
                anonymous: 'always',
                named: 'never',
                asyncArrow: 'always',
                new: 'never'
            }
        ]
    }
}

module.exports = {
    extends: [
        '@tophat',
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
    ],
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
    },
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    rules: {
        'sort-imports': 2,
        'sort-keys': 2,
    },
};

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
        'import/internal-regex': '^@react-vector-graphics/',
    },
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    rules: {
        'sort-imports': 2,
        'sort-keys': 2,
    },
    ignorePatterns: ['lib/'],
}

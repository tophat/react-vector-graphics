module.exports = {
    extends: [
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
        '@tophat',
    ],
    ignorePatterns: ['lib/'],
    parser: '@typescript-eslint/parser',
    rules: {
        'sort-imports': 2,
        'sort-keys': 2,
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
        'import/internal-regex': '^@react-vector-graphics/',
    }
}

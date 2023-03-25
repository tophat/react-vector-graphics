module.exports = {
    extends: ['@tophat', '@tophat/eslint-config/jest'],
    parserOptions: {
        ecmaVersion: 2021,
        project: 'tsconfig.lint.json',
    },
}

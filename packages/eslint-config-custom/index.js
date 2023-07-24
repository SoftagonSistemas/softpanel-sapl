module.exports = {
    env: {
        browser: true,
        es2021: true,
        es6: true,
        node: true,
    },
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:nuxt/recommended',
        'plugin:vue/vue3-recommended',
        'plugin:prettier/recommended',
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
    },
    plugins: ['prettier', '@typescript-eslint'],
    rules: {
        // "@typescript-eslint/no-unsafe-assignment": "off",
        // "@typescript-eslint/restrict-template-expressions": "off",
        // "@typescript-eslint/no-unsafe-member-access": "off",
        // "@typescript-eslint/no-unsafe-return": "off",
        '@typescript-eslint/no-explicit-any': 1,
        // "@typescript-eslint/no-non-null-assertion": "off",
        // "vue/no-v-text-v-html-on-component": "off",
        // "vue/multi-word-component-names": "off",
        // "@typescript-eslint/no-unused-vars": "off",
        '@typescript-eslint/semi': 0,
        camelcase: 1,
    },
}

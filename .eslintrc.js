module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    jquery: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 13,
  },
  rules: {
    "class-methods-use-this": [1, { "enforceForClassFields": false }],
    'max-len': ["error", { "code": 150 }]
  },
};

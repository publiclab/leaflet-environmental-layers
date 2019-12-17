module.exports = {
  'env': {
    'browser': true,
  },
  'extends': [
    'google',
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
  },
  'parserOptions': {
    'ecmaVersion': 2018,
  },
  'rules': {
    "curly": ["error", "multi-line"],
    "brace-style": ["off", "1tbs", { "allowSingleLine": true }],
    "block-spacing": ["error", "always"],
    "no-var": 0,
    "new-cap": 0,
    "guard-for-in": 0,
    "max-len": ["warn", { "ignoreComments": true }],
    "prefer-const": 1,
    "valid-jsdoc": 0,
    "indent": ["error", 2],
    "camelcase": 0,
    "no-unused-vars": ["warn", { "vars": "local", "args": "none" }],
    "require-jsdoc": 0,
    "linebreak-style": 0
  },
};

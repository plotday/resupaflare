/** @type {import('eslint').Linter.Config} */
module.exports = {
  ignorePatterns: ["public/**", "functions/\\[\\[path\\]\\].js"],
  env: {
    node: true,
  },
};

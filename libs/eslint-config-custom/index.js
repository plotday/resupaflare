module.exports = {
  extends: ["@remix-run/eslint-config", "turbo", "prettier"],
  ignorePatterns: ["build/**", "dist/**", "node_modules/**"],
  plugins: ["react-hooks"],
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
};

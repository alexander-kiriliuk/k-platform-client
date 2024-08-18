module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  ignorePatterns: [
    "node_modules/",
    "dist/"
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@angular-eslint/recommended",
    "plugin:@angular-eslint/template/process-inline-templates",
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        ".eslintrc.{js,cjs}",
      ],
      parserOptions: {
        sourceType: "script",
      },
    },
    {
      files: ["*.html"],
      extends: [
        "plugin:@angular-eslint/template/recommended",
        "plugin:@angular-eslint/template/accessibility"
      ],
      parser: "@angular-eslint/template-parser",
      plugins: ["@angular-eslint/template"],
      rules: {
        "@angular-eslint/template/mouse-events-have-key-events": "off",
        "@angular-eslint/template/interactive-supports-focus": "off",
        "@angular-eslint/template/click-events-have-key-events": "off",
        "@angular-eslint/template/elements-content": "off",
        "@angular-eslint/template/no-autofocus": "off",
        "@angular-eslint/template/attributes-order": [
          "warn",
          {
            alphabetical: false,
            order: [
              "STRUCTURAL_DIRECTIVE",
              "TEMPLATE_REFERENCE",
              "ATTRIBUTE_BINDING",
              "INPUT_BINDING",
              "TWO_WAY_BINDING",
              "OUTPUT_BINDING"
            ]
          }
        ],
      }
    },
    {
      files: ["*.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      plugins: [
        "@typescript-eslint",
        "import-newlines",
        "html",
      ],
      rules: {
        "@typescript-eslint/no-unused-vars": [
          "warn", {
            varsIgnorePattern: '^_',
            argsIgnorePattern: '^_'
          }
        ],
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-namespace": "off",
        "import-newlines/enforce": ["error", {items: 40, "max-len": 100}],
        "max-len": [
          "error",
          {code: 115}
        ],
        "linebreak-style": [
          "error",
          "unix",
        ],
        quotes: [
          "error",
          "double",
        ],
        semi: [
          "error",
          "always",
        ],
        "comma-dangle": [
          "error",
          "only-multiline",
        ],
        "indent": ["error", 2, {
          "ImportDeclaration": 1,
          "flatTernaryExpressions": false
        }],
      },
    }
  ],
};

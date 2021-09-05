var OFF = 0, WARN = 1, ERROR = 2;

module.exports = exports = {
    "env": {
        "browser": true,
        "amd": true,
        "node": true,
        "es6": true
    },

    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],

    "parser": "@typescript-eslint/parser",

    "parserOptions": {
        "ecmaVersion": 8,
        "project": "./tsconfig.json",
        "sourceType": "module"
    },

    "plugins": [
        "@typescript-eslint/eslint-plugin",
        "import"
    ],

    "rules": {
        "indent": [ ERROR, 2, { SwitchCase: 1 } ],
        "max-len": [ ERROR, 210 ],
        "multiline-ternary": [ ERROR, "always-multiline" ],
        "no-dupe-class-members": OFF,
        "padding-line-between-statements": [ ERROR, { blankLine: "always", prev: "block-like", next: "*" }],
        "sort-imports": [ ERROR, {
            "ignoreCase": false,
            "ignoreDeclarationSort": false,
            "ignoreMemberSort": false,
            "memberSyntaxSortOrder": [ 'none', 'all', 'single', 'multiple' ]
        }],

        "@typescript-eslint/class-literal-property-style": [ ERROR, "getters" ],
        "@typescript-eslint/explicit-function-return-type": OFF,
        "@typescript-eslint/explicit-module-boundary-types": OFF,
        "@typescript-eslint/method-signature-style": ERROR,
        "@typescript-eslint/no-dupe-class-members": ERROR,
        "@typescript-eslint/no-explicit-any": OFF,
        "@typescript-eslint/no-extra-parens": ERROR,
        "@typescript-eslint/no-non-null-assertion": OFF,
        "@typescript-eslint/no-unnecessary-type-arguments": ERROR,
        "@typescript-eslint/no-unnecessary-type-assertion": ERROR,
        "@typescript-eslint/no-unused-vars": [ ERROR, { args: "none" }],
        "@typescript-eslint/prefer-reduce-type-parameter": ERROR,
        "@typescript-eslint/quotes": [ ERROR, 'single', { avoidEscape: false } ],
        "@typescript-eslint/semi": ERROR,

        "import/no-commonjs": [ ERROR, { allowRequire: true } ]
    }
};

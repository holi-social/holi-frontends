// see https://www.npmjs.com/package/@trivago/prettier-plugin-sort-imports
const importOrderPluginConfig = {
  "importOrder": [
    "^@apps/(.*)$",
    "^@core/(.*)$",
    "^@holi-apps/(.*)$",
    "<THIRD_PARTY_MODULES>",
    "^[./]" // Other imports
  ],
  "importOrderSeparation": true,
  "importOrderSortSpecifiers": true
}

export default {
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "printWidth": 120,
  ...importOrderPluginConfig
}

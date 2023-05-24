import { CodegenConfig } from '@graphql-codegen/cli'

const schema = process.env.UNIFIED_API_URL

const config: CodegenConfig = {
  schema,
  documents: ['core/**/*.{graphql, gql}', 'holi-apps/**/*.{graphql, gql}'],
  ignoreNoDocuments: true,
  generates: {
    'packages/api/graphql/types.ts': {
      plugins: ['typescript'],
      config: { maybeValue: 'T', scalars: { UUID: 'string' } },
    },
    '.': {
      preset: 'near-operation-file',
      presetConfig: {
        folder: '__generated__',
        extension: '.ts',
        baseTypesPath: '~@holi/api/graphql/types',
      },
      plugins: ['typescript-operations', 'typescript-react-apollo'],
      config: { withHooks: true, withMutationFn: true, withRefetchFn: false },
    },
  },
  hooks: {
    afterOneFileWrite: ['prettier --write'],
  },
}

export default config

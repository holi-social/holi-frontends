import fs from 'node:fs/promises'
import path from 'path'
import { CodegenConfig } from '@graphql-codegen/cli'

const schema = process.env.UNIFIED_API_SCHEMA_ENDPOINT
const filePath = 'packages/api/graphql/graphql-codegen.ts'

const config: CodegenConfig = {
  schema,
  documents: ['core/**/*.graphql', 'holi-apps/**/*.graphql'],
  ignoreNoDocuments: true,
  generates: {
    [`${filePath}`]: {
      plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
      config: {
        maybeValue: 'T',
        scalars: { UUID: 'string' },
        withHooks: true,
        withMutationFn: true,
        withRefetchFn: false,
        avoidOptionals: false,
        reactApolloVersion: 3,
      },
    },
  },
  hooks: {
    afterAllFileWrite: [addHeaderContent, 'yarn format'],
  },
}

export default config

/**
 * codegen Hooks
 */
const fileHeader = `
/**
 * @file NOT EDIT! Automatically generated code with \`@graphql-codegen\`.
 * If you need to develop the types of your Schema or queries and fragments for the front end,
 * execute \`yarn schema:generate\` or \`schema:watch\`.
 */
`
const eslintIgnore = `
/* eslint-disable @typescript-eslint/no-explicit-any */
`

async function addHeaderContent(): Promise<void> {
  try {
    const codeGenContent = await fs.readFile(path.resolve(__dirname, filePath), 'utf-8')
    const newContent = fileHeader + eslintIgnore + codeGenContent
    await fs.writeFile(path.resolve(__dirname, filePath), newContent)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error adding header content to generated file', error)
  }
}

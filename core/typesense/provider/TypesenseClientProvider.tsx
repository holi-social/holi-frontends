import { createTypesenseClient } from '@holi/core/typesense/helpers/createTypesenseClient'
import type React from 'react'
import { createContext, useContext } from 'react'

type TypesenseClient = ReturnType<typeof createTypesenseClient>

interface TypesenseClientContextType {
  client: TypesenseClient
}

const client = createTypesenseClient()

const TypesenseClientContext = createContext<TypesenseClientContextType>({ client })

export function useTypesenseClient() {
  const context = useContext(TypesenseClientContext) as TypesenseClientContextType
  if (!context || !context.client) {
    throw new Error('useTypesenseClient() must be used within a TypesenseClientProvider')
  }

  return context
}

interface TypesenseClientProviderProps {
  client?: TypesenseClient
}
export const TypesenseClientProvider = ({
  children,
  client: clientOverride,
}: React.PropsWithChildren<TypesenseClientProviderProps>) => {
  const client = clientOverride ?? createTypesenseClient()

  return <TypesenseClientContext.Provider value={{ client }}>{children}</TypesenseClientContext.Provider>
}

import { useQuery } from '@apollo/client'
import { Typesense_DocumentByIdDocument } from '@holi/api/graphql/graphql-codegen'
import { logError } from '@holi/core/errors/helpers'
import type { TypesenseDocumentType } from '@holi/core/typesense/types'
import { useEffect, useMemo } from 'react'

export const useSingleTypesenseDocumentQuery = (
  id: string,
  documentType: TypesenseDocumentType,
  { onError, onNotFound }: { onError?: (error: Error) => void; onNotFound?: () => void } = {}
) => {
  const {
    loading: isLoading,
    data,
    refetch: refresh,
  } = useQuery(Typesense_DocumentByIdDocument, {
    variables: {
      id,
      documentType,
    },
    onError: (error) => {
      if (onError) {
        onError(error)
      } else {
        logError(error, 'Failed to fetch single document', {
          location: 'useSingleTypesenseDocumentQuery.useQuery',
        })
      }
    },
  })

  const document = useMemo(() => {
    if (!data || !data.typesense_documentById?.hits?.length) {
      return undefined
    }
    return data.typesense_documentById.hits[0].document
  }, [data])

  useEffect(() => {
    if (!isLoading && data) {
      if ('error' in data.typesense_documentById) {
        if (onError) {
          onError(data.typesense_documentById.error)
        } else {
          logError(data.typesense_documentById.error, 'Failed to fetch single document', {
            location: 'useSingleTypesenseDocumentQuery.useEffect',
          })
        }
      } else if (!data?.typesense_documentById?.hits?.length) {
        onNotFound?.()
      }
    }
  }, [data, isLoading, onError, onNotFound])

  return {
    isLoading,
    document,
    refresh,
  }
}

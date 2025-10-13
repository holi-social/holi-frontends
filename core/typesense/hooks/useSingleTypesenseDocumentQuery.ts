import { useTypesense_DocumentByIdQuery } from '@holi/api/graphql/graphql-codegen'
import { logError } from '@holi/core/errors/helpers'
import type { TypesenseDocumentTypeEnum } from '@holi/core/typesense/types'
import { useEffect, useMemo } from 'react'

export const useSingleTypesenseDocumentQuery = (
  id: string,
  documentType: TypesenseDocumentTypeEnum,
  { onError, onNotFound }: { onError?: (error: Error) => void; onNotFound?: () => void } = {}
) => {
  const {
    loading: isLoading,
    data,
    error,
    refetch: refresh,
  } = useTypesense_DocumentByIdQuery({
    variables: {
      id,
      documentType,
    },
  })

  useEffect(() => {
    if (error) {
      if (onError) {
        onError(error)
      } else {
        logError(error, 'Failed to fetch single document', {
          location: 'useSingleTypesenseDocumentQuery.useQuery',
        })
      }
    }
  }, [error, onError])

  const document = useMemo(() => {
    if (
      data?.typesense_documentById?.__typename === 'Typesense_SearchResponseSuccess' &&
      data.typesense_documentById?.hits?.length
    ) {
      return data.typesense_documentById?.hits?.[0]?.document
    }
    return undefined
  }, [data])

  useEffect(() => {
    if (!isLoading && data) {
      if (data.typesense_documentById?.__typename === 'Typesense_SearchResponseError') {
        if (onError) {
          onError(new Error(data.typesense_documentById.error))
        } else {
          logError(data.typesense_documentById.error, 'Failed to fetch single document', {
            location: 'useSingleTypesenseDocumentQuery.useEffect',
          })
        }
      } else if (
        data?.typesense_documentById?.__typename === 'Typesense_SearchResponseSuccess' &&
        !data?.typesense_documentById?.hits?.length
      ) {
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

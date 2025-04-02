import { logError } from '@holi/core/errors/helpers'
import { createTypesenseClient } from '@holi/core/typesense/helpers/createTypesenseClient'
import type { TypesenseDocument, TypesenseDocumentType } from '@holi/core/typesense/types'
import { useCallback, useEffect, useState } from 'react'

const typesenseClient = createTypesenseClient()

export const useSingleTypesenseDocumentQuery = (
  id: string,
  documentType: TypesenseDocumentType,
  { onError, onNotFound }: { onError?: (error: Error) => void; onNotFound?: () => void } = {}
) => {
  const [isLoading, setIsLoading] = useState(false)
  const [document, setDocument] = useState<TypesenseDocument>()

  const fetchDocument = useCallback(() => {
    const parameter = {
      q: '*',
      filter_by: `id:${documentType}_${id} && type:${documentType}`,
      per_page: 1,
    }
    setIsLoading(true)
    typesenseClient
      .search(parameter)
      .then((results) => {
        if (!results?.hits?.length) {
          onNotFound?.()
        } else {
          setDocument(results.hits[0].document)
        }
      })
      .catch((error) => {
        if (onError) {
          onError(error)
        } else {
          logError(error, 'Failed to fetch single document', {
            location: 'useSingleTypesenseDocumentQuery',
          })
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [documentType, id, onError, onNotFound])

  useEffect(() => {
    fetchDocument()
    // Only trigger if params change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, documentType])

  return {
    isLoading,
    document,
    refresh: fetchDocument,
  }
}

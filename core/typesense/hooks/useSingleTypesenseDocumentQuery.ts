import { logError } from '@holi/core/errors/helpers'
import { createTypesenseClient } from '@holi/core/typesense/helpers/createTypesenseClient'
import type { TypesenseDocument, TypesenseDocumentType } from '@holi/core/typesense/types'
import { useCallback, useEffect, useMemo, useState } from 'react'

const typesenseClient = createTypesenseClient()

export const useSingleTypesenseDocumentQuery = (
  id: string,
  documentType: TypesenseDocumentType,
  { onError, onNotFound }: { onError?: (error: Error) => void; onNotFound?: () => void } = {}
) => {
  const [document, setDocument] = useState<TypesenseDocument>()
  const parameters = useMemo(
    () => ({
      q: '*',
      filter_by: `id:${documentType}_${id} && type:${documentType}`,
      per_page: 1,
    }),
    [documentType, id]
  )

  const fetchDocument = useCallback(() => {
    typesenseClient
      .search(parameters)
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
  }, [parameters, onError, onNotFound])

  useEffect(() => {
    fetchDocument()
    // Only trigger if parameters change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parameters])

  return {
    isLoading: !document,
    document,
    refresh: fetchDocument,
  }
}

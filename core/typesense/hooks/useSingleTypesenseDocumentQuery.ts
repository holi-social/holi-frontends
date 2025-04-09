import { logError } from '@holi/core/errors/helpers'
import { useTypesenseClient } from '@holi/core/typesense/provider/TypesenseClientProvider'
import type { TypesenseDocument, TypesenseDocumentType } from '@holi/core/typesense/types'
import { useCallback, useEffect, useMemo, useState } from 'react'

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
      exclude_fields: 'embedding,similarity_embedding,topics_skills_embedding_v2',
    }),
    [documentType, id]
  )
  const { client } = useTypesenseClient()

  const fetchDocument = useCallback(() => {
    client
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
  }, [client, parameters, onNotFound, onError])

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

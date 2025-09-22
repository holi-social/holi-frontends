import { useMemo } from 'react'
import { useUserLanguage } from '@holi/core/screens/search/hooks/useUserLanguage'
import { useSingleTypesenseDocumentQuery } from '@holi/core/typesense/hooks/useSingleTypesenseDocumentQuery'
import { TypesenseDocumentType } from '@holi/core/typesense/types'
import { localizeTypesenseDocument } from '@holi/core/typesense/helpers/localizeTypesenseDocument'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'

interface UseDonationDetailsProps {
  projectId: string
  onError?: (error: Error) => void
  onNotFound?: () => void
}

export const useDonationDetails = ({ projectId, onError, onNotFound }: UseDonationDetailsProps) => {
  const language = useUserLanguage()
  const { isLoading, document, refresh } = useSingleTypesenseDocumentQuery(projectId, TypesenseDocumentType.Donation, {
    onError,
    onNotFound,
  })

  const project = useMemo(
    () => (document ? localizeTypesenseDocument(document, language) : undefined),
    [document, language]
  )

  useOnRefresh(refresh)

  return {
    isLoading,
    project,
  }
}

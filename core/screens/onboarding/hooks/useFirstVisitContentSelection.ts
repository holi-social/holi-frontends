import { makeVar, useReactiveVar } from '@apollo/client'
import AsyncStore from '@react-native-async-storage/async-storage'
import { useEffect, useMemo, useState } from 'react'

import { isSSR } from '@holi/core/helpers/isSSR'

const FIRST_VISIT_CONTENT_SELECTION_STORAGE_NAME = 'first_visit_content_value'

const firstVisitSelectedContentTypeVar = makeVar<string | null>(null)

export const clearFirstVisitContentSelection = async () => {
  await AsyncStore.removeItem(FIRST_VISIT_CONTENT_SELECTION_STORAGE_NAME)
  firstVisitSelectedContentTypeVar(null)
}

const createRouteForContentType = (selectedContentType?: string | null) => {
  switch (selectedContentType) {
    case 'CHALLENGES':
      return '/act?section=CHALLENGES'
    case 'DONATIONS':
      return '/act?section=DONATIONS'
    case 'VOLUNTEERING':
      return '/act?section=VOLUNTEERING'
    case 'SPACES':
      return '/spaces'
  }
  return '/'
}

export const useFirstVisitContentSelection = () => {
  const [isLoading, setIsLoading] = useState(!isSSR)
  const selectedContentType = useReactiveVar(firstVisitSelectedContentTypeVar)
  const routeForSelectedContentType = useMemo(
    () => createRouteForContentType(selectedContentType),
    [selectedContentType]
  )

  useEffect(() => {
    AsyncStore.getItem(FIRST_VISIT_CONTENT_SELECTION_STORAGE_NAME)
      .then((storedValue) => {
        firstVisitSelectedContentTypeVar(storedValue)
      })
      .finally(() => setIsLoading(false))
  }, [])

  return {
    isLoading,
    selectedContentType,
    selectContentType: async (contentType: string) => {
      firstVisitSelectedContentTypeVar(contentType)
      await AsyncStore.setItem(FIRST_VISIT_CONTENT_SELECTION_STORAGE_NAME, contentType)
    },
    routeForSelectedContentType,
  }
}

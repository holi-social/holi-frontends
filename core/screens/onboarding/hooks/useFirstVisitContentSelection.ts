import { makeVar, useReactiveVar } from '@apollo/client'
import AsyncStore from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react'

const FIRST_VISIT_CONTENT_SELECTION_STORAGE_NAME = 'first_visit_content_value'

const firstVisitSelectedContentTypeVar = makeVar<string | null>(null)

export const clearFirstVisitContentSelection = async () => {
  await AsyncStore.removeItem(FIRST_VISIT_CONTENT_SELECTION_STORAGE_NAME)
  firstVisitSelectedContentTypeVar(null)
}

export const useFirstVisitContentSelection = () => {
  const [isLoading, setIsLoading] = useState(true)
  const selectedContentType = useReactiveVar(firstVisitSelectedContentTypeVar)

  useEffect(() => {
    AsyncStore.getItem(FIRST_VISIT_CONTENT_SELECTION_STORAGE_NAME)
      .then(async (storedValue) => {
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
  }
}

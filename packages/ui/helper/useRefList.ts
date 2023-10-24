import { useRef } from 'react'
import { View } from 'react-native'

export const useRefList = () => {
  const refs = useRef<Record<string, View>>({})

  const addRef = (key: string) => (element: View | null) => {
    if (!element) return
    refs.current[key] = element
  }

  return { refs: refs.current, addRef }
}

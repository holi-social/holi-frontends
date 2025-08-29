import { useGlobalSearchParams } from 'expo-router'

export const useRoute = () => {
  const params = useGlobalSearchParams()
  return { params }
}

import * as Linking from 'expo-linking'

interface UseCurrentUrl {
  currentUrl: string
}

const useCurrentUrl = (): UseCurrentUrl => {
  return { currentUrl: Linking.useURL() ?? '/' }
}

export default useCurrentUrl

import * as Linking from 'expo-linking'
import type { ParsedURL } from 'expo-linking'

interface UseLinking {
  currentUrl: string
  createUrl: typeof Linking.createURL
  openUrl: typeof Linking.openURL
  parsedUrl: ParsedURL
}

const useLinking = (): UseLinking => {
  const currentUrl = Linking.useURL() ?? '/'
  const parsedUrl = Linking.parse(currentUrl)

  const createUrl = Linking.createURL
  const openUrl = Linking.openURL

  return { openUrl, createUrl, currentUrl, parsedUrl }
}

export default useLinking

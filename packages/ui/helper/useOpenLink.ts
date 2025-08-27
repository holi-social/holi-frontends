import { setWebViewGlobalModalOptions } from '@holi/ui/components/organisms/HoliWebViewGlobalModal'
import { useCallback } from 'react'
import { Linking, Platform } from 'react-native'

const isWeb = Platform.OS === 'web'

export const useOpenLink = () => {
  return useCallback((url?: string) => {
    if (!url) return

    if (isWeb) {
      Linking.openURL(url)
    } else {
      setWebViewGlobalModalOptions({ shown: true, webViewUrl: url })
    }
  }, [])
}

import React from 'react'
import { makeVar, useReactiveVar } from '@apollo/client'

import HoliModal from '@holi/ui/components/molecules/HoliModal'
import HoliWebView from '@holi/core/components/HoliWebView'
import { useTheme } from '@holi/ui/styles/theme'

interface WebViewModalProps {
  shown: boolean
  onDismiss?: () => void
  webViewUrl?: string
}

const initialWebViewModalOptions: WebViewModalProps = {
  shown: false,
  onDismiss: () => {},
  webViewUrl: '',
}

const webViewModalOptions = makeVar<WebViewModalProps>({
  ...initialWebViewModalOptions,
})

export const setWebViewGlobalModalOptions = (options: WebViewModalProps) => {
  webViewModalOptions({ ...initialWebViewModalOptions, ...options })
}

export const HoliWebViewGlobalModal = () => {
  const { theme } = useTheme()
  const { shown, onDismiss, webViewUrl = '' } = useReactiveVar(webViewModalOptions)

  return (
    <HoliModal
      label="modal"
      animationType="slide"
      style={{ width: '100%', height: '100%', flex: 1 }}
      shown={shown && !!webViewUrl}
      onDismiss={() => {
        onDismiss?.()
        setWebViewGlobalModalOptions({ shown: false })
      }}
      testID="volunteering-external-url-modal"
    >
      <HoliWebView
        theme={theme}
        style={{ flex: 1, height: '100%', width: '100%' }}
        webViewProps={{ setSupportMultipleWindows: false, source: { uri: webViewUrl } }}
      />
    </HoliModal>
  )
}

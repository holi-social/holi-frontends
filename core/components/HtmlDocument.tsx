import React, { useEffect, useState } from 'react'
import { Platform, ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native-unistyles'
import HoliWebView from '@holi/core/components/HoliWebView'
import { HoliBadRequestError } from '@holi/core/errors/classes/HoliBadRequestError'
import { HoliError } from '@holi/core/errors/classes/HoliError'
import { getLogger } from '@holi/core/helpers/logging'
import HoliHtmlView from '@holi/ui/components/molecules/HoliHtmlView'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'
import { Spacing } from 'holi-bricks/foundations'

const logger = getLogger('Other')

interface HtmlDocumentProps {
  url?: URL | string
  onError?: (err?: Error) => void
  // Uses a web view for documents that are too large.
  // This also injects a ScrollView,
  // so don't use one around it when using this option.
  fallbackToWebView?: boolean
}

const HtmlDocument = ({ url, onError, fallbackToWebView }: HtmlDocumentProps) => {
  const [document, setDocument] = useState<string | null>(null)
  // Large documents can take a while to load, if we triggered loading once, we don't want to load them again.
  // Seen in real life in the app (document loaded twice).
  const [loading, setLoading] = useState<boolean>(false)
  const needToLoad = url && !document
  const { bottom } = useSafeAreaInsets()
  const styles = getStyles(bottom)
  const mixins = useStyleMixins()
  const { theme } = useTheme()

  useEffect(() => {
    if (needToLoad && !loading) {
      logger.debug('HtmlDocument', 'loading document', url)
      setLoading(true)

      Promise.all([
        fetch(url, {
          method: 'GET',
          headers: {
            Accept: 'application/html',
            'Content-Type': 'application/html',
          },
        }).then(async (res) => {
          const message = await res.text()
          logger.debug('HtmlDocument', 'got document, with length', message.length.toLocaleString('en'))

          if (res.status !== 200) {
            throw res.status === 400 ? new HoliBadRequestError() : new HoliError(message)
          }

          return message
        }),
        // needed so `setDocument` is deferred long enough
        // else, rendering the document would freeze the modal animation
        // (because the html rendering is quite JS performance intensive)
        new Promise((resolve) => setTimeout(resolve, 800)).finally(() =>
          logger.debug('HtmlDocument', 'finished waiting for outside modal animation')
        ),
      ])
        .then(([document]) => setDocument(document))
        .catch(onError)
        .finally(() => setLoading(false))
    }
  }, [onError, needToLoad, loading, url])

  if (!document) {
    return <HoliLoader style={{ minHeight: 300 }} />
  } else if (fallbackToWebView) {
    // introduced this option as a feature,
    // so we don't need to change all usages of HtmlDocument
    // (unwrapping scroll views)
    return document.length < 1_048_576 ? (
      <ScrollView style={mixins.container} contentContainerStyle={{ maxWidth: '100%', marginTop: Spacing.lg }}>
        <HoliHtmlView html={document} />
      </ScrollView>
    ) : (
      <HoliWebView
        webViewProps={{ source: { uri: url ? url.toString() : '' } }}
        style={styles.webView}
        navigateToExternalBrowser
        theme={theme}
      />
    )
  } else {
    return <HoliHtmlView html={document} />
  }
}

const getStyles = (bottomInset: number) =>
  StyleSheet.create({
    webView: {
      marginTop: 16,
      marginLeft: 8,
      marginRight: Platform.OS === 'android' ? 8 : 0,
      marginBottom: bottomInset,
    },
  })

export default HtmlDocument

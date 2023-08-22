import React, { useEffect, useState } from 'react'
import { Platform, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import HoliWebView from '@holi/core/components/HoliWebView'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { HoliBadRequestError } from '@holi/core/errors/classes/HoliBadRequestError'
import { HoliError } from '@holi/core/errors/classes/HoliError'
import { logDebug } from '@holi/core/helpers/logging'
import HoliHtmlView from '@holi/ui/components/molecules/HoliHtmlView'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

interface HtmlDocumentProps {
  url?: URL | string
  onError?: (err?: Error) => void
}

const HtmlDocument = ({ url, onError }: HtmlDocumentProps) => {
  const [document, setDocument] = useState<string | null>(null)
  // Large documents can take a while to load, if we triggered loading once, we don't want to load them again.
  // Seen in real life in the app (document loaded twice).
  const [loading, setLoading] = useState<boolean>(false)
  const needToLoad = url && !document
  const { bottom } = useSafeAreaInsets()
  const styles = getStyles(bottom)
  const mixins = useStyleMixins()

  useEffect(() => {
    if (needToLoad && !loading) {
      logDebug('HtmlDocument', 'loading document', url)
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
          logDebug('HtmlDocument', 'got document, with length', message.length.toLocaleString('en'))

          if (res.status !== 200) {
            throw res.status === 400 ? new HoliBadRequestError() : new HoliError(message)
          }

          return message
        }),
        // needed so `setDocument` is deferred long enough
        // else, rendering the document would freeze the modal animation
        // (because the html rendering is quite JS performance intensive)
        new Promise((resolve) => setTimeout(resolve, 800)).finally(() =>
          logDebug('HtmlDocument', 'finished waiting for outside modal animation')
        ),
      ])
        .then(([document]) => setDocument(document))
        .catch(onError)
        .finally(() => setLoading(false))
    }
  }, [onError, needToLoad, loading, url])

  return (
    <>
      {document ? (
        // long documents have bad performance and break on old devices
        document.length < 1_048_576 ? (
          <ScrollHeaderLayout.Default
            style={mixins.container}
            contentContainerStyle={{ maxWidth: '100%' }}
            headerOverlap
          >
            <HoliHtmlView html={document} />
          </ScrollHeaderLayout.Default>
        ) : (
          <HoliWebView webViewProps={{ source: { uri: url ? url.toString() : '' } }} style={styles.webView} />
        )
      ) : (
        <HoliLoader style={{ minHeight: 300 }} />
      )}
    </>
  )
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

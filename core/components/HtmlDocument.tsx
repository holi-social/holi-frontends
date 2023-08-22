import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, useWindowDimensions } from 'react-native'

import HoliWebView from '@holi/core/components/HoliWebView'
import { HoliBadRequestError } from '@holi/core/errors/classes/HoliBadRequestError'
import { HoliError } from '@holi/core/errors/classes/HoliError'
import HoliHtmlView from '@holi/ui/components/molecules/HoliHtmlView'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'

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
  const { height: deviceHeight } = useWindowDimensions()
  const styles = getStyles(deviceHeight)

  useEffect(() => {
    if (needToLoad && !loading) {
      setLoading(true)
      fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/html',
          'Content-Type': 'application/html',
        },
      })
        .then(async (res) => {
          const message = await res.text()

          if (res.status !== 200) {
            throw res.status === 400 ? new HoliBadRequestError() : new HoliError(message)
          }

          return message
        })
        .then(setDocument)
        .catch(onError)
        .finally(() => setLoading(false))
    }
  }, [onError, needToLoad, loading, url])

  return (
    <>
      {document ? (
        // long documents have bad performance and break on old devices
        document.length < 1048576 ? (
          <HoliHtmlView html={document} />
        ) : (
          <ScrollView>
            <HoliWebView
              webViewProps={{ source: { uri: url ? url.toString() : '' }, nestedScrollEnabled: true }}
              style={styles.webView}
            />
          </ScrollView>
        )
      ) : (
        <HoliLoader style={{ minHeight: 300 }} />
      )}
    </>
  )
}

const getStyles = (deviceHeight: number) =>
  StyleSheet.create({
    webView: {
      minHeight: deviceHeight - 80,
      marginTop: 25,
    },
  })

export default HtmlDocument

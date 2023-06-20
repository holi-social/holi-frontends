import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import HoliHtmlView from '@holi/ui/components/molecules/HoliHtmlView'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'

interface HtmlDocumentProps {
  url?: URL | string
  onError?: (statusCode?: number) => void
}

const HtmlDocument = ({ url, onError }: HtmlDocumentProps) => {
  const { t } = useTranslation()
  const [document, setDocument] = useState<string | null>(null)
  const needToLoad = url && !document

  useEffect(() => {
    if (needToLoad) {
      fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/html',
          'Content-Type': 'application/html',
        },
      })
        .then((res) => {
          if (res.status !== 200) {
            onError?.(res.status)
            return null
          }
          return res.text()
        })
        .then(setDocument)
    }
  }, [onError, t, needToLoad, url])

  return <>{document ? <HoliHtmlView html={document} /> : <HoliLoader />}</>
}

export default HtmlDocument

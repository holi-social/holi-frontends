import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { HoliBadRequestError } from '@holi/core/errors/classes/HoliBadRequestError'
import { HoliError } from '@holi/core/errors/classes/HoliError'
import HoliHtmlView from '@holi/ui/components/molecules/HoliHtmlView'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'

interface HtmlDocumentProps {
  url?: URL | string
  onError?: (err?: Error) => void
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
        .then(async (res) => {
          const message = await res.text()

          if (res.status !== 200) {
            throw res.status === 400 ? new HoliBadRequestError() : new HoliError(message)
          }

          return message
        })
        .then(setDocument)
        .catch(onError)
    }
  }, [onError, t, needToLoad, url])

  return <>{document ? <HoliHtmlView html={document} /> : <HoliLoader style={{ minHeight: 300 }} />}</>
}

export default HtmlDocument

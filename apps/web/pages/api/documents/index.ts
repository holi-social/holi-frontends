import fs from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'

import { DocType, docTypes } from '@holi/core/documents/DocType'
import { detectLocaleFromRequest } from '@holi/web/helpers/detectLocaleFromRequest'
import { sanitizeBuffer } from '@holi/web/helpers/sanitizeBuffer'

const isDocType = (value?: DocType | string | string[]): value is DocType => docTypes.some((dt) => dt === value)

type DocumentsRecord = Record<DocType, Record<string, string>>

const documents = docTypes.reduce(
  (acc, docType) => ({
    ...acc,
    [docType]: {
      en: `${docType}_en.html`,
      de: `${docType}_de.html`,
    },
  }),
  {} as DocumentsRecord
)

const getDocumentFor = (name: DocType, lang: string) =>
  fs.readFileSync(path.resolve('public/documents', documents[name]?.[lang] ?? documents[name]?.de))

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { type: docType = '' } = req.query

  if (isDocType(docType)) {
    const lang = detectLocaleFromRequest(req)
    const document = getDocumentFor(docType, lang)
    const sanitizedDocument = sanitizeBuffer(document)
    res.setHeader('Content-Type', 'text/html')
    res.send(sanitizedDocument)
  } else {
    res.status(400).send(`Bad Request: document "${docType}" not found`)
  }
}

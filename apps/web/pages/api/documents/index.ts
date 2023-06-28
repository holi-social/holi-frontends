import fs from 'fs'
import locale from 'locale'
import { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'

const docTypes = ['imprint', 'privacyPolicy', 'communityGuidelines', 'insightsFAQ'] as const

export type DocType = (typeof docTypes)[number]

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

const supportedLocales = new locale.Locales(['en_US', 'de_DE'])

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { type: docType = '' } = req.query

  if (isDocType(docType)) {
    const locales = new locale.Locales(req.headers['accept-language'], 'en')
    const lang: string = locales.best(supportedLocales).language
    const document = getDocumentFor(docType, lang)
    res.setHeader('Content-Type', 'text/html')
    res.send(document)
  } else {
    res.status(400).send(`Bad Request: document "${docType}" not found`)
  }
}

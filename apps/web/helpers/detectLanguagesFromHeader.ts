import type { NextPageContext } from 'next'

// Copied and adjusted from https://github.com/i18next/i18next-http-middleware/blob/master/lib/languageLookups/header.js
const specialCases = ['hans', 'hant', 'latn', 'cyrl', 'cans', 'mong', 'arab', '419']

const createRegex = (acceptLanguage: string) => {
  if (acceptLanguage.indexOf('-') > 0) {
    const foundSpecialCase = specialCases.find((s) => acceptLanguage.toLowerCase().indexOf(`-${s}`) > 0)
    if (foundSpecialCase) return /(([a-z]{2,3})-?([A-Z0-9]{2,4})?)\s*;?\s*(q=([0-9.]+))?/gi
  }

  return /(([a-z]{2,3})-?([A-Z]{2})?)\s*;?\s*(q=([0-9.]+))?/gi
}

const extractLanguages = (acceptLanguage: string) => {
  const lngs: { [key: string]: number } = {}
  let m: RegExpExecArray | null
  const rgx = createRegex(acceptLanguage)

  do {
    m = rgx.exec(acceptLanguage)
    if (m) {
      const lng = m[1]
      const weight = m[5] || '1'
      const q = Number(weight)
      if (lng && !isNaN(q)) {
        lngs[lng] = q
      }
    }
  } while (m)

  return Object.keys(lngs).sort((a, b) => lngs[b] - lngs[a])
}

export const detectLanguagesFromHeader = (req: NextPageContext['req']) => {
  if (typeof req !== 'undefined') {
    const headers = req.headers
    if (!headers) return undefined

    const acceptLanguage = headers['accept-language']

    if (acceptLanguage) {
      const languages = extractLanguages(acceptLanguage)

      if (languages.length) {
        return languages
      }
    }
  }

  return undefined
}

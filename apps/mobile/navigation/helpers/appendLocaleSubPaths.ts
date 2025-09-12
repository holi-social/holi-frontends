import { locales } from '@holi/core/i18n/locales.cjs'

export const appendLocaleSubPaths = (prefixes: string[]) => {
  // "empty" subpath has to be listed last, otherwise it is matched first and locale subpaths are not removed
  const localeSubPaths = locales.map((locale) => '/' + locale).concat([''])
  return localeSubPaths.flatMap((subPath) => prefixes.map((prefix) => prefix + subPath))
}

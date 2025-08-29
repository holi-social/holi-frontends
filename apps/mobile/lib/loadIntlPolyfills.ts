const needsLocale = !('Locale' in Intl)
const needsPluralRules = typeof Intl?.PluralRules === 'undefined'
const needsRelativeTimeFormat = typeof Intl?.RelativeTimeFormat === 'undefined'

if (needsLocale) {
  require('@formatjs/intl-locale/polyfill')
}

if (needsRelativeTimeFormat) {
  require('@formatjs/intl-relativetimeformat/polyfill')
  require('@formatjs/intl-relativetimeformat/locale-data/en')
  require('@formatjs/intl-relativetimeformat/locale-data/de')
}

if (needsPluralRules) {
  require('@formatjs/intl-pluralrules/polyfill')
  require('@formatjs/intl-pluralrules/locale-data/en')
  require('@formatjs/intl-pluralrules/locale-data/de')
}

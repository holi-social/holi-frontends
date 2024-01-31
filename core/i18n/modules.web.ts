import type { Module } from 'i18next'

import languageDetector from '@holi/core/i18n/helpers/languageDetector.web'
import translationLoader from '@holi/core/i18n/helpers/translationLoader'

const isBrowser = typeof window !== 'undefined'

export const i18nModules = (isBrowser ? [languageDetector, translationLoader] : [translationLoader]) as Module[]

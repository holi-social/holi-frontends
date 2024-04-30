import type { Module } from 'i18next'
import { initReactI18next } from 'react-i18next'

import languageDetector from '@holi/core/i18n/helpers/languageDetector.web'
import translationLoader from '@holi/core/i18n/helpers/translationLoader'

const isClient = typeof window !== 'undefined'

const clientOnlyModules = isClient ? [languageDetector] : []
export const i18nModules = [...clientOnlyModules, initReactI18next, translationLoader] as Module[]

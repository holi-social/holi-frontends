import type { Module } from 'i18next'
import { initReactI18next } from 'react-i18next'

import languageDetector from '@holi/core/i18n/helpers/languageDetector'
import translationLoader from '@holi/core/i18n/helpers/translationLoader'

export const i18nModules: Module[] = [initReactI18next, languageDetector, translationLoader]

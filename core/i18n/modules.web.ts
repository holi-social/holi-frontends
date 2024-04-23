import type { Module } from 'i18next'
import { initReactI18next } from 'react-i18next'

import translationLoader from '@holi/core/i18n/helpers/translationLoader'

export const i18nModules = [initReactI18next, translationLoader] as Module[]

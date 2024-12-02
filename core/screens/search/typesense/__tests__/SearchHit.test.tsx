import type React from 'react'

import { SearchHit } from '@holi/core/screens/search/typesense/SearchHit'
import { render, screen } from '@testing-library/react-native'
import { makeHit } from './helpers/generators'

const titleDe = 'Helfe Menschen'
const titleEn = 'Help people'
const descriptionDe = 'Wir freuen uns über deine Hilfe'
const descriptionEn = 'We are happy if you help us'

describe('SearchHit', () => {
  describe('displays localized data for', () => {
    it('data contains for both languages (EN user agent)', () => {
      const hit = makeHit({
        title_de: titleDe,
        title_en: titleEn,
        description_de: descriptionDe,
        description_en: descriptionEn,
      })

      render(<SearchHit hit={hit} language={'en'} />)

      expect(screen.queryByText(titleEn)).toBeVisible()
      expect(screen.queryByText(titleDe)).toBeNull()
    })
    it('data contains for both languages (DE user agent)', () => {
      const hit = makeHit({
        title_de: titleDe,
        title_en: titleEn,
        description_de: descriptionDe,
        description_en: descriptionEn,
      })

      render(<SearchHit hit={hit} language={'de'} />)

      expect(screen.queryByText(titleDe)).toBeVisible()
      expect(screen.queryByText(titleEn)).toBeNull()
    })
    it('data contains for the language of the user agent (EN)', () => {
      const hit = makeHit({
        title_de: undefined,
        title_en: titleEn,
        description_de: undefined,
        description_en: descriptionEn,
      })

      render(<SearchHit hit={hit} language={'en'} />)

      expect(screen.queryByText(titleEn)).toBeVisible()
    })
    it('data contains for the language of the user agent (DE)', () => {
      const hit = makeHit({
        title_de: titleDe,
        title_en: undefined,
        description_de: descriptionEn,
        description_en: undefined,
      })

      render(<SearchHit hit={hit} language={'de'} />)

      expect(screen.queryByText(titleDe)).toBeVisible()
    })
    it('data contains NOT for the language of the user agent (EN)', () => {
      const hit = makeHit({
        title_de: titleDe,
        title_en: undefined,
        description_de: descriptionEn,
        description_en: undefined,
      })

      render(<SearchHit hit={hit} language={'de'} />)

      expect(screen.queryByText(titleDe)).toBeVisible()
    })
    it('data contains NOT for the language of the user agent (DE)', () => {
      const hit = makeHit({
        title_de: undefined,
        title_en: titleEn,
        description_de: undefined,
        description_en: titleEn,
      })

      render(<SearchHit hit={hit} language={'de'} />)

      expect(screen.queryByText(titleEn)).toBeVisible()
    })
  })
})

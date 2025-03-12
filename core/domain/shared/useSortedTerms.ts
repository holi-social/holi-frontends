import { useTranslation } from 'react-i18next'
import { ALL_SKILLS, ALL_TOPICS, type TermType } from '@holi/core/domain/shared/types'
import { useMemo } from 'react'

export interface TermWithLabel {
  term: string
  label: string
}

export const termLabelComparator = (otherLabel: string) => (a: TermWithLabel, b: TermWithLabel) => {
  if (a.label === otherLabel) {
    return 1
  }
  if (b.label === otherLabel) {
    return -1
  }
  return a.label.localeCompare(b.label)
}

export const useSortedTerms = (termType: TermType) => {
  const { t } = useTranslation()

  const options = useMemo(() => {
    const terms = termType === 'topic' ? ALL_TOPICS : ALL_SKILLS
    return terms.map((term) => ({
      term,
      label: t(`${termType}.${term}`),
    }))
  }, [t, termType])

  const optionComparator = useMemo(() => termLabelComparator(t(`${termType}.other`)), [t, termType])

  return useMemo(() => options.sort(optionComparator), [optionComparator, options])
}

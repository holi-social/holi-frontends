import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import UserChipForm, { type SelectableTerm } from '@holi/core/screens/userprofile/components/UserChipForm'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { interestsQuery } from '@holi/core/screens/userprofile/queries'
import { sdgsQuery, skillsQuery } from '@holi/core/domain/shared/queries'
import { useQuery } from '@apollo/client'
import { termsByTitleComparator, type Term } from '@holi/core/domain/shared/types'
import type { Color } from 'holi-bricks/tokens'
import type { ChipSelectSize } from 'holi-bricks/components/chips/size'
import { Text } from 'holi-bricks/components/text'
import { useErrorHandling } from '@holi/core/errors/hooks'

const chipQuery = {
  interests: interestsQuery,
  skills: skillsQuery,
  sdgs: sdgsQuery,
} as const

export type UserChipType = 'interests' | 'skills' | 'sdgs'

interface ChipOptions {
  color: Color
  size: ChipSelectSize
}
const chipOptions: Record<UserChipType, ChipOptions> = {
  interests: {
    size: 'lg',
    color: 'green',
  },
  skills: {
    size: 'lg',
    color: 'blue',
  },
  sdgs: {
    size: 'lg',
    color: 'green',
  },
}

export interface ChipsSelectionProps {
  chipType: UserChipType
  selectedChipIds: string[]
  onSelect: (id: string) => void
  filterString: string
  onFilterStringChange: (value: string) => void
  testID?: string
}

export const getSortedAndFilteredTerms = (
  availableTerms: readonly Term[],
  selectedTermIds: readonly string[],
  filterString = ''
): SelectableTerm[] => {
  const [unselected, selected] = availableTerms.reduce(
    (acc, term) => {
      acc[+selectedTermIds.includes(term.id)].push(term)
      return acc
    },
    [[], []] as [Term[], Term[]]
  )
  const orderedTerms = [
    ...[...selected].sort(termsByTitleComparator).map((term) => ({ ...term, selected: true })),
    ...[...unselected].sort(termsByTitleComparator),
  ]
  return filterString
    ? orderedTerms.filter((term: Term) => term.title.toLowerCase().includes(filterString.toLowerCase()))
    : orderedTerms
}

export const ChipsSelection = ({
  chipType,
  selectedChipIds,
  onSelect,
  testID = 'chip-selection',
  ...props
}: ChipsSelectionProps) => {
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()

  const { loading, data } = useQuery(chipQuery[chipType], {
    onError: (error) =>
      displayError(error, 'Failed to load terms for user chips', { location: 'ChipsSelection', field: chipType }),
  })

  const availableTerms = useMemo(() => data?.[chipType]?.data || [], [data, chipType])
  const sortedAndFilteredTerms = getSortedAndFilteredTerms(availableTerms, selectedChipIds, props.filterString)

  return (
    <View testID={testID}>
      <Text headingLevel="1" size="3xl">
        {t(`user.${chipType}.form.headline`)}
      </Text>

      <HoliGap size="s" />
      <UserChipForm
        {...props}
        {...chipOptions[chipType]}
        keyInUserObject={chipType}
        terms={sortedAndFilteredTerms}
        onTermSelect={onSelect}
        loading={loading}
      />
    </View>
  )
}

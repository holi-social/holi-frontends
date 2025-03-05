import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { Text } from 'holi-bricks/components/text'
import { TermsInput } from '@holi/core/components/TermsInput'

export type UserChipType = 'interests' | 'skills'

export interface ChipsSelectionProps {
  chipType: UserChipType
  selectedChipIds: string[]
  onSelect: (id: string) => void
  testID?: string
}

export const ChipsSelection = ({
  chipType,
  selectedChipIds,
  onSelect,
  testID = 'chip-selection',
}: ChipsSelectionProps) => {
  const { t } = useTranslation()

  return (
    <View testID={testID}>
      <Text headingLevel="1" size="3xl">
        {t(`user.${chipType}.form.headline`)}
      </Text>

      <HoliGap size="s" />

      <TermsInput
        termType={chipType === 'interests' ? 'topic' : 'skill'}
        description={t(`onboarding.${chipType}.subline`)}
        searchPlaceholder={`onboarding.${chipType}.inputPlaceholder`}
        onSingleSelect={onSelect}
        selected={selectedChipIds}
      />
    </View>
  )
}

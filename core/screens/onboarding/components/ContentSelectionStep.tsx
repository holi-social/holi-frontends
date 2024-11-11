import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { Text } from 'holi-bricks/components/text'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, type ViewStyle } from 'react-native'
import { useStyles } from 'holi-bricks/hooks'
import { createStyleSheet } from 'holi-bricks/utils'
import { dimensions } from '@holi/ui/styles/globalVars'
import { SelectorCard } from 'holi-bricks/components/selectors'

interface ContentSelectionStepProps {
  onSelect: (option: string) => void
  initialSelection?: string
}

const contentOptions = [
  {
    id: 'CHALLENGES',
    image: require('@holi/ui/assets/img/onboarding/icon-challenges.svg'),
  },
  {
    id: 'POSTS',
    image: require('@holi/ui/assets/img/onboarding/icon-discuss.svg'),
  },
  {
    id: 'VOLUNTEERING',
    image: require('@holi/ui/assets/img/onboarding/icon-volunteering.svg'),
  },
  {
    id: 'SPACES',
    image: require('@holi/ui/assets/img/onboarding/icon-spaces.svg'),
  },
]

export const ContentSelectionStep = ({ onSelect, initialSelection }: ContentSelectionStepProps) => {
  const { t } = useTranslation()
  const [selectedOption, setSelectedOption] = useState(initialSelection)
  const { styles } = useStyles(stylesheet)

  return (
    <HoliContainer>
      <HoliGap size="ml" />
      <Text size="3xl" headingLevel="2">
        {t('onboarding.contentSelection.heading')}
      </Text>
      <HoliGap size="s" />
      <Text size="md">{t('onboarding.contentSelection.description')}</Text>
      <HoliGap size="ml" />

      <View style={styles.optionsContainer as ViewStyle}>
        {contentOptions.map(({ id, image }) => (
          <SelectorCard
            key={id}
            id={id}
            size="lg"
            title={t(`onboarding.contentSelection.${id}`)}
            onPress={() => {
              setSelectedOption(id)
              onSelect(id)
            }}
            selected={id === selectedOption}
            image={image}
          />
        ))}
      </View>
    </HoliContainer>
  )
}

const stylesheet = createStyleSheet({
  optionsContainer: {
    gap: dimensions.spacingS,
  },
})

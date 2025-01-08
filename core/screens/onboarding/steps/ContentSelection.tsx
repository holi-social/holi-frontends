import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { Text } from 'holi-bricks/components/text'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, View } from 'react-native'
import { useStyles } from 'holi-bricks/hooks'
import { createStyleSheet } from 'holi-bricks/utils'
import { dimensions } from '@holi/ui/styles/globalVars'
import { SelectorCard } from 'holi-bricks/components/selectors'
import { Spacing } from 'holi-bricks/tokens'
import type { StaticImageData } from '@holi/ui/components/atoms/HoliLocalImage.shared'
import type { ContentValue } from '@holi/core/screens/onboarding/types'

interface ContentOption {
  id: ContentValue
  image: StaticImageData
  mobileOnly?: boolean
}

const contentOptions: ContentOption[] = [
  {
    id: 'CHALLENGES',
    image: require('@holi/ui/assets/img/onboarding/icon-challenges.svg'),
    mobileOnly: true,
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
const availableOptions = contentOptions.filter(({ mobileOnly }) => !mobileOnly || Platform.OS !== 'web')

interface ContentSelectionProps {
  onChange: (option: ContentValue) => void
  selectedOption?: ContentValue | undefined
  testID?: string
}

export const ContentSelection = ({ onChange, selectedOption, testID = 'content-selection' }: ContentSelectionProps) => {
  const { t } = useTranslation()
  const { styles } = useStyles(stylesheet)

  return (
    <View testID={testID}>
      <Text size="3xl" headingLevel="2">
        {t('onboarding.contentSelection.heading')}
      </Text>

      <HoliGap size="s" />
      <Text size="md">{t('onboarding.contentSelection.description')}</Text>

      <HoliGap size="ml" />
      <View style={styles.optionsContainer}>
        {availableOptions.map(({ id, image }) => (
          <SelectorCard
            key={id}
            id={id}
            testID={id}
            size="lg"
            title={t(`onboarding.contentSelection.${id}`)}
            description={t(`onboarding.contentSelection.${id}.description`)}
            onPress={() => onChange(id)}
            selected={id === selectedOption}
            image={image}
          />
        ))}
      </View>
    </View>
  )
}

const stylesheet = createStyleSheet({
  optionsContainer: {
    gap: dimensions.spacingS,
    // we need additional margin for outline of SelectorCard in web
    ...Platform.select({
      web: {
        marginHorizontal: Spacing['4xs'],
      },
    }),
  },
})

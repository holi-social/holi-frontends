import React, { useMemo } from 'react'
import { Text } from 'holi-bricks/components/text'
import { useStyles } from 'holi-bricks/hooks'
import { createStyleSheet } from 'holi-bricks/utils'
import { View } from 'react-native'
import { Search } from '@holi/icons/src/generated'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Spacing } from 'holi-bricks/tokens'
import { useTranslation } from 'react-i18next'
import { HoliTextLink } from '@holi/core/navigation/components/HoliTextLink'
import shuffle from 'lodash.shuffle'

const EXAMPLE_COUNT = 17
const EXAMPLE_IDS = Array.from({ length: EXAMPLE_COUNT }, (v, i) => i + 1)
const DISPLAYED_EXAMPLE_COUNT = 5

export const SearchExamples = () => {
  const { styles } = useStyles(stylesheet)
  const { t } = useTranslation()

  const displayedExampleIds = useMemo(() => shuffle(EXAMPLE_IDS).slice(0, DISPLAYED_EXAMPLE_COUNT), [])

  return (
    <View style={styles.list}>
      <Text size="lg">{t('search.typesense.examples.headline')}</Text>
      {displayedExampleIds.map((id) => {
        const text = t(`search.typesense.examples.example${id}`)
        return (
          <View style={styles.example} key={id}>
            <HoliIcon icon={Search} size={16} color={styles.icon.color} style={styles.icon} />
            <HoliTextLink size="md" color="support" label={text} href={`/search?query=${encodeURIComponent(text)}`}>
              {text}
            </HoliTextLink>
          </View>
        )
      })}
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  list: {
    padding: Spacing['xs'],
    gap: Spacing['4xs'],
  },
  example: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: Spacing['3xs'],
    paddingVertical: Spacing['xxs'],
  },
  icon: {
    color: theme.colors.fill.support,
    paddingTop: Spacing['4xs'],
  },
}))

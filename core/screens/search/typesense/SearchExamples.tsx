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
import { useCurrentRefinements } from 'react-instantsearch-core'

const EXAMPLE_COUNTS: { [key: string]: number } = {
  volunteering: 20,
  space: 10,
  profile: 5,
}
const DISPLAYED_EXAMPLE_COUNT = 5

interface SearchExamplesProps {
  onQuerySelect: (query: string) => void
}

export const SearchExamples = ({ onQuerySelect }: SearchExamplesProps) => {
  const { styles } = useStyles(stylesheet)
  const { t } = useTranslation()
  const { items } = useCurrentRefinements()

  const refinements = items.length ? items[0].refinements : []
  const selectedFacet = refinements.length ? refinements[0].label : 'volunteering'
  const exampleIds = useMemo(
    () => Array.from({ length: EXAMPLE_COUNTS[selectedFacet] }, (_, i) => i + 1),
    [selectedFacet]
  )
  const displayedExampleIds = useMemo(() => shuffle(exampleIds).slice(0, DISPLAYED_EXAMPLE_COUNT), [exampleIds])

  return (
    <View style={styles.list}>
      <Text size="lg">{t('search.typesense.examples.headline')}</Text>
      {displayedExampleIds.map((id) => {
        const text = t(`search.typesense.examples.${selectedFacet}${id}`)
        return (
          <View style={styles.example} key={id}>
            <HoliIcon icon={Search} size={16} color={styles.icon.color} style={styles.icon} />
            <HoliTextLink
              size="md"
              color="support"
              label={text}
              href={`/search?facet=${selectedFacet}&query=${encodeURIComponent(text)}`}
              onPress={() => {
                onQuerySelect(text)
                return false
              }}
            >
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

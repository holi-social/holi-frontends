import React, { useMemo } from 'react'
import { Text, TextLink } from 'holi-bricks/components/text'
import { useStyles } from 'holi-bricks/hooks'
import { createStyleSheet } from 'holi-bricks/utils'
import { View } from 'react-native'
import { Search } from '@holi/icons/src/generated'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Spacing } from 'holi-bricks/tokens'
import { useTranslation } from 'react-i18next'
import shuffle from 'lodash.shuffle'
import { useCurrentRefinements } from 'react-instantsearch-core'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'

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
    <View style={styles.list} testID="search-examples">
      <Text size="lg">{t('search.typesense.examples.headline')}</Text>
      {displayedExampleIds.map((id) => {
        const text = t(`search.typesense.examples.${selectedFacet}${id}`)
        const params = new URLSearchParams({
          facet: selectedFacet,
          query: text,
        })
        return (
          <HoliLink
            key={id}
            label={text}
            href={`/search?${params.toString()}`}
            onPress={() => {
              onQuerySelect(text)
              // prevent event propagation
              return false
            }}
          >
            <View style={styles.example}>
              <HoliIcon icon={Search} size={16} color={styles.icon.color} style={styles.icon} />
              <TextLink size="md" color="support" role="presentation">
                {text}
              </TextLink>
            </View>
          </HoliLink>
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

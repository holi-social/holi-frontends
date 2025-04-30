import React, { useEffect, useState } from 'react'
import { Text, TextLink } from 'holi-bricks/components/text'
import { useStyles } from 'holi-bricks/hooks'
import { createStyleSheet } from 'holi-bricks/utils'
import { View } from 'react-native'
import { Search } from '@holi/icons/src/generated'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Spacing } from 'holi-bricks/tokens'
import { useTranslation } from 'react-i18next'
import shuffle from 'lodash.shuffle'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import type { SearchFacet } from '@holi/core/screens/search/types'

const EXAMPLE_COUNTS: { [key in SearchFacet]: number } = {
  volunteering: 20,
  space: 10,
  profile: 5,
}
const DISPLAYED_EXAMPLE_COUNT = 5

export interface SearchExamplesProps {
  onQuerySelect: (query: string) => void
  currentFacet: SearchFacet
}

export const SearchExamples = ({ onQuerySelect, currentFacet }: SearchExamplesProps) => {
  const { styles } = useStyles(stylesheet)
  const { t } = useTranslation()
  const [displayedExampleIds, setDisplayedExampleIds] = useState<number[]>([])
  const [facet, setFacet] = useState('')

  useEffect(() => {
    // Set examples in useEffect to prevent SSR issues because of randomization
    if (currentFacet !== facet) {
      const exampleIds = Array.from({ length: EXAMPLE_COUNTS[currentFacet] }, (_, i) => i + 1)
      setDisplayedExampleIds(shuffle(exampleIds).slice(0, DISPLAYED_EXAMPLE_COUNT))
      setFacet(currentFacet)
    }
  }, [currentFacet, facet])

  return (
    <View style={styles.list} testID="search-examples">
      <Text size="lg">{t('search.typesense.examples.headline')}</Text>
      {displayedExampleIds.map((id) => {
        const text = t(`search.typesense.examples.${facet}${id}`)
        const params = new URLSearchParams({
          facet,
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
              <HoliIcon icon={Search} size={16} colorOverride={styles.icon.color} style={styles.icon} />
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

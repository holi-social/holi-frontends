import { useStyles } from 'holi-bricks/hooks'
import { createStyleSheet } from 'holi-bricks/utils'
import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { Group, GroupFilled, Hearts, HeartsFilled, Spaces, SpacesFilled } from '@holi/icons/src/generated'
import type { HoliTabItem } from '@holi/ui/components/organisms/HoliTabs/types'
import { Spacing } from 'holi-bricks/tokens'

interface SearchFacetsTabsProps {
  currentFacet: string
  onFacetChange: (facet: string) => void
}

type Facet = 'volunteering' | 'space' | 'profile'
const FACET_ICONS: { [key in Facet]: HoliTabItem['tabIcons'] } = {
  volunteering: [Hearts, HeartsFilled],
  space: [Spaces, SpacesFilled],
  profile: [Group, GroupFilled],
}
const FACETS_IN_ORDER: Facet[] = ['volunteering', 'space', 'profile']

export const SearchFacetsTabs = ({ currentFacet, onFacetChange }: SearchFacetsTabsProps) => {
  const { styles } = useStyles(stylesheet)
  const { t } = useTranslation()
  const validFacet = useMemo(
    () => (FACETS_IN_ORDER.includes(currentFacet as Facet) ? currentFacet : FACETS_IN_ORDER[0]),
    [currentFacet]
  )

  useEffect(() => {
    if (validFacet !== currentFacet) {
      onFacetChange(validFacet)
    }
    // Only trigger on initial render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <HoliTabs
      activeTab={validFacet}
      onChange={onFacetChange}
      tabBarBackgroundColor={styles.tabs.backgroundColor}
      data={FACETS_IN_ORDER.map((facet) => ({
        key: facet,
        tabTitle: t(`search.typesense.facets.${facet}`),
        tabIcons: FACET_ICONS[facet],
      }))}
      keyExtractor={({ key }) => key}
      renderTabContent={() => null}
      marginHorizontal={Spacing.xs}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  tabs: {
    backgroundColor: theme.colors.bg.page,
  },
}))

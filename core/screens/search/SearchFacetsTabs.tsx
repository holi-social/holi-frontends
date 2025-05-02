import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { Group, GroupFilled, Hearts, HeartsFilled, Spaces, SpacesFilled } from '@holi/icons/src/generated'
import type { HoliTabItem } from '@holi/ui/components/organisms/HoliTabs/types'
import { SEARCH_FACETS_IN_ORDER, type SearchFacet } from '@holi/core/screens/search/types'
import { Spacing } from 'holi-bricks/foundations'

interface SearchFacetsTabsProps {
  currentFacet: SearchFacet
  onFacetChange: (facet: SearchFacet) => void
}

const FACET_ICONS: { [key in SearchFacet]: HoliTabItem['tabIcons'] } = {
  volunteering: [Hearts, HeartsFilled],
  space: [Spaces, SpacesFilled],
  profile: [Group, GroupFilled],
}

export const SearchFacetsTabs = ({ currentFacet, onFacetChange }: SearchFacetsTabsProps) => {
  const { styles } = useStyles(stylesheet)
  const { t } = useTranslation()

  return (
    <HoliTabs
      activeTab={currentFacet}
      onChange={(facet) => onFacetChange(facet as SearchFacet)}
      tabBarBackgroundColor={styles.tabs.backgroundColor}
      data={SEARCH_FACETS_IN_ORDER.map((facet) => ({
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
    backgroundColor: theme.colors.bg.main,
  },
}))

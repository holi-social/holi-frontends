import { useStyles } from 'holi-bricks/hooks'
import { createStyleSheet } from 'holi-bricks/utils'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useClearRefinements, useRefinementList } from 'react-instantsearch-core'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { Group, GroupFilled, Hearts, HeartsFilled, Spaces, SpacesFilled } from '@holi/icons/src/generated'
import type { HoliTabItem } from '@holi/ui/components/organisms/HoliTabs/types'
import { Spacing } from 'holi-bricks/tokens'

interface SearchFacetsTabsProps {
  initialFacet?: string
  onFacetChange?: (filter?: string) => void
}

enum Facets {
  VOLUNTEERING = 'volunteering',
  SPACE = 'space',
  PROFILE = 'profile',
}
const FACETS_IN_ORDER = [Facets.VOLUNTEERING, Facets.SPACE, Facets.PROFILE]
const FACET_ICONS: { [key in Facets]: HoliTabItem['tabIcons'] } = {
  volunteering: [Hearts, HeartsFilled],
  space: [Spaces, SpacesFilled],
  profile: [Group, GroupFilled],
}

export const SearchFacetsTabs = ({ initialFacet, onFacetChange }: SearchFacetsTabsProps) => {
  const { styles } = useStyles(stylesheet)
  const { t } = useTranslation()
  const { refine: clearRefinement } = useClearRefinements()
  const { items, refine } = useRefinementList({
    attribute: 'type',
  })

  const refinedItems = items.filter((item) => item.isRefined).map((item) => item.value)
  const onSelect = (value: string) => {
    if (refinedItems.includes(value)) {
      return
    }
    clearRefinement()
    refine(value)
    onFacetChange?.(value)
  }
  const activeFacet = refinedItems.length ? refinedItems[0] : (initialFacet ?? FACETS_IN_ORDER[0])

  useEffect(() => {
    onSelect(initialFacet ?? FACETS_IN_ORDER[0])
    // Only trigger on initial render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <HoliTabs
      activeTab={activeFacet}
      onChange={onSelect}
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

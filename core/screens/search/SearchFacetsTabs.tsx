import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { Group, GroupFilled, Hearts, HeartsFilled, Spaces, SpacesFilled } from '@holi/icons/src/generated'
import type { HoliTabItem } from '@holi/ui/components/organisms/HoliTabs/types'
import { Spacing } from 'holi-bricks/foundations'
import { SEARCH_HIT_TYPES_IN_ORDER } from '@holi/core/screens/search/types'
import type { TypesenseDocumentType } from '@holi/core/typesense/types'

interface SearchFacetsTabsProps {
  currentFacet: TypesenseDocumentType
  onFacetChange: (facet: TypesenseDocumentType) => void
}

const FACET_ICONS: { [key in TypesenseDocumentType]: HoliTabItem['tabIcons'] } = {
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
      onChange={(facet) => onFacetChange(facet as TypesenseDocumentType)}
      tabBarBackgroundColor={styles.tabs.backgroundColor}
      data={SEARCH_HIT_TYPES_IN_ORDER.map((facet) => ({
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

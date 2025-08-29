import { withProfiler } from '@sentry/react'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native-unistyles'

import FilterModal from '@holi/core/components/FIlterModal'
import { isSSR } from '@holi/core/helpers/isSSR'
import createParamHooks, { webReplaceQueryConfig } from '@holi/core/navigation/hooks/useParam'
import { Pagination } from '@holi/core/pagination/Pagination'
import type { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import SpaceFilterForm from '@holi/core/screens/spaces/components/SpaceFilterForm'
import type { SpaceFilter } from '@holi/core/screens/spaces/components/SpaceFilterForm/types'
import {
  type FilteredSpacesPageParams,
  useSpaceInitialFilters,
} from '@holi/core/screens/spaces/components/SpaceFilterForm/useSpaceInitialFilters'
import FilteredSpacesHeading from '@holi/core/screens/spaces/filter/components/FilteredSpacesHeading'
import FilteredSpacesList from '@holi/core/screens/spaces/filter/components/FilteredSpacesList'
import SpacesGrid from '@holi/core/screens/spaces/filter/components/SpacesGrid'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { ScrollViewRefreshable } from '@holi/core/helpers/withRefreshControl'
import { SpacesDocument } from '@holi/api/graphql/graphql-codegen'

const { useUpdateParams } = createParamHooks<FilteredSpacesPageParams>()

export const SPACES_PAGE_SIZE = 12 // needs to be divisible by 2, 3 and 4 (grid widths)

const FilteredSpaces = () => {
  const { theme } = useTheme()
  const styles = getStyles(theme)
  const { t } = useTranslation()

  const {
    filters: { locationId, topicSlugs, skillSlugs },
    location: { geolocationDetails, geolocationSuggestion, loadingGeolocation, geolocationError },
  } = useSpaceInitialFilters()

  const updateParams = useUpdateParams(webReplaceQueryConfig)

  const { visible: isFilterModalShown, show: openFilterModal, hide: closeFilterModal } = useModalState()

  const applyFilter = (filter: SpaceFilter) => {
    updateParams({
      topic: filter.topicSlugs,
      location: filter.location?.id,
      skill: filter.skillSlugs,
    })
  }

  const onSubmit = (filter: SpaceFilter) => {
    applyFilter(filter)
    closeFilterModal()
  }

  if (geolocationError) return null

  const queryOptions: PaginationQueryHookOptions = {
    pageSize: SPACES_PAGE_SIZE,
    queryPath: 'spaces',
    variables: {
      geolocation: geolocationDetails?.geolocation,
      topicsV2: topicSlugs,
      skillsV2: skillSlugs,
    },
    fetchPolicy: isSSR ? 'cache-first' : 'cache-and-network',
  }

  const isLoading = loadingGeolocation || (locationId && !geolocationDetails)

  return (
    <>
      <ScrollViewRefreshable style={styles.container} testID="filtered-spaces-container">
        <HoliContainer>
          <FilteredSpacesHeading locationId={locationId} topicSlugs={topicSlugs} skillSlugs={skillSlugs} />
          {isLoading ? (
            <SpacesGrid style={styles.loadingGrid} loading={true} pageSize={SPACES_PAGE_SIZE} />
          ) : (
            <Pagination
              query={SpacesDocument}
              queryOptions={queryOptions}
              fetchMoreButtonProps={{ style: styles.buttonContainer }}
              fetchMoreButtonLabel={t('spaces.spaceListing.loadMoreButton.text')}
            >
              <FilteredSpacesList pageSize={SPACES_PAGE_SIZE} />
            </Pagination>
          )}
        </HoliContainer>

        <HoliGap size="xl" />
      </ScrollViewRefreshable>

      <FilterModal
        actionButtonVisible
        label={t('spaces.filter.heading')}
        buttonLabel={t('spaces.filter.button.label')}
        shown={isFilterModalShown}
        open={openFilterModal}
        onDismiss={closeFilterModal}
        testID="spaces-filter-modal"
      >
        <SpaceFilterForm
          location={geolocationSuggestion}
          topicSlugs={topicSlugs}
          skillSlugs={skillSlugs}
          onSubmit={onSubmit}
        />
      </FilterModal>
    </>
  )
}

export default withProfiler(memo(FilteredSpaces), { name: 'FilteredSpaces' })

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background20,
    },
    buttonContainer: {
      marginTop: 20,
    },
    loadingGrid: {
      marginTop: 32,
    },
  })

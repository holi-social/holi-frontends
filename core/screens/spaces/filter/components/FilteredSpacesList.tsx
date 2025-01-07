import React, { memo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { usePaginationContext } from '@holi/core/pagination/Pagination'
import SpacesGrid from '@holi/core/screens/spaces/filter/components/SpacesGrid'
import { Space } from '@holi/core/screens/spaces/types'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliNoResults from '@holi/ui/components/molecules/HoliNoResults'

interface Props {
  pageSize: number
}

const FilteredSpacesList: React.FC<Props> = ({ pageSize }) => {
  const { navigate } = useRouting()
  const { displayError } = useErrorHandling()

  const { t } = useTranslation()
  const { loading, data: spaces, error } = usePaginationContext<Space>()

  useEffect(() => {
    if (error) {
      displayError(error, 'Failed to load filtered spaces', {
        displayMessage: t('spaces.spaceListing.error'),
        location: 'FilteredSpacesList.useEffect',
      })
    }
  }, [displayError, error, t])

  // Error state just hides the component
  if (error) {
    return <></>
  }

  if (loading) {
    return <SpacesGrid style={styles.grid} loading={true} pageSize={pageSize} />
  }

  if (spaces.length === 0) {
    return (
      <HoliNoResults
        firstText={t('spaces.filter.notFound.title')}
        secondText={t('spaces.filter.notFound.description')}
        style={styles.noResults}
      >
        <HoliButton
          label={t('search.filter.reset')}
          onPress={() => navigate('/spaces?tab=discover')}
          inline
          testID="spaces-filter-reset"
        >
          {t('search.filter.reset')}
        </HoliButton>
      </HoliNoResults>
    )
  }

  return <SpacesGrid style={styles.grid} spaces={[...spaces]} />
}

const styles = StyleSheet.create({
  grid: {
    marginTop: 32,
  },
  messageContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  noResults: {
    marginTop: 24,
  },
})

export default memo(FilteredSpacesList)

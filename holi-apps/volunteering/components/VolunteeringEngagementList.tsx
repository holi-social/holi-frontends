import type React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliNoResults from '@holi/ui/components/molecules/HoliNoResults'
import { dimensions } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import VolunteeringListingSkeleton from '@holi-apps/volunteering/components/VolunteeringListingSkeleton'

import { Button } from 'holi-bricks/components/button'
import { VolunteeringListingHeader } from '@holi-apps/volunteering/components/VolunteeringListingHeader'
import type { LocalizedTypesenseDocument } from '@holi/core/typesense/types'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { VolunteeringRecoCard } from '@holi-apps/volunteering/components/VolunteeringRecoCard'
import { Spacing } from 'holi-bricks/foundations'

export const ENGAGEMENT_PAGE_SIZE = 10

interface VolunteeringEngagementListProps {
  isFiltering?: boolean
  loadingFailed?: boolean
  clearFilters?: () => void
  engagements: LocalizedTypesenseDocument[]
  isLoading?: boolean
  totalResults?: number
  footerComponent?: React.ReactNode
}

export const VolunteeringEngagementList = ({
  loadingFailed = false,
  isFiltering = false,
  clearFilters,
  engagements,
  isLoading = false,
  totalResults = 0,
  footerComponent,
}: VolunteeringEngagementListProps) => {
  const mixins = useStyleMixins()
  const { t } = useTranslation()
  const { styles } = useStyles(stylesheet)

  const noResults = loadingFailed || engagements.length === 0

  if (isLoading && !engagements.length) {
    return <VolunteeringListingSkeleton isFiltering={isFiltering} amount={ENGAGEMENT_PAGE_SIZE} />
  }

  return (
    <View style={[mixins.container, styles.list]}>
      {engagements.length > 0 && <VolunteeringListingHeader isFiltering={isFiltering} totalResults={totalResults} />}
      <HoliBox padding={[24, 0, 24, 0]}>
        {noResults && (
          <View style={mixins.container}>
            <HoliNoResults
              firstText={t('global.noSearchResults')}
              media={
                <HoliLocalImage
                  imageSource={require('@holi/ui/assets/img/illustrations/illustration_settings.svg')}
                  width={152}
                  height={152}
                  label=""
                  isSvg
                />
              }
              secondText={t('volunteering:filter.notFound.description')}
            >
              <Button label={t('search.filter.reset')} onPress={clearFilters} />
            </HoliNoResults>
          </View>
        )}
        <View testID={isFiltering ? 'volunteering-list-filtered' : 'volunteering-list-unfiltered'}>
          <HoliGridWrapper gap={Spacing['3xs']}>
            {engagements.map((engagement, index) => {
              return (
                <HoliGridCell key={engagement.id}>
                  <VolunteeringRecoCard engagement={engagement} index={index} fixedWidth="100%" />
                </HoliGridCell>
              )
            })}
          </HoliGridWrapper>
        </View>
      </HoliBox>
      {footerComponent}
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  list: {
    paddingTop: dimensions.topBarHeight,
    backgroundColor: theme.colors.bg.main,
  },
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 16,
  },
}))

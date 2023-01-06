import { useQuery } from '@apollo/client'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, ViewStyle } from 'react-native'

import { logError } from '@holi/core/errors/helpers/logError'
import InsightList from '@holi/core/screens/insights/InsightList'
import { LastInsightsResponse, lastInsightsQuery } from '@holi/core/screens/insights/queries'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import HoliUserCardsModalContent from '@holi/ui/components/organisms/HoliUserCardsModalContent'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type InsightsOfTheWeekProps = {
  style?: (ViewStyle | Record<string, unknown>) | (ViewStyle | Record<string, unknown>)[]
}

const InsightsOfTheWeek: React.VFC<InsightsOfTheWeekProps> = (props: InsightsOfTheWeekProps) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()

  const [showEditorsModal, setShowEditorsModal] = useState(false)

  const numberOfInsights = 4
  const { loading, error, data, fetchMore } = useQuery<LastInsightsResponse>(lastInsightsQuery, {
    variables: { limit: numberOfInsights },
    fetchPolicy: 'cache-and-network',
  })
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const fetchingMoreButtonText = isFetchingMore
    ? t('donations:donationListing.loadMoreButton.loading')
    : t('homeFeed.insights.loadMoreText')

  const { data: insights = [], totalResults = 0 } = data?.lastInsights || {}
  const canFetchMore = insights.length < totalResults || isFetchingMore
  const insightsCreators = insights.map((insight) => insight.creator)

  const fetchMoreInsights = useCallback(() => {
    setIsFetchingMore(true)

    fetchMore({
      variables: {
        offset: insights.length,
        limit: numberOfInsights,
      },
    }).finally(() => setIsFetchingMore(false))
  }, [fetchMore, insights.length])

  if (error) {
    logError(error, `[InsightsOfTheWeek.tsx] ${error.message}`)
  }

  // Error and loading states are handled the same way and just hide the component
  if (loading || error) {
    return <></>
  }

  return (
    <View style={[mixins.container, props.style]}>
      {/* Headline */}
      <HoliHeading level="1" size="large" testID="home-feed-insights-heading">
        {t('homeFeed.heading')}
      </HoliHeading>

      {/* Curators with popup */}
      <HoliButton
        label={t('insights.editors.modal.title')}
        transparent
        style={styles.editorsButton}
        onPress={() => setShowEditorsModal(true)}
        testID="avatar-pile-open-modal-button"
        inline
      >
        <View style={styles.editorsButtonContent}>
          <HoliUserAvatarPile users={insightsCreators} collapse />
          <HoliText size="default" testID="avatars-top-title" style={styles.editorsButtonText}>
            {t('insights.editors.editedBy')}
          </HoliText>
        </View>
      </HoliButton>

      <HoliModal
        label={t('insights.editors.modal.title')}
        show={showEditorsModal}
        onDismiss={() => setShowEditorsModal(false)}
        testID="insight-editors-modal"
      >
        <HoliUserCardsModalContent
          title={t('insights.editors.modal.title')}
          users={insightsCreators}
          onDismiss={() => setShowEditorsModal(false)}
          testID="insight-editors"
        />
      </HoliModal>

      <InsightList style={styles.insightList} insights={insights} />

      <HoliButtonLoading
        type="secondary"
        label={fetchingMoreButtonText}
        disabled={!canFetchMore || loading}
        icon={isFetchingMore ? 'loader-4' : undefined}
        iconSpinning={isFetchingMore}
        onPress={fetchMoreInsights}
        style={mixins.moreButton}
        testID="btn-insights-list-load-more"
      >
        {fetchingMoreButtonText}
      </HoliButtonLoading>
    </View>
  )
}

export default InsightsOfTheWeek

const styles = StyleSheet.create({
  editorsButton: {
    marginTop: 8,
  },
  editorsButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editorsButtonText: {
    marginLeft: 10,
    flex: 1,
    flexWrap: 'wrap',
  },
  insightList: {
    marginTop: 36,
  },
})

import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, ViewStyle } from 'react-native'

import { logError } from '@holi/core/errors/helpers/logError'
import usePaginationQuery from '@holi/core/pagination/usePaginationQuery'
import InsightList from '@holi/core/screens/insights/InsightList'
import { lastInsightsQuery } from '@holi/core/screens/insights/queries'
import { Insight } from '@holi/core/screens/insights/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import HoliUserCardsModalContent from '@holi/ui/components/organisms/HoliUserCardsModalContent'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type InsightsOfTheWeekProps = {
  style?: (ViewStyle | Record<string, unknown>) | (ViewStyle | Record<string, unknown>)[]
}

const InsightsOfTheWeek: React.VFC<InsightsOfTheWeekProps> = (props: InsightsOfTheWeekProps) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()

  const { show: showEditorsModal, hide: hideEditorsModal, props: editorsModalProps } = useModalState({ visible: false })

  const numberOfInsights = 4

  const {
    loading,
    data: insights,
    error,
    fetchNextPage,
    canFetchMore,
    isFetchingMore,
  } = usePaginationQuery<Insight>(lastInsightsQuery, {
    queryName: 'lastInsights',
    pageSize: numberOfInsights,
  })

  const fetchingMoreButtonText = isFetchingMore ? t('global.loading') : t('homeFeed.insights.loadMoreText')

  const insightsCreators = insights.map((insight) => insight.creator).filter((creator) => !!creator)

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

      <HoliHeading level="3" size="small" style={styles.insightsSubtitle} testID="home-feed-insights-subtitle">
        {t('homeFeed.insights.subtitle')}
      </HoliHeading>

      {/* Curators with popup */}
      <HoliButton
        label={t('insights.editors.modal.title')}
        transparent
        style={styles.editorsButton}
        onPress={showEditorsModal}
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

      <HoliModal label={t('insights.editors.modal.title')} {...editorsModalProps} testID="insight-editors-modal">
        <HoliUserCardsModalContent
          title={t('insights.editors.modal.title')}
          users={insightsCreators}
          onDismiss={hideEditorsModal}
          testID="insight-editors"
        />
      </HoliModal>

      <InsightList style={styles.insightList} insights={insights} />

      {canFetchMore && (
        <HoliButtonLoading
          type="secondary"
          label={fetchingMoreButtonText}
          disabled={loading}
          icon={isFetchingMore ? 'loader-4' : undefined}
          iconSpinning={isFetchingMore}
          onPress={fetchNextPage}
          style={mixins.moreButton}
          testID="btn-insights-list-load-more"
        >
          {fetchingMoreButtonText}
        </HoliButtonLoading>
      )}
    </View>
  )
}

export default InsightsOfTheWeek

const styles = StyleSheet.create({
  insightsSubtitle: {
    marginTop: 8,
    fontWeight: '400',
    color: colors.foreground20,
  },
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

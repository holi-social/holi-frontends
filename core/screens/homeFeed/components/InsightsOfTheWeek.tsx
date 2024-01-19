import { withProfiler } from '@sentry/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { logError } from '@holi/core/errors/helpers/logError'
import { Pagination } from '@holi/core/pagination/Pagination'
import { usePaginationContext } from '@holi/core/pagination/Pagination'
import InsightList, { INSIGHT_PAGE_SIZE } from '@holi/core/screens/insights/InsightList'
import { lastInsightsQuery } from '@holi/core/screens/insights/queries'
import { Insight } from '@holi/core/screens/insights/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import HoliUserCardsModalContent from '@holi/ui/components/organisms/HoliUserCardsModalContent'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const styles = StyleSheet.create({
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
    marginTop: 24,
  },
  handwaveFilled: {
    paddingLeft: 8,
  },
})

const InsightsOfTheWeekList: React.FC = () => {
  const { t } = useTranslation()

  const { show: showEditorsModal, hide: hideEditorsModal, props: editorsModalProps } = useModalState({ visible: false })

  const { loading, data: insights, totalResults, error } = usePaginationContext<Insight>()

  const insightsCreators = insights.map((insight) => insight.creator).filter((creator) => !!creator)

  if (error) {
    logError(error, 'Failed to load insights', { location: 'InsightsOfTheWeekList' })
    return <></>
  }

  if (!loading && !totalResults) return <></>

  return (
    <>
      {/* Headline */}
      <HoliHeading size="l">{t('homeFeed.insights.heading')}</HoliHeading>
      <HoliGap size="xs" />

      {/* Curators with popup */}
      <HoliBox padding={[8, 0]}>
        <HoliButton
          label={t('insights.editors.modal.title')}
          transparent
          onPress={showEditorsModal}
          testID="avatar-pile-open-modal-button"
          inline
        >
          <View style={styles.editorsButtonContent}>
            <HoliUserAvatarPile users={insightsCreators} collapse loading={!!loading} />
            <HoliText size="default" testID="avatars-top-title" style={styles.editorsButtonText}>
              {t('insights.editors.editedBy')}
            </HoliText>
          </View>
        </HoliButton>
      </HoliBox>

      <HoliModal label={t('insights.editors.modal.title')} {...editorsModalProps} testID="insight-editors-modal">
        <HoliUserCardsModalContent
          title={t('insights.editors.modal.title')}
          users={insightsCreators}
          onDismiss={hideEditorsModal}
          testID="insight-editors"
        />
      </HoliModal>

      <InsightList style={styles.insightList} loading={!!loading} insights={insights} />
    </>
  )
}

const InsightsOfTheWeek: React.FC = () => {
  const mixins = useStyleMixins()
  const { t } = useTranslation()

  const queryOptions = {
    queryPath: 'lastInsights',
    pageSize: INSIGHT_PAGE_SIZE,
  }

  return (
    <View style={mixins.container}>
      <Pagination
        query={lastInsightsQuery}
        queryOptions={queryOptions}
        fetchMoreButtonProps={{
          type: 'secondary',
          style: mixins.moreButton,
          testID: 'btn-insights-list-load-more',
        }}
        fetchMoreButtonLabel={t('homeFeed.insights.loadMoreText')}
      >
        <InsightsOfTheWeekList />
      </Pagination>
    </View>
  )
}

export default withProfiler(InsightsOfTheWeek, { name: 'InsightsOfTheWeek' })

import { withProfiler } from '@sentry/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { logError } from '@holi/core/errors/helpers/logError'
import { usePaginationContext } from '@holi/core/pagination/Pagination'
import InsightsFAQ from '@holi/core/screens/homeFeed/insightsFAQ'
import InsightList from '@holi/core/screens/insights/InsightList'
import { Insight } from '@holi/core/screens/insights/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import HoliUserCardsModalContent from '@holi/ui/components/organisms/HoliUserCardsModalContent'
import { colors } from '@holi/ui/styles/globalVars'

const InsightsOfTheWeekList: React.FC = () => {
  const { t } = useTranslation()

  const {
    show: showInsightsFAQ,
    hide: hideInsightsFAQ,
    props: insightFAQModalProps,
  } = useModalState({ visible: false })

  const { show: showEditorsModal, hide: hideEditorsModal, props: editorsModalProps } = useModalState({ visible: false })

  const { loading, data: insights, error } = usePaginationContext<Insight>()

  const insightsCreators = insights.map((insight) => insight.creator).filter((creator) => !!creator)

  if (error) {
    logError(error, `[InsightsOfTheWeekList.tsx] ${error.message}`)
    return <></>
  }

  return (
    <>
      {/* Headline */}
      <HoliHeading level="1" size="large" testID="home-feed-insights-heading">
        {t('homeFeed.heading')}
      </HoliHeading>

      {/* Insight FAQ with Popup */}
      <HoliButton
        label={t('homeFeed.insights.subtitle')}
        transparent
        style={styles.insightsSubtitleContent}
        onPress={showInsightsFAQ}
        testID="home-feed-insights-subtitle-button"
        inline
      >
        <View style={styles.insightsSubtitleContent}>
          <HoliHeading level="3" size="small" testID="home-feed-insights-subtitle" style={styles.insightsSubtitleText}>
            {t('homeFeed.insights.subtitle')}
          </HoliHeading>
          <HoliIcon icon="information" size={20} filled={false} color={colors.foreground20} />
        </View>
      </HoliButton>
      <HoliModal label={t('homeFeed.insights.subtitle')} {...insightFAQModalProps} testID="insights-faq-modal">
        <InsightsFAQ onDismiss={hideInsightsFAQ} />
      </HoliModal>

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
          <HoliUserAvatarPile users={insightsCreators} collapse loading={loading} />
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

      <InsightList style={styles.insightList} loading={loading} insights={insights} />
    </>
  )
}

export default withProfiler(InsightsOfTheWeekList, { name: 'InsightsOfTheWeekList' })

const styles = StyleSheet.create({
  insightsSubtitle: {
    marginTop: 8,
  },
  insightsSubtitleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  insightsSubtitleText: {
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

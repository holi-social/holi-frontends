import { withProfiler } from '@sentry/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { logError } from '@holi/core/errors/helpers/logError'
import { usePaginationContext } from '@holi/core/pagination/Pagination'
import InsightList from '@holi/core/screens/insights/InsightList'
import { Insight } from '@holi/core/screens/insights/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import HoliUserCardsModalContent from '@holi/ui/components/organisms/HoliUserCardsModalContent'

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
      <HoliBox padding={[0, 0, 8, 0]}>
        <HoliHeading size="large">{t('homeFeed.insights.heading')}</HoliHeading>
      </HoliBox>

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

export default withProfiler(InsightsOfTheWeekList, { name: 'InsightsOfTheWeekList' })

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

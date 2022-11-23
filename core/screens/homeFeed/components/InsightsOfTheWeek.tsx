import { useQuery } from '@apollo/client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, ViewStyle } from 'react-native'

import { logError } from '@holi/core/errors/helpers/logError'
import InsightList from '@holi/core/screens/insights/InsightList'
import { LastInsightsResponse, lastInsightsQuery } from '@holi/core/screens/insights/queries'
import { Insight } from '@holi/core/screens/insights/types'
import { User } from '@holi/core/screens/userprofile/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import HoliUserCardsModalContent from '@holi/ui/components/organisms/HoliUserCardsModalContent'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type InsightsOfTheWeekProps = {
  style?: (ViewStyle | Record<string, unknown>) | (ViewStyle | Record<string, unknown>)[]
}

const getInsightCreators = (insights: Insight[]) => {
  const creators = insights?.map((insight) => insight.creator) || []

  const dicCreators = creators.reduce((acc, creator) => {
    acc[creator.id] ??= creator
    return acc
  }, {} as Record<string, User>)

  return Object.values(dicCreators)
}

const InsightsOfTheWeek: React.VFC<InsightsOfTheWeekProps> = (props: InsightsOfTheWeekProps) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()

  const [showEditorsModal, setShowEditorsModal] = useState(false)

  const numberOfInsights = 2
  const { loading, error, data } = useQuery<LastInsightsResponse>(lastInsightsQuery, {
    variables: { limit: numberOfInsights },
  })

  if (error) {
    logError(error, `[InsightsOfTheWeek.tsx] ${error.message}`)
  }

  // Error and loading states are handled the same way and just hide the component
  if (loading || error) {
    return <></>
  }

  const insights = data?.lastInsights?.data ? data.lastInsights.data : []
  const insightsCreators = getInsightCreators(insights)

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

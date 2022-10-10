import { useQuery } from '@apollo/client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native'

import { logError } from '@holi/core/errors/helpers/logError.web'
import { LastInsightsResponse, lastInsightsQuery } from '@holi/core/screens/homeFeed/queries'
import { Insight } from '@holi/core/screens/homeFeed/types'
import TopicPreviewBox from '@holi/core/screens/topics/components/TopicPreviewBox'
import fakeTopics, { getRandomUser } from '@holi/core/screens/topics/fakeTopics'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import HoliUserCardsModalContent from '@holi/ui/components/organisms/HoliUserCardsModalContent'
import { vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const dummyUsers = Array.from(' '.repeat(6), (_, idx) => getRandomUser(!(idx % 2)))

export type InsightsOfTheWeekProps = {
  style?: (ViewStyle | Record<string, unknown>) | (ViewStyle | Record<string, unknown>)[]
}

const InsightsOfTheWeek: React.VFC<InsightsOfTheWeekProps> = (props: InsightsOfTheWeekProps) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { width } = useWindowDimensions()
  const styles = getStyles(width)
  const numberOfInsights = 2

  const [showEditorsModal, setShowEditorsModal] = useState(false)

  const { loading, error, data } = useQuery<LastInsightsResponse>(lastInsightsQuery, {
    variables: { numberOfItems: numberOfInsights },
  })

  if (error) {
    console.log('######## Insights load error')
    logError(error, `[InsightsOfTheWeek.tsx] ${error.message}`)
  }

  // Error and loading states are handled the same way and just hide the component
  if (loading || error) {
    return <></>
  }

  // if there are no insights in the okuna backend, use fake topics.
  // This way feature branches still have content and don't look empty.
  const insights: Insight[] = data?.lastInsights?.length > 10 ? data.lastInsights : fakeTopics

  return (
    <View style={[mixins.container, styles.insightsOfTheWeek, props.style]}>
      {/* Headline */}
      <HoliHeading level="1" size="large" testID="home-feed-topics-heading">
        {t('homeFeed.heading')}
      </HoliHeading>

      {/* Curators with popup */}
      <HoliButton
        label={t('topics.editors.modal.title')}
        transparent
        style={styles.editorsButton}
        onPress={() => setShowEditorsModal(true)}
        testID="avatar-pile-open-modal-button"
        inline
      >
        <View style={styles.editorsButtonContent}>
          <HoliUserAvatarPile users={dummyUsers} collapse />
          <HoliText size="default" testID="avatars-top-title" style={styles.editorsButtonText}>
            {t('topics.editors.editedBy')}
          </HoliText>
        </View>
      </HoliButton>
      <HoliModal
        label={t('topics.editors.modal.title')}
        show={showEditorsModal}
        onDismiss={() => setShowEditorsModal(false)}
        testID="topic-editors-modal"
      >
        <HoliUserCardsModalContent
          title={t('topics.editors.modal.title')}
          users={dummyUsers}
          onDismiss={() => setShowEditorsModal(false)}
          testID="topic-editors"
        />
      </HoliModal>

      {/* insights */}
      <View style={styles.insightsContainer}>
        {insights.map((insight) => (
          <TopicPreviewBox key={insight.id} insight={insight} style={styles.insight} />
        ))}
      </View>

      <HoliButton type="secondary" label={t('homeFeed.insights.loadMoreText')} style={mixins.moreButton} disabled>
        {t('homeFeed.insights.loadMoreText')}
      </HoliButton>
    </View>
  )
}

export default InsightsOfTheWeek

const getStyles = (screenWidth: number) =>
  StyleSheet.create({
    insightsOfTheWeek: {},
    editorsButton: {
      marginTop: 20,
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
    insightsContainer: {
      ...Platform.select({
        web: {
          ...(screenWidth > +vars.breakpointM
            ? {
                flexDirection: 'row',
                gap: 24,
              }
            : {}),
        },
      }),
    },
    insight: {
      flex: 1,
      marginTop: 40,
    },
  })

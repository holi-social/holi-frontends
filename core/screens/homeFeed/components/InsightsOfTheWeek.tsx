import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, ViewStyle } from 'react-native'

import InsightsList from '@holi/core/screens/insights/list'
import { getRandomUser } from '@holi/core/screens/topics/fakeTopics'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import HoliUserCardsModalContent from '@holi/ui/components/organisms/HoliUserCardsModalContent'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const dummyUsers = Array.from(' '.repeat(6), (_, idx) => getRandomUser(!(idx % 2)))

export type InsightsOfTheWeekProps = {
  style?: (ViewStyle | Record<string, unknown>) | (ViewStyle | Record<string, unknown>)[]
}

const InsightsOfTheWeek: React.VFC<InsightsOfTheWeekProps> = (props: InsightsOfTheWeekProps) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()

  const [showEditorsModal, setShowEditorsModal] = useState(false)

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

      <InsightsList />
    </View>
  )
}

export default InsightsOfTheWeek

const styles = StyleSheet.create({
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
})

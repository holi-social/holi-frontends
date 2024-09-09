import { withProfiler } from '@sentry/react'
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'

import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlagWithMaintenance } from '@holi/core/featureFlags/hooks/useFeatureFlagWithMaintenance'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import NotificationAndSearchHeader from '@holi/core/navigation/components/header/NotificationAndSearchHeader'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useCardWidth } from '@holi/core/screens/homeFeed/components/Recommendations'
import TaskRecommendations from '@holi/core/screens/homeFeed/components/TaskRecommendations'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

import AttendingChallengeEvents from '@holi-apps/challenges/components/AttendingChallengeEvents'
import RecommendedChallenges from '@holi-apps/challenges/components/RecommendedChallenges'
import DonationUpdates from '@holi-apps/donations/components/DonationUpdates'
import VolunteeringRecosV1 from '@holi-apps/volunteering/components/VolunteeringRecosV1'
import VolunteeringUpdates from '@holi-apps/volunteering/components/VolunteeringUpdates'
import { useVolunteeringVariant } from '@holi-apps/volunteering/hooks/useVolunteeringVariant'

const ActHome = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const setScreenOptions = useSetScreenOptions()
  const title = t('act.title')
  const cardWidth = useCardWidth()

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      title,
      headerBackTitleVisible: true,
      headerBackVisible: true,
      headerTitle: () => null,
      headerLeft: ({ tintColor }) => (
        <HeaderTitle size="large" tintColor={tintColor}>
          {title}
        </HeaderTitle>
      ),
      headerRight: (props) => <NotificationAndSearchHeader {...props} />,
    })
  }, [title, setScreenOptions])

  const displayDonations = useFeatureFlagWithMaintenance(FeatureFlagKey.DONATIONS).isOn
  const volunteeringVariant = useVolunteeringVariant()

  return (
    <ScrollView style={styles.container}>
      <HoliGap size="m" />
      <View style={styles.container}>
        <AttendingChallengeEvents />
        <ErrorBoundary>
          <RecommendedChallenges />
        </ErrorBoundary>

        <ErrorBoundary>
          <HoliContainer>
            <TaskRecommendations cardWidth={cardWidth} />
          </HoliContainer>
        </ErrorBoundary>

        {volunteeringVariant === 'legacy' && (
          <ErrorBoundary>
            <HoliContainer>
              <VolunteeringUpdates style={styles.updatesContainer} cardWidth={cardWidth} />
            </HoliContainer>
          </ErrorBoundary>
        )}

        {volunteeringVariant === 'recosV1' && (
          <ErrorBoundary>
            <HoliContainer>
              <VolunteeringRecosV1 style={styles.updatesContainer} cardWidth={cardWidth} />
            </HoliContainer>
          </ErrorBoundary>
        )}

        {displayDonations && (
          <ErrorBoundary>
            <HoliContainer>
              <DonationUpdates style={styles.updatesContainer} cardWidth={cardWidth} />
            </HoliContainer>
          </ErrorBoundary>
        )}
      </View>
    </ScrollView>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      gap: 48,
      backgroundColor: theme.colors.background20,
    },
    updatesContainer: {
      flex: 1,
      minHeight: 'auto',
      paddingBottom: 12,
    },
  })

export default withProfiler(memo(ActHome), { name: 'ActHome' })

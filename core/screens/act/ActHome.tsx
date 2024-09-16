import { withProfiler } from '@sentry/react'
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlagWithMaintenance } from '@holi/core/featureFlags/hooks/useFeatureFlagWithMaintenance'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import NotificationAndSearchHeader from '@holi/core/navigation/components/header/NotificationAndSearchHeader'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useCardWidth } from '@holi/core/screens/homeFeed/components/Recommendations'
import TaskRecommendations from '@holi/core/screens/homeFeed/components/TaskRecommendations'
import { dimensions } from '@holi/ui/styles/globalVars'
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
      headerTransparent: true,
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
    <ScrollHeaderLayout>
      <View style={styles.container}>
        <AttendingChallengeEvents />
        <ErrorBoundary>
          <RecommendedChallenges />
        </ErrorBoundary>

        <ErrorBoundary>
          <TaskRecommendations cardWidth={cardWidth} />
        </ErrorBoundary>

        {volunteeringVariant === 'legacy' && (
          <ErrorBoundary>
            <VolunteeringUpdates cardWidth={cardWidth} />
          </ErrorBoundary>
        )}

        {volunteeringVariant === 'recosV1' && (
          <ErrorBoundary>
            <VolunteeringRecosV1 cardWidth={cardWidth} />
          </ErrorBoundary>
        )}

        {displayDonations && (
          <ErrorBoundary>
            <DonationUpdates cardWidth={cardWidth} />
          </ErrorBoundary>
        )}
      </View>
    </ScrollHeaderLayout>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      gap: dimensions.spacingL,
      backgroundColor: theme.colors.background20,
      paddingTop: dimensions.spacingM,
      paddingBottom: dimensions.spacingL,
    },
  })

export default withProfiler(memo(ActHome), { name: 'ActHome' })

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
import { useFirstVisitContentSelection } from '@holi/core/screens/onboarding/hooks/useFirstVisitContentSelection'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

import AttendingChallengeEvents from '@holi-apps/challenges/components/AttendingChallengeEvents'
import RecommendedChallenges from '@holi-apps/challenges/components/RecommendedChallenges'
import DonationUpdates from '@holi-apps/donations/components/DonationUpdates'
import VolunteeringRecosV1 from '@holi-apps/volunteering/components/VolunteeringRecosV1'
import VolunteeringUpdates from '@holi-apps/volunteering/components/VolunteeringUpdates'
import { useVolunteeringVariant } from '@holi-apps/volunteering/hooks/useVolunteeringVariant'

const ActSection = ({ type }: { type: string }) => {
  const cardWidth = useCardWidth()
  const displayDonations = useFeatureFlagWithMaintenance(FeatureFlagKey.DONATIONS).isOn
  const volunteeringVariant = useVolunteeringVariant()

  switch (type) {
    case 'CHALLENGES':
      return (
        <ErrorBoundary>
          <RecommendedChallenges />
        </ErrorBoundary>
      )
    case 'VOLUNTEERING':
      return (
        <>
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
        </>
      )
    case 'DONATIONS':
      return (
        <>
          {displayDonations && (
            <ErrorBoundary>
              <DonationUpdates cardWidth={cardWidth} />
            </ErrorBoundary>
          )}
        </>
      )
  }
}

const ActHome = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const setScreenOptions = useSetScreenOptions()
  const title = t('act.title')

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

  const { isLoading, selectedContentType } = useFirstVisitContentSelection()

  if (isLoading) return <HoliLoader />

  const sections = ['CHALLENGES', 'VOLUNTEERING', 'DONATIONS']

  if (selectedContentType) {
    const index = sections.findIndex((item) => item === selectedContentType)
    if (index > 0) {
      const [itemToMoveToTheFront] = sections.splice(index, 1)
      sections.unshift(itemToMoveToTheFront)
    }
  }

  return (
    <ScrollHeaderLayout>
      <View style={styles.container}>
        <AttendingChallengeEvents />
        {sections.map((sectionName) => (
          <ActSection type={sectionName} key={sectionName} />
        ))}
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

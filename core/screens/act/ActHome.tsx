import { withProfiler } from '@sentry/react'
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import NotificationAndSearchHeader from '@holi/core/navigation/components/header/NotificationAndSearchHeader'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { ActSection } from '@holi/core/screens/act/ActSection'
import { useFirstVisitContentSelection } from '@holi/core/screens/onboarding/hooks/useFirstVisitContentSelection'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

import AttendingChallengeEvents from '@holi-apps/challenges/components/AttendingChallengeEvents'

export const orderedSections = (selectedContentType: string | null) => {
  const sections = ['CHALLENGES', 'VOLUNTEERING', 'DONATIONS']

  if (selectedContentType) {
    const index = sections.findIndex((item) => item === selectedContentType)
    if (index > 0) {
      const [itemToMoveToTheFront] = sections.splice(index, 1)
      sections.unshift(itemToMoveToTheFront)
    }
  }
  return sections
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

  const { selectedContentType } = useFirstVisitContentSelection()

  const sections = orderedSections(selectedContentType)

  return (
    <ScrollHeaderLayout style={styles.wrapper}>
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
    wrapper: {
      backgroundColor: theme.colors.background20,
    },
    container: {
      gap: dimensions.spacingL,
      backgroundColor: theme.colors.background20,
      paddingTop: dimensions.spacingM,
      paddingBottom: dimensions.spacingL,
    },
  })

export default withProfiler(memo(ActHome), { name: 'ActHome' })

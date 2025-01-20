import { withProfiler } from '@sentry/react'
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import NotificationAndSearchHeader from '@holi/core/navigation/components/header/NotificationAndSearchHeader'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { ActSection, ActSectionType } from '@holi/core/screens/act/ActSection'
import { dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

import AttendingChallengeEventsLegacy from '@holi-apps/challenges/components/AttendingChallengeEventsLegacy'
import { ScrollViewRefreshable } from '@holi/core/helpers/withRefreshControl'

type ActHomeParams = {
  section: string
}

const { useParam } = createParamHooks<ActHomeParams>()

export const orderedSections = (selectedContentType?: string) => {
  const sections = [
    ActSectionType.VOLUNTEERING,
    ActSectionType.CHALLENGES,
    ActSectionType.TASKS,
    ActSectionType.DONATIONS,
  ]

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
  const [selectedContentType] = useParam('section')

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      title,
      headerBackTitleVisible: true,
      headerBackVisible: true,
      headerTitle: '',
      headerLeft: ({ tintColor }) => (
        <HeaderTitle size="large" tintColor={tintColor}>
          {title}
        </HeaderTitle>
      ),
      headerRight: () => <NotificationAndSearchHeader />,
    })
  }, [title, setScreenOptions])

  const sections = orderedSections(selectedContentType)

  return (
    <ScrollViewRefreshable style={styles.layout}>
      <View style={styles.container}>
        <AttendingChallengeEventsLegacy />
        {sections.map((sectionName) => (
          <ActSection type={sectionName} key={sectionName} />
        ))}
      </View>
    </ScrollViewRefreshable>
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
    layout: {
      backgroundColor: theme.colors.background20,
    },
  })

export default withProfiler(memo(ActHome), { name: 'ActHome' })

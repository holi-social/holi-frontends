import { withProfiler } from '@sentry/react'
import React, { memo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import ChatHomeContent from '@holi/chat/src/components/ChatHomeContent'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { useToastForNotAvailableFeature } from '@holi/core/helpers'
import { FeatureToggleName, useFeatureToggle } from '@holi/core/helpers/useFeatureToggle'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import NotificationAndSearchHeader from '@holi/core/navigation/components/header/NotificationAndSearchHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import ChatMaintenance from '@holi/core/screens/chat/ChatMaintenance'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { useTheme } from '@holi/ui/styles/theme'

const ChatHome = () => {
  const { t } = useTranslation()
  const title = t('chat.title')
  const { theme } = useTheme()
  const { colors } = theme

  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const { ftLoading, ftEnabled, ftMaintenance } = useFeatureToggle(FeatureToggleName.CHAT)

  useToastForNotAvailableFeature(!ftLoading && !ftEnabled && !ftMaintenance)

  useEffect(() => {
    setScreenOptions({
      title,
      headerBackTitleVisible: true,
      headerBackVisible: true,
      headerStyle: { backgroundColor: colors.background20 },
      headerTitle: () => null,
      headerLeft: ({ tintColor }) => (
        <HeaderTitle size="large" widthOfScreen={0.6} tintColor={tintColor}>
          {title}
        </HeaderTitle>
      ),
      headerRight: (props) => <NotificationAndSearchHeader {...props} />,
    })
  }, [navigate, setScreenOptions, t, title, colors.background20])
  if (ftLoading) {
    return <HoliLoader style={{ backgroundColor: colors.background20 }} />
  } else if (ftMaintenance) {
    return <ChatMaintenance />
  } else if (!ftLoading && ftEnabled) {
    return <ChatHomeContent />
  } else {
    // unknown status (= missing feature toggle) || disabled
    return (
      <ScrollHeaderLayout.Default backgroundColor={colors.background20}>
        <HoliContainer>
          <HoliHeading level="2" size="xl">
            {' '}
          </HoliHeading>
          <HoliText style={{ color: colors.foreground20 }}>{`${t('global.comingSoon')}...`}</HoliText>
        </HoliContainer>
      </ScrollHeaderLayout.Default>
    )
  }
}

export default withProfiler(memo(ChatHome), { name: 'ChatHome' })

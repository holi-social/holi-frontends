import { withProfiler } from '@sentry/react'
import React, { memo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import ChatHomeContent from '@holi/chat/src/components/ChatHomeContent'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlagWithMaintenance } from '@holi/core/featureFlags/hooks/useFeatureFlagWithMaintenance'
import { useToastForNotAvailableFeature } from '@holi/core/helpers'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import NotificationAndSearchHeader from '@holi/core/navigation/components/header/NotificationAndSearchHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import ChatMaintenance from '@holi/core/screens/chat/ChatMaintenance'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { useTheme } from '@holi/ui/styles/theme'
import * as Appcues from '@appcues/react-native'

const ChatHome = () => {
  Appcues.screen('Chat')
  const { t } = useTranslation()
  const title = t('chat.title')
  const { theme } = useTheme()
  const { colors } = theme

  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()

  const chatFeatureFlag = useFeatureFlagWithMaintenance(FeatureFlagKey.CHAT)

  useToastForNotAvailableFeature({
    onInitialRender: chatFeatureFlag.isOff && !chatFeatureFlag.isUnknown,
    feature: 'CHAT',
  })

  useEffect(() => {
    setScreenOptions({
      title,
      headerBackVisible: false,
      headerTitle: '',
      headerLeft: ({ tintColor }) => (
        <HeaderTitle size="large" widthOfScreen={0.6} tintColor={tintColor}>
          {title}
        </HeaderTitle>
      ),
      headerRight: () => <NotificationAndSearchHeader />,
    })
  }, [navigate, setScreenOptions, t, title, colors.background20])
  if (chatFeatureFlag.inMaintenance || chatFeatureFlag.isOff) {
    return <ChatMaintenance />
  } else if (chatFeatureFlag.isOn) {
    return <ChatHomeContent />
  } else if (chatFeatureFlag.isUnknown) {
    // unknown status (= missing feature toggle) || disabled
    return (
      <ScrollView style={{ backgroundColor: colors.background20 }}>
        <HoliContainer>
          <HoliHeading level="2" size="xl">
            {' '}
          </HoliHeading>
          <HoliText style={{ color: colors.foreground20 }}>{`${t('global.comingSoon')}...`}</HoliText>
        </HoliContainer>
      </ScrollView>
    )
  }
}

export default withProfiler(memo(ChatHome), { name: 'ChatHome' })

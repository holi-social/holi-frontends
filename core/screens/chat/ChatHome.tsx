import { withProfiler } from '@sentry/react'
import React, { memo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { useToastForNotAvailableFeature } from '@holi/core/helpers'
import { FeatureToggleName, useFeatureToggle } from '@holi/core/helpers/useFeatureToggle'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import NotificationSearchButtons from '@holi/core/navigation/components/NotificationSearchButtons'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import ChatHomeContent from '@holi/core/screens/chat/ChatHomeContent'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const ChatHome = () => {
  const { t } = useTranslation()
  const title = t('chat.title')
  const mixins = useStyleMixins()

  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const { loading: ftLoading, enabled: ftEnabled } = useFeatureToggle(FeatureToggleName.CHAT)

  // TODO don't show on maintenance but handle that in the view
  useToastForNotAvailableFeature(!ftLoading && !ftEnabled)

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
      headerRight: (props) => <NotificationSearchButtons {...props} />,
    })
  }, [navigate, setScreenOptions, t, title])

  if (ftLoading) {
    return <HoliLoader style={{ backgroundColor: colors.background10 }} />
  } else if (!ftLoading && ftEnabled) {
    return <ChatHomeContent />
  } else {
    // unknown status (= missing feature toggle) || disabled || maintenance
    return (
      <ScrollHeaderLayout.Default backgroundColor={colors.background20}>
        <View style={mixins.container}>
          <HoliHeading level="1" size="super">
            {' '}
          </HoliHeading>
          <HoliText style={{ color: colors.foreground20 }}>{`${t('global.comingSoon')}...`}</HoliText>
        </View>
      </ScrollHeaderLayout.Default>
    )
  }
}

export default withProfiler(memo(ChatHome), { name: 'ChatHome' })

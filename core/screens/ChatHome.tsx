import React, { memo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import DefaultScrollHeaderLayout from '@holi/core/components/DefaultScrollHeaderLayout'
import { useToastForNotAvailableFeature } from '@holi/core/helpers'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import NotificationSearchButtons from '@holi/core/navigation/components/NotificationSearchButtons'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const ChatHome = () => {
  const { t } = useTranslation()
  const title = t('chat.title')
  const mixins = useStyleMixins()

  const { setOptions, navigate } = useUnifiedNavigation()

  // TODO: remove after implementing the feature
  useToastForNotAvailableFeature(true)

  useEffect(() => {
    setOptions({
      title,
      headerBackTitleVisible: true,
      headerBackVisible: true,
      headerTransparent: true,
      headerTitle: () => null,
      headerLeft: ({ tintColor }) => (
        <HeaderTitle size="large" widthOfScreen={0.6} tintColor={tintColor}>
          {title}
        </HeaderTitle>
      ),
      headerRight: (props) => <NotificationSearchButtons {...props} />,
    })
  }, [setOptions, navigate, t, title])

  return (
    <DefaultScrollHeaderLayout>
      <View style={mixins.container}>
        <HoliHeading level="1" size="super">
          {' '}
        </HoliHeading>
        <HoliText style={{ color: colors.foreground20 }}>{`${t('global.comingSoon')}...`}</HoliText>
      </View>
    </DefaultScrollHeaderLayout>
  )
}

export default memo(ChatHome)

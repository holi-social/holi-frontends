import { createClient } from 'matrix-js-sdk'
import React, { memo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useToastForNotAvailableFeature } from '@holi/core/helpers'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import NotificationSearchButtons from '@holi/core/navigation/components/NotificationSearchButtons'
import useLinking from '@holi/core/navigation/hooks/useLinking'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const ChatHome = () => {
  const { t } = useTranslation()
  const title = t('chat.title')
  const mixins = useStyleMixins()

  const { parsedUrl } = useLinking()
  const { setOptions, navigate } = useUnifiedNavigation()
  const { displayError } = useErrorHandling()

  // TODO: remove after implementing the feature
  useToastForNotAvailableFeature(true)

  const accessToken = parsedUrl?.queryParams?.loginToken

  useEffect(() => {
    if (!accessToken && typeof accessToken !== 'string') return

    const handleMxClient = async () => {
      const client = createClient({
        baseUrl: 'https://local.chat.holi.social',
        accessToken,
        userId: '@mau=20palma:local.chat.holi.social',
      })

      await client.startClient()
      client.once('sync', (state, prevState, res) => {
        // eslint-disable-next-line no-console
        console.log({ state, prevState, res }, 'state') // state will be 'PREPARED' when the client is ready to use
      })
    }

    handleMxClient().catch((err) => displayError(err))

    // TODO: stop client when we unmount
  }, [accessToken, displayError, parsedUrl?.queryParams])

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
    <ScrollHeaderLayout.Default>
      <View style={mixins.container}>
        <HoliHeading level="1" size="super">
          {' '}
        </HoliHeading>
        <HoliText style={{ color: colors.foreground20 }}>{`${t('global.comingSoon')}...`}</HoliText>
      </View>
    </ScrollHeaderLayout.Default>
  )
}

export default memo(ChatHome)

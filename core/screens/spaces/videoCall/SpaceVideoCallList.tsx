import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet } from 'react-native'

import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import VideoCallLinks from '@holi/core/screens/spaces/videoCall/components/VideoCallLinks'
import { colors } from '@holi/ui/styles/globalVars'

export type SpaceVideoCallListParams = {
  spaceIdOrName: string
}
const { useParam } = createParam<SpaceVideoCallListParams>()

const SpaceVideoCallList = () => {
  const [spaceIdOrName] = useParam('spaceIdOrName') // spaceIdOrName can either be space.id or space.name (slug)
  const { t } = useTranslation()

  const setScreenOptions = useSetScreenOptions()

  useLayoutEffect(() => {
    setScreenOptions({
      title: t('spaces.videocall.header'),
      headerStyle: { backgroundColor: colors.background10 },
      headerTransparent: true,
      headerLeft: () => <HeaderBackButton icon="arrow-left" />,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [setScreenOptions, t])

  return (
    <>
      <ScrollHeaderLayout.Default style={styles.defaultLayout} headerOverlap>
        <VideoCallLinks spaceIdOrName={spaceIdOrName} />
      </ScrollHeaderLayout.Default>
    </>
  )
}

export default SpaceVideoCallList

const styles = StyleSheet.create({
  defaultLayout: {
    minHeight: Platform.OS === 'web' ? '100vh' : '100%',
    marginTop: 10,
    backgroundColor: colors.background20,
  },
})

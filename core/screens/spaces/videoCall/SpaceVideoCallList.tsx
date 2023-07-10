import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { useToastForNotAvailableFeature } from '@holi/core/helpers'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import CollaboratorAreaCard from '@holi/core/screens/spaces/linkHub/components/CollaborationAreaCard'
import VideoCallLinks from '@holi/core/screens/spaces/videoCall/components/VideoCallLinks'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type SpaceVideoCallListParams = {
  spaceIdOrName: string
}
const { useParam } = createParam<SpaceVideoCallListParams>()

const SpaceVideoCallList = () => {
  const [spaceIdOrName] = useParam('spaceIdOrName') // spaceIdOrName can either be space.id or space.name (slug)
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const showFeatureNotImplementedToast = useToastForNotAvailableFeature()

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

  // TODO(SF) replace icons, make icons purple?
  return (
    <ScrollHeaderLayout.Default style={styles.defaultLayout} headerOverlap>
      <View style={mixins.container}>
        <CollaboratorAreaCard
          title={t('spaces.videocall.schedule.heading')}
          headerLeftIcon="calendar-event"
          headerRightIcon="arrow-right-s"
          onPressHeaderLeft={showFeatureNotImplementedToast}
          onPressHeaderRight={showFeatureNotImplementedToast}
          headerRightButtonLabel={t('spaces.videocall.schedule.heading')}
          style={styles.card}
        />
        <CollaboratorAreaCard title={t('spaces.videocall.generateLink.heading')} headerLeftIcon="vidicon">
          <VideoCallLinks spaceIdOrName={spaceIdOrName} style={styles.container} />
        </CollaboratorAreaCard>
      </View>
    </ScrollHeaderLayout.Default>
  )
}

export default SpaceVideoCallList

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  defaultLayout: {
    minHeight: Platform.OS === 'web' ? '100vh' : '100%',
    marginTop: 10,
    backgroundColor: colors.background20,
    paddingTop: vars.topBarHeight + 40,
  },
  card: {
    marginBottom: 16,
  },
})

import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import FeatureToggleGuard from '@holi/core/components/FeatureToggleGuard'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { useToastForNotAvailableFeature } from '@holi/core/helpers'
import { FeatureToggleName } from '@holi/core/helpers/useFeatureToggle'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import CollaboratorAreaCard from '@holi/core/screens/spaces/linkHub/components/CollaborationAreaCard'
import VideoCallLinks from '@holi/core/screens/spaces/videoCall/components/VideoCallLinks'
import { ArrowRightS, CalendarCheck, VideoChat } from '@holi/icons/src/generated'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliText from '@holi/ui/components/atoms/HoliText'
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
      headerLeft: () => <HeaderBackButton />,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [setScreenOptions, t])

  return (
    <ScrollHeaderLayout.Default style={styles.defaultLayout} headerOverlap keyboardShouldPersistTaps="handled">
      <HoliBox padding={[24, 0]}>
        <View style={mixins.container}>
          <HoliBox padding={[0, 0, 24, 0]}>
            <HoliText>{t('spaces.videocall.text')}</HoliText>
          </HoliBox>
          <HoliBox padding={[0, 0, 16, 0]}>
            <CollaboratorAreaCard
              title={t('spaces.videocall.schedule.heading')}
              headerLeftIcon={CalendarCheck}
              headerRightIcon={ArrowRightS}
              onPressHeaderLeft={showFeatureNotImplementedToast}
              onPressHeaderRight={showFeatureNotImplementedToast}
              headerRightButtonLabel={t('spaces.videocall.schedule.heading')}
            />
          </HoliBox>
          <HoliBox padding={[0, 0, 16, 0]}>
            <CollaboratorAreaCard title={t('spaces.videocall.generateLink.heading')} headerLeftIcon={VideoChat}>
              <VideoCallLinks spaceIdOrName={spaceIdOrName} />
            </CollaboratorAreaCard>
          </HoliBox>
        </View>
      </HoliBox>
    </ScrollHeaderLayout.Default>
  )
}

const WrappedSpaceVideoCallList = () => (
  <FeatureToggleGuard toggleName={FeatureToggleName.VIDEOCALL} featureNameKey="spaces.videocall.maintenance.feature">
    <SpaceVideoCallList />
  </FeatureToggleGuard>
)

export default WrappedSpaceVideoCallList

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 0,
  },
  defaultLayout: {
    minHeight: Platform.OS === 'web' ? '100vh' : '100%',
    marginTop: Platform.OS === 'web' ? 10 : +vars.topBarHeight,
    backgroundColor: colors.background20,
    paddingTop: vars.topBarHeight,
  },
})

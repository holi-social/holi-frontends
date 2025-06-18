import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet } from 'react-native'

import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import PosthogFeatureFlagGuard from '@holi/core/featureFlags/components/PosthogFeatureFlagGuard'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useSpace } from '@holi/core/screens/spaces/hooks/useSpace'
import CollaboratorAreaCard from '@holi/core/screens/spaces/linkHub/components/CollaborationAreaCard'
import VideoCallLinks from '@holi/core/screens/spaces/videoCall/components/VideoCallLinks'
import { ArrowRightS, CalendarCheck, VideoChat } from '@holi/icons/src/generated'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { SpaceUserConnectionType } from '@holi/api/graphql/graphql-codegen'

export type SpaceVideoCallListParams = {
  spaceIdOrName: string
}
const { useParam } = createParamHooks<SpaceVideoCallListParams>()

const SpaceVideoCallList = () => {
  const [spaceIdOrName] = useParam('spaceIdOrName') // spaceIdOrName can either be space.id or space.name (slug)
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const setScreenOptions = useSetScreenOptions()

  const { loading, error, space } = useSpace(spaceIdOrName)

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      title: t('spaces.videocall.header'),
      headerLeft: () => <HeaderBackButton />,
      headerTitleAlign: 'center',
      headerBackVisible: false,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [setScreenOptions, t, colors.background10])

  if (loading || error || !space) {
    return <></>
  }

  return (
    <PermissionsGuard
      permissionType={PermissionsType.SPACES}
      space={space}
      spaceConnectionType={SpaceUserConnectionType.Member}
    >
      <ScrollView style={styles.defaultLayout} keyboardShouldPersistTaps="handled">
        <HoliBox padding={[24, 0]}>
          <HoliContainer>
            <HoliBox padding={[0, 0, 24, 0]}>
              <HoliText>{t('spaces.videocall.text')}</HoliText>
            </HoliBox>
            <HoliBox padding={[0, 0, 16, 0]}>
              <CollaboratorAreaCard
                title={t('spaces.videocall.schedule.heading')}
                headerLeftIcon={CalendarCheck}
                headerRightIcon={ArrowRightS}
                onPressHeaderLeft={() => navigate(`/spaces/${spaceIdOrName}/appointments/create`)}
                onPressHeaderRight={() => navigate(`/spaces/${spaceIdOrName}/appointments/create`)}
                headerRightButtonLabel={t('spaces.videocall.schedule.heading')}
              />
            </HoliBox>
            <HoliBox padding={[0, 0, 16, 0]}>
              <CollaboratorAreaCard title={t('spaces.videocall.generateLink.heading')} headerLeftIcon={VideoChat}>
                <VideoCallLinks spaceIdOrName={spaceIdOrName} />
              </CollaboratorAreaCard>
            </HoliBox>
          </HoliContainer>
        </HoliBox>
      </ScrollView>
    </PermissionsGuard>
  )
}

const WrappedSpaceVideoCallList = () => (
  <PosthogFeatureFlagGuard featureFlagKey={FeatureFlagKey.VIDEO_CALL} i18nKey="spaces.videocall.maintenance.feature">
    <SpaceVideoCallList />
  </PosthogFeatureFlagGuard>
)

export default WrappedSpaceVideoCallList

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      padding: 16,
      paddingBottom: 0,
    },
    defaultLayout: {
      backgroundColor: theme.colors.background20,
    },
  })

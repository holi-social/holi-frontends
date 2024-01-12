import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useSpace } from '@holi/core/screens/spaces/hooks/useSpace'
import SpaceTaskList from '@holi/core/screens/spaces/tasks/components/SpaceTaskList'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Add } from '@holi/icons/src/generated'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type SpaceTasksParams = {
  spaceIdOrName: string
}
const { useParam } = createParamHooks<SpaceTasksParams>()

const SpaceTasks = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { navigate } = useRouting()

  const [spaceIdOrName] = useParam('spaceIdOrName')
  const { width: screenWidth } = useWindowDimensions()
  const screenOffset = Math.min(screenWidth, +vars.maxScreenWidth) / 2

  const { loading, space } = useSpace(spaceIdOrName, {
    fetchPolicy: 'cache-and-network', // ensures that all required fields are eventually present
  })

  const isMember = !!space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)
  const isAdmin = !!space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)
  const isCollaborator = isAdmin || isMember

  const setScreenOptions = useSetScreenOptions()

  const navigateToCreateTask = () => navigate(`/spaces/${spaceIdOrName}/tasks/create`)

  useLayoutEffect(() => {
    setScreenOptions({
      title: t('spaces.rolesAndPermissions.tasks.title'),
      headerStyle: { backgroundColor: colors.background10 },
      headerTransparent: true,
      headerLeft: () => <HeaderBackButton />,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [setScreenOptions, t])

  if (loading || !space) {
    return <></>
  }

  return (
    <>
      {isCollaborator && (
        <HoliButton
          label={t('allTools.drawer.headline')}
          inline
          testID="space-resources-add-button"
          style={[styles.overlayButton, { transform: [{ translateX: -16 + screenOffset }] }]}
          onPress={navigateToCreateTask}
        >
          <HoliIcon icon={Add} size={24} />
        </HoliButton>
      )}
      <ScrollHeaderLayout.Default style={styles.defaultLayout} headerOverlap keyboardShouldPersistTaps="handled">
        <HoliBox padding={[24, 0]}>
          <View style={mixins.container}>
            <HoliBox padding={[0, 0, 24, 0]}>
              <SpaceTaskList space={space} isAdmin={isAdmin} isCollaborator={isCollaborator} />
            </HoliBox>
          </View>
        </HoliBox>
      </ScrollHeaderLayout.Default>
    </>
  )
}

export default SpaceTasks

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
  overlayButton: {
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    bottom: 40,
    right: '50%',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: colors.foreground30,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    overflow: 'visible',
    zIndex: 1,
    borderRadius: 84,
    width: 56,
    height: 56,
    paddingHorizontal: 0,
  },
})

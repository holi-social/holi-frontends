import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { type DimensionValue, Platform, StyleSheet, View } from 'react-native'

import { useClientWindowDimensions } from '@holi/core/helpers/useClientWindowDimensions'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { useSpace } from '@holi/core/screens/spaces/hooks/useSpace'
import SpaceTaskList from '@holi/core/screens/spaces/tasks/components/SpaceTaskList'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { Add } from '@holi/icons/src/generated'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { ButtonIcon } from 'holi-bricks/components/button'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'

export type SpaceTasksParams = {
  spaceIdOrName: string
}
const { useParam } = createParamHooks<SpaceTasksParams>()

const SpaceTasks = () => {
  const { t } = useTranslation()
  const { navigate } = useRouting()

  const [spaceIdOrName] = useParam('spaceIdOrName')
  const { width: screenWidth } = useClientWindowDimensions()
  const screenOffset = Math.min(screenWidth, dimensions.maxScreenWidth) / 2

  const { space, refetch } = useSpace(spaceIdOrName)
  useOnRefresh(refetch)

  const isMember = !!space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)
  const isAdmin = !!space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)
  const isCollaborator = isAdmin || isMember

  const setScreenOptions = useSetScreenOptions()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const navigateToCreateTask = () => navigate(`/spaces/${spaceIdOrName}/tasks/create`)

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      title: t('spaces.rolesAndPermissions.tasks.title'),
      headerLeft: () => <HeaderBackButton />,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [setScreenOptions, t, colors.background10])

  if (!space) {
    return null
  }

  return (
    <>
      {isCollaborator && (
        <View style={[styles.overlayButton, { transform: [{ translateX: -16 + screenOffset }] }]}>
          <ButtonIcon
            label={t('allTools.drawer.headline')}
            testID="space-resources-add-button"
            onPress={navigateToCreateTask}
            icon={Add}
            size="lg"
          />
        </View>
      )}
      <KeyboardAwareScrollView style={styles.defaultLayout} keyboardShouldPersistTaps="handled">
        <HoliBox padding={[24, 0]}>
          <HoliContainer>
            <HoliBox padding={[0, 0, 24, 0]}>
              <SpaceTaskList space={space} isCollaborator={isCollaborator} />
            </HoliBox>
          </HoliContainer>
        </HoliBox>
      </KeyboardAwareScrollView>
    </>
  )
}

export default SpaceTasks

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      padding: 16,
      paddingBottom: 0,
    },
    defaultLayout: {
      ...Platform.select({
        web: {
          minHeight: '100vh' as DimensionValue,
        },
      }),
      backgroundColor: theme.colors.background20,
    },
    overlayButton: {
      position: Platform.OS === 'web' ? 'fixed' : 'absolute',
      bottom: 40,
      right: '50%',
      elevation: 4,
      overflow: 'visible',
      zIndex: 1,
      paddingHorizontal: 0,
    },
  })

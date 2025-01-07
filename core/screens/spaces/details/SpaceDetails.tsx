import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { isSSR } from '@holi/core/helpers/isSSR'
import useRefreshOnNavigation, { type RefreshOnNavigationParams } from '@holi/core/hooks/useRefreshOnNavigation'
import type { TabNavigationParams } from '@holi/core/hooks/useTabNavigation'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParamHooks, { singleParamConfig } from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import SpaceOnboardModal from '@holi/core/screens/spaces/components/SpaceOnboardModal'
import { ActionDrawer } from '@holi/core/screens/spaces/details/components/ActionDrawer'
import { SpaceChatRoomIcon } from '@holi/core/screens/spaces/details/components/SpaceChatRoomIcon'
import SpaceDetailView, { SpaceDetailsTabs } from '@holi/core/screens/spaces/details/components/SpaceDetailView'
import SpaceShareIcon from '@holi/core/screens/spaces/details/components/SpaceShareIcon'
import ToolkitModal from '@holi/core/screens/spaces/details/components/ToolkitModal'
import { determineSpaceViewerRelation } from '@holi/core/screens/spaces/details/utils'
import { useSpace } from '@holi/core/screens/spaces/hooks/useSpace'
import { SpaceOnboardings, useSpaceOnboarding } from '@holi/core/screens/spaces/hooks/useSpaceOnboarding'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { Pencil, Spaces } from '@holi/icons/src/generated'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { useHoliTabQueryParamSetter } from '@holi/ui/components/organisms/HoliTabs/helpers'
import { dimensions } from '@holi/ui/styles/globalVars'
import { withProfiler } from '@sentry/react'
import { Button, ButtonIcon } from 'holi-bricks/components/button'
import React, { memo, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { AskQuestion } from '@holi/core/screens/spaces/details/components/AskQuestion'
import { ScrollViewRefreshable } from '@holi/core/helpers/withRefreshControl'

export type SpaceDetailsParams = RefreshOnNavigationParams &
  TabNavigationParams & {
    spaceIdOrName: string
  }

const { useParam } = createParamHooks<SpaceDetailsParams>()

const SpaceDetails = () => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const [spaceIdOrName] = useParam('spaceIdOrName') // spaceIdOrName can either be space.id or space.name (slug)
  const { theme } = useTheme()
  const { colors } = theme
  const styles = getStyles()

  const { loading, error, space, refetch, called } = useSpace(spaceIdOrName)

  useOnRefresh(refetch)
  useRefreshOnNavigation({ initialized: called })

  const loginState = useLoggedInUser()
  const { needsOnboarding, setIsOnboarded } = useSpaceOnboarding(SpaceOnboardings.JoinOnboarding)

  const { isMember, isNonMember, isAdmin, isCreator } = determineSpaceViewerRelation(loginState, space)

  const { show: showToolkitModal, props: toolkitModalProps } = useModalState()
  const { show: showOnboardingModal, props: onboardingModalProps } = useModalState({ onDismiss: setIsOnboarded })

  useEffect(() => {
    if (isMember && needsOnboarding && !isCreator) {
      showOnboardingModal()
    }
  }, [space, showOnboardingModal, needsOnboarding, isCreator, isMember])

  const determineInitialTab = useCallback(() => {
    const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)
    const hasInvolvementContent = space?.tasks?.length !== 0 || space?.collaborationTools?.length !== 0
    if (!isMember) {
      return SpaceDetailsTabs.INFO
    }
    if (hasInvolvementContent) {
      return SpaceDetailsTabs.INVOLVEMENT
    }
    return SpaceDetailsTabs.UPDATES
  }, [space?.collaborationTools?.length, space?.connectionStatusToMyself, space?.tasks?.length])
  const onlyAllowKnownTabs = (value: string | undefined): string | undefined =>
    !!value && Object.values(SpaceDetailsTabs).includes(value as SpaceDetailsTabs) ? value : undefined
  const [tabParam] = useParam('tab', singleParamConfig)
  const activeTab = onlyAllowKnownTabs(tabParam)
  const setHoliTabQueryParam = useHoliTabQueryParamSetter(activeTab)
  const onTabChange = (key: string) => {
    setHoliTabQueryParam(key)
  }
  const isReadyToDetermineTab = !activeTab && !loading && !isSSR
  useEffect(() => {
    if (isReadyToDetermineTab) {
      const tabKey = determineInitialTab()
      setHoliTabQueryParam(tabKey)
    }
  }, [determineInitialTab, isReadyToDetermineTab, setHoliTabQueryParam])

  useEffect(() => {
    setScreenOptions({
      animation: 'slide_from_bottom',
      headerTintColor: colors.foreground30,
      headerTitle: '',
      headerLeft: () => <HeaderBackButton />,
      headerRight: (props) => (
        <View style={styles.headerRight}>
          {(isMember || isAdmin) && space && <SpaceChatRoomIcon space={space} color={props.tintColor} />}
          {!isMember || (!isAdmin && <SpaceShareIcon spaceIdOrName={space?.name || space?.id} title={space?.title} />)}
          {space && <ActionDrawer space={space} />}
        </View>
      ),
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [navigate, setScreenOptions, space, t, colors.foreground30, styles.headerRight, isMember, isAdmin])

  const onUpdateButtonPress = useCallback(() => {
    navigate(`/spaces/${spaceIdOrName}/updates/create`)
  }, [navigate, spaceIdOrName])

  if (error || !space) {
    return <HoliLoader />
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollViewRefreshable
        style={{ backgroundColor: colors.background20, flex: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {activeTab && <SpaceDetailView space={space} activeTab={activeTab} onTabChange={onTabChange} />}
      </ScrollViewRefreshable>

      {isMember && activeTab && (
        <HoliTransition.FadeRightSwitch animKey={activeTab} style={styles.floatingButtonsContainer}>
          <HoliContainer flexDirection="row-reverse">
            {activeTab === SpaceDetailsTabs.INVOLVEMENT && (
              <View>
                <Button
                  label={t('allTools.drawer.toolKit.button.label')}
                  variant="secondary"
                  inline
                  testID="space-resources-add-button"
                  onPress={showToolkitModal}
                  icon={Spaces}
                />
              </View>
            )}

            {activeTab === SpaceDetailsTabs.UPDATES && (
              <ButtonIcon
                label={t('spaces.toolKit.add.button.label')}
                testID="space-add-post-button"
                onPress={onUpdateButtonPress}
                icon={Pencil}
                size="lg"
              />
            )}
          </HoliContainer>
        </HoliTransition.FadeRightSwitch>
      )}

      {isNonMember && <AskQuestion spaceIdOrName={spaceIdOrName} />}

      <ToolkitModal {...toolkitModalProps} spaceIdOrName={space.name} />
      <SpaceOnboardModal {...onboardingModalProps} />
    </View>
  )
}

const getStyles = () =>
  StyleSheet.create({
    floatingButtonsContainer: {
      bottom: dimensions.topBarHeight,
      position: Platform.OS === 'web' ? 'fixed' : 'absolute',
      width: '100%',
    },
    addNewDrawerButtonTitle: {
      marginRight: 6,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 14,
    },
  })

export default withProfiler(memo(SpaceDetails), { name: 'SpaceDetails' })

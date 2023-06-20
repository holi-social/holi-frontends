import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet } from 'react-native'

import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import AllTools from '@holi/core/screens/spaces/linkHub/components/AllTools'
import SuggestedTools from '@holi/core/screens/spaces/linkHub/components/SuggestedTools'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { colors, vars } from '@holi/ui/styles/globalVars'

export type LinkHubParams = {
  spaceIdOrName: string
}

const { useParam } = createParam<LinkHubParams>()

const LinkHub = () => {
  const { t } = useTranslation()
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()

  useLayoutEffect(() => {
    setScreenOptions({
      animation: 'slide_from_bottom',
      title: t('spaces.toolKit.title'),
      headerStyle: { backgroundColor: colors.background10 },
      headerTransparent: true,
      headerLeft: () => <HeaderBackButton icon="arrow-left" />,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [setScreenOptions, t])
  const onAddButtonPress = () => {
    navigate(`/spaces/${spaceIdOrName}/linkhub/tools/create`)
  }

  const AddButton = () => {
    return (
      <HoliButton
        label={t('spaces.toolKit.add.button.label')}
        testID="space-add-tool-button"
        style={styles.overlayButton}
        onPress={onAddButtonPress}
      >
        <HoliIcon icon="add" size={20} />
      </HoliButton>
    )
  }

  return (
    <>
      <ScrollHeaderLayout.Default style={styles.defaultLayout} headerOverlap>
        <HoliTabs
          id="toolKit-tabs"
          centeredButtons
          style={{ flex: 1, paddingTop: vars.topBarHeight + 40 }}
          tabs={[
            {
              title: t('spaces.toolKit.allTools.label'),
              style: styles.tabStyle,
              children: <AllTools spaceIdOrName={spaceIdOrName} />,
            },
            {
              title: t('spaces.toolKit.toolIdeas.label'),
              style: styles.tabStyle,
              children: <SuggestedTools />,
            },
          ]}
        />
      </ScrollHeaderLayout.Default>
      <AddButton />
    </>
  )
}

export default LinkHub

const styles = StyleSheet.create({
  defaultLayout: {
    minHeight: Platform.OS === 'web' ? '100vh' : '100%',
    marginTop: 10,
    backgroundColor: colors.background20,
  },
  tabStyle: {
    backgroundColor: colors.background20,
    paddingBottom: 24,
  },
  overlayButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 0,
    paddingVertical: 0,
    bottom: vars.topBarHeight,
    right: 24,
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    justifyContent: 'center',
  },
})

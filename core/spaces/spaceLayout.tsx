import React from 'react'
import { AccessibilityProps, ImageBackground, Platform, ScrollView, StyleSheet, View } from 'react-native'

import { PageHeader } from '@holi/core/spaces/components/PageHeader'
import type { AccessibilityPropsWeb, AccessibilityRoleWeb } from '@holi/ui/@types/react-native-web'
import HoliButton from '@holi/ui/components/HoliButton'
import Holicon from '@holi/ui/components/holicon'
import useRouting from '@holi/ui/components/navigation/useRouting'
import { jsVars } from '@holi/ui/styles/globalVars'
import theme from '@holi/ui/styles/theme'

type SpaceLayoutProps = {
  children?: React.ReactChild | React.ReactChildren | Array<React.ReactChild> | string
}

const SpaceLayout: React.FunctionComponent<SpaceLayoutProps> = (props: SpaceLayoutProps) => {
  const { navigate } = useRouting()

  // Accessibility landmark rule
  // see here: https://dequeuniversity.com/rules/axe/4.3/region
  const getAccessibilityProps = (
    role: AccessibilityRoleWeb,
    label: string
  ): AccessibilityProps | AccessibilityPropsWeb => {
    return {
      accessible: true,
      accessibilityLabel: label,
      accessibilityRole: Platform.select({
        native: role === 'main' || role === 'banner' ? 'none' : role,
        default: role,
      }),
    }
  }

  return (
    <ImageBackground
      source={{ uri: 'https://cdn.pixabay.com/photo/2016/04/12/22/35/watercolour-1325656__480.jpg' }}
      resizeMode="cover"
      style={styles.bgImage}
    >
      <View style={styles.container}>
        {/* https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/main_role */}
        <ScrollView style={styles.scrollView} {...getAccessibilityProps('main', 'Main Content')}>
          {props.children}
        </ScrollView>

        {/* https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/toolbar_role */}
        <View style={styles.footer} {...getAccessibilityProps('toolbar', 'Page Action Button')}>
          <HoliButton label="Open Appstore" style={styles.appStoreButton} onPress={() => navigate('/appstore')}>
            <Holicon icon="appstore" size={30} color="black" style={{ position: 'absolute' }} />
          </HoliButton>
        </View>
        {/* https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/banner_role */}
        <View style={styles.header} {...getAccessibilityProps('banner', 'Page Header')}>
          <PageHeader />
        </View>
      </View>
    </ImageBackground>
  )
}

export default SpaceLayout

const styles = StyleSheet.create({
  bgImage: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
    ...Platform.select({
      web: {
        marginTop: 20,
      },
    }),
  },
  scrollView: {
    marginTop: jsVars.CSS_HEADER_Height + 20,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: jsVars.CSS_HEADER_Height,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 20,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appStoreButton: {
    width: 60,
    height: 60,
    backgroundColor: theme.colors.primaryColor,
    borderColor: theme.colors.borderColorBlack,
    alignItems: 'center',
    borderRadius: 30,
  },
})

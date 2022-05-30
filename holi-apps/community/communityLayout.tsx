import React from 'react'
import { AccessibilityProps, Platform, StyleSheet, View } from 'react-native'

import type { AccessibilityPropsWeb, AccessibilityRoleWeb } from '@holi/ui/@types/react-native-web'
import { SafeAreaView } from '@holi/ui/components/safe-area'

import { PageHeader } from './components/pageHeader'

type CommunityLayoutProps = {
  children?: React.ReactChild | React.ReactChildren | Array<React.ReactChild> | string
}

const CommunityLayout: React.FunctionComponent<CommunityLayoutProps> = (props: CommunityLayoutProps) => {
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
    <SafeAreaView style={styles.container}>
      <PageHeader {...getAccessibilityProps('banner', 'Page Header')} />
      <View style={styles.contentView} {...getAccessibilityProps('main', 'Main Content')}>
        {props.children}
      </View>
    </SafeAreaView>
  )
}

export default CommunityLayout

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  contentView: {
    flex: 1,
  },
})

import React, { ReactNode, useMemo } from 'react'
import { ScrollView, ScrollViewProps, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import DefaultLayout from '@holi/core/components/DefaultLayout'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type EditSpaceModalProps = {
  footer?: ReactNode
  children: ReactNode
  scrollable?: boolean
  keyboardShouldPersistTaps?: ScrollViewProps['keyboardShouldPersistTaps']
}

export const EditSpaceModal = ({
  footer,
  children,
  scrollable = true,
  keyboardShouldPersistTaps = 'always',
}: EditSpaceModalProps) => {
  const mixins = useStyleMixins()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <DefaultLayout
      headerOverlap={true}
      style={styles.layoutStyle}
      contentStyle={styles.contentStyle}
      scrollable={scrollable}
    >
      <ScrollView style={[mixins.container, styles.scrollView]} keyboardShouldPersistTaps={keyboardShouldPersistTaps}>
        {children}
      </ScrollView>
      {footer && <View style={[mixins.container, styles.footerContainer]}>{footer}</View>}
    </DefaultLayout>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    layoutStyle: {
      flex: 1,
    },
    contentStyle: {
      flex: 1,
      paddingBottom: 0,
      backgroundColor: theme.colors.background20,
    },
    scrollView: {
      paddingBottom: 120,
    },
    footerContainer: {
      position: 'absolute',
      bottom: 40,
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10,
    },
  })

export default EditSpaceModal

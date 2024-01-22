import React, { ReactNode } from 'react'
import { ScrollView, ScrollViewProps, StyleSheet, View } from 'react-native'

import DefaultLayout from '@holi/core/components/DefaultLayout'
import { colors } from '@holi/ui/styles/globalVars'
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

const styles = StyleSheet.create({
  layoutStyle: {
    flex: 1,
  },
  contentStyle: {
    flex: 1,
    paddingBottom: 0,
    backgroundColor: colors.background20,
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

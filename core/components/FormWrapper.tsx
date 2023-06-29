import React, { useRef } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, ScrollViewProps, StyleSheet, View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliKeyboardSaveView from '@holi/ui/components/organisms/HoliKeyboardSaveView'
import { useScrollToInputOnFocus } from '@holi/ui/helper/useScrollToInputOnFocus'
import { vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

interface Props extends ScrollViewProps {
  renderProp: (scrollToPropsFor: ReturnType<typeof useScrollToInputOnFocus>) => React.ReactNode
  padTopBar?: boolean
  bottomContent?: React.ReactNode
}

const FormWrapper = React.forwardRef<ScrollView, Props>(
  ({ renderProp, padTopBar = true, bottomContent, ...scrollViewProps }: Props, ref) => {
    const scrollViewRef = useRef<ScrollView>(null)
    const scrollToInputWithId = useScrollToInputOnFocus(scrollViewRef)
    const mixins = useStyleMixins()

    const styles = createStyles(padTopBar)

    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.pageView}>
        <HoliKeyboardSaveView bottomContent={bottomContent}>
          <ScrollView {...scrollViewProps} ref={scrollViewRef} style={{ height: '100%' }}>
            <View style={[mixins.container, styles.container]}>{renderProp(scrollToInputWithId)}</View>
          </ScrollView>
        </HoliKeyboardSaveView>
      </KeyboardAvoidingView>
    )
  }
)

FormWrapper.displayName = 'FormWrapper'

export default FormWrapper

const createStyles = (padTopBar: boolean) =>
  StyleSheet.create({
    pageView: {
      flex: 1,
      paddingTop: padTopBar ? vars.topBarHeight + 10 : 0,
      height: '100%', // prevents double scrollbars
      overflow: 'hidden',
      ...Platform.select({
        web: {
          height: '100vh',
          marginHorizontal: 'auto',
        },
        android: {
          paddingBottom: 0,
        },
      }),
    },
    container: {
      paddingBottom: 200,
    },
  })

import React, { useRef } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, ScrollViewProps, StyleSheet, View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliKeyboardSaveView from '@holi/ui/components/organisms/HoliKeyboardSaveView'
import { useScrollToInputOnFocus } from '@holi/ui/helper/useScrollToInputOnFocus'
import { vars } from '@holi/ui/styles/globalVars'

interface Props extends ScrollViewProps {
  renderProp: (scrollToPropsFor: ReturnType<typeof useScrollToInputOnFocus>) => React.ReactNode
}

const FormWrapper = React.forwardRef<ScrollView, Props>(({ renderProp, ...scrollViewProps }: Props, ref) => {
  const scrollViewRef = useRef<ScrollView>(null)
  const scrollToInputWithId = useScrollToInputOnFocus(scrollViewRef)

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.pageView}>
      <HoliKeyboardSaveView>
        <ScrollView {...scrollViewProps} ref={scrollViewRef}>
          {renderProp(scrollToInputWithId)}
        </ScrollView>

        <View style={{ position: 'fixed', bottom: 0, backgroundColor: 'red', paddingVertical: 20 }}>
          <HoliText>I AM STICKY</HoliText>
        </View>
      </HoliKeyboardSaveView>
    </KeyboardAvoidingView>
  )
})

FormWrapper.displayName = 'FormWrapper'

export default FormWrapper

const styles = StyleSheet.create({
  pageView: {
    paddingTop: vars.topBarHeight + 10,
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
})

import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { WebView } from 'react-native-webview'

import { useErrorHandling } from '@holi/core/errors/hooks'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { colors, vars } from '@holi/ui/styles/globalVars'

export interface HoliWebViewProps {
  uri: string
  style?: StyleProp<ViewStyle>
}

// TODO HOLI-3754: only works on mobile > move to ui package anyways?
const HoliWebView: React.VFC<HoliWebViewProps> = ({ uri, style }) => {
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()

  const errormessage = t('webview.error')

  const handleError = useCallback(
    (error: unknown) => {
      displayError(error, errormessage)
    },
    [displayError, errormessage]
  )

  const renderError = () => (
    <View style={styles.messageContainer}>
      <HoliText>{errormessage} </HoliText>
    </View>
  )

  return (
    <WebView
      style={style}
      source={{
        uri,
      }}
      onError={handleError}
      onHttpError={handleError}
      onRenderProcessGone={handleError}
      startInLoadingState={true}
      renderLoading={() => <HoliLoader style={styles.loaderContainer} />}
      renderError={renderError}
    />
  )
}

const styles = StyleSheet.create({
  loaderContainer: {
    backgroundColor: colors.background10,
  },
  messageContainer: {
    alignItems: 'center',
    position: 'absolute',
    paddingTop: vars.topBarHeight + 50,
    backgroundColor: colors.background10,
    width: '100%',
    height: '100%',
  },
})

export default HoliWebView

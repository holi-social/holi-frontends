import type React from 'react'
import { useEffect, useRef } from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import type { WebView } from 'react-native-webview'
import { useTranslation } from 'react-i18next'

import HoliWebView from '@holi/core/components/HoliWebView'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { Text } from 'holi-bricks/components/text'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { MoreFilled, Share } from '@holi/icons/src/generated'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import { useTheme } from '@holi/ui/styles/theme'

interface WebViewHandlerProps {
  url: string
  visible: boolean
  onClose: () => void
  shareAction: () => void
  sourceType?: 'recommendation' | 'quote'
  insightId?: string
}

const extractDomainFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(url)
    let domain = urlObj.hostname

    if (domain.startsWith('www.')) {
      domain = domain.substring(4)
    }

    return domain
  } catch {
    return url
  }
}

/**
 * A reusable HoliWebView extension component for displaying external links from Insights Quotes and Recommendations within the app
 */

const WebViewHandler: React.FC<WebViewHandlerProps> = ({
  url,
  visible,
  onClose,
  shareAction,
  sourceType = 'recommendation',
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme
  const webViewRef = useRef(null as unknown as WebView)
  const setScreenOptions = useSetScreenOptions()

  useEffect(() => {
    if (!visible || Platform.OS === 'web') return

    const sourceName = extractDomainFromUrl(url)

    setScreenOptions({
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerTitle: () => (
        <Text headingLevel="1" size="lg">
          {sourceName}
        </Text>
      ),
      headerRight: () => (
        <HoliActionDrawer.Drawer
          label={t('global.moreOptions')}
          buttonElement={<HoliIcon icon={MoreFilled} colorOverride={colors.black300} />}
        >
          <HoliActionDrawer.Action
            icon={Share}
            title={t('global.share')}
            testID={`btn-share-${sourceType}`}
            handleAction={shareAction}
          />
        </HoliActionDrawer.Drawer>
      ),
      headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} onPress={onClose} />,
    })
  }, [visible, url, setScreenOptions, t, colors.black300, onClose, shareAction, sourceType])

  if (!visible) return null

  return (
    <View style={styles.container}>
      <HoliWebView
        theme={theme}
        webViewRef={webViewRef}
        webViewProps={{
          source: { uri: url },
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
})

export default WebViewHandler

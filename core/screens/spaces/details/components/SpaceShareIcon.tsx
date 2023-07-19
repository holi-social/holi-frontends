import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Clipboard, Modal, Platform, Pressable, StyleSheet, View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Share } from '@holi/icons/src/generated'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

type SpaceShareIconProps = {
  url: string
  color?: string
  title?: string | null
}

const SpaceShareIcon: React.VFC<SpaceShareIconProps> = ({ url, title, color }: SpaceShareIconProps) => {
  const { t } = useTranslation()
  const prefix = useRef('')
  const [show, setShow] = React.useState(false)
  const [isCopied, setIsCopied] = React.useState(false)

  useEffect(() => {
    import(/* webpackPrefetch: true */ 'expo-linking').then(
      (Linking) => (prefix.current = Linking.createURL(`/spaces/${title}`))
    )
  }, [title])

  const onShareMobile = async () => {
    try {
      const result = await Share.share({
        message: title + (Platform.OS === 'android' ? `: ${prefix.current}` : ''),
        url: prefix.current,
      })
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message)
    }
  }

  const copyToClipboard = () => {
    Clipboard.setString(prefix.current)
    setIsCopied(true)
    setTimeout(() => {
      setShow(false)
      setTimeout(() => {
        setIsCopied(false)
      }, 500)
    }, 1500)
  }

  const onShareWeb = () => {
    setShow(true)
  }

  const isWeb = Platform.OS === 'web'

  return (
    <>
      <Pressable onPress={isWeb ? onShareWeb : onShareMobile} testID="space-share-btn">
        <HoliIcon icon={Share} style={styles.shareIcon} color={color} />
      </Pressable>
      <Modal animationType="fade" transparent visible={show} accessibilityLabel={t('spaces:spaces.share')}>
        <View style={styles.modalContainer}>
          <Pressable onPress={() => setShow(false)} style={styles.backdrop} testID="close-modal" />
          <View style={styles.modalView}>
            {!isCopied ? (
              <>
                <View style={{ flexDirection: 'row' }}>
                  <HoliHeading level="4" size="small">
                    {t('spaces:spaces.share')}
                  </HoliHeading>
                </View>
                <HoliText style={styles.description} testID="space-share-link">
                  {url}
                </HoliText>
                <View style={styles.buttonContainer}>
                  <HoliButton
                    label={t('spaces:spaces.share.copy.link')}
                    onPress={copyToClipboard}
                    testID="space-share-url-btn"
                  >
                    <HoliText bold>{t('spaces:spaces.share.copy.link')}</HoliText>
                  </HoliButton>
                </View>
              </>
            ) : (
              <HoliText bold style={styles.copiedText}>
                {t('spaces:spaces.share.copied')}
              </HoliText>
            )}
          </View>
        </View>
      </Modal>
    </>
  )
}

export default SpaceShareIcon

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  backdrop: {
    opacity: 0.4,
    backgroundColor: colors.foreground30,
    ...StyleSheet.absoluteFillObject,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 24,
  },
  description: {
    marginTop: 8,
    color: colors.foreground20,
  },
  modalView: {
    maxWidth: 460,
    padding: 24,
    margin: 25,
    alignSelf: 'center',
    backgroundColor: colors.background10,
    borderWidth: 2,
    borderRadius: 24,
    borderColor: colors.foreground30,
    shadowColor: colors.foreground30,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  copiedText: {
    color: colors.error20,
  },
  shareIcon: {
    marginRight: 10, // Adjust the margin value as needed
  },
})

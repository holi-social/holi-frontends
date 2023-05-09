import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Clipboard, Modal, Share as NativeShare, Platform, Pressable, StyleSheet, View } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

interface Props {
  title: string
  slug: string
}

export const Share = ({ slug, title }: Props) => {
  const prefix = useRef('')
  const [show, setShow] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const { t } = useTranslation()
  const { displayError } = useErrorHandling()

  useEffect(() => {
    import('expo-linking').then((Linking) => {
      prefix.current = Linking.createURL(slug)
    })
  }, [slug])

  const handleShareMobile = async () => {
    try {
      await NativeShare.share({
        message: title + (Platform.OS === 'android' ? `: ${prefix.current}` : ''),
        url: prefix.current,
      })
    } catch (error) {
      displayError(error)
    }
  }

  const copyToClipboard = async () => {
    Clipboard.setString(prefix.current)
    setIsCopied(true)

    setTimeout(() => {
      setShow(false)
      setIsCopied(false)
    }, 1500)
  }

  const handleShareWeb = () => {
    setShow(true)
  }

  return (
    <>
      <HoliButton
        label={t('global.share')}
        contentStyle={styles.buttonContent}
        transparent
        inline
        onPress={Platform.OS === 'web' ? handleShareWeb : handleShareMobile}
        testID="space-share-btn"
      >
        <HoliBox padding={[0, 10, 0, 0]}>
          <HoliIcon icon="share" size={24} color={colors.foreground30} />
        </HoliBox>
        <HoliText bold>{t('global.share')}</HoliText>
      </HoliButton>
      <Modal animationType="fade" transparent visible={show} accessibilityLabel={t('global.share')}>
        <View style={styles.modalContainer}>
          <Pressable onPress={() => setShow(false)} style={styles.backdrop} testID="close-modal" />
          <View style={styles.modalView}>
            {!isCopied ? (
              <>
                <View style={{ flexDirection: 'row' }}>
                  <HoliHeading level="4" size="small">
                    {t('global.share')}
                  </HoliHeading>
                </View>
                <HoliText style={styles.description} testID="space-share-link">
                  {prefix.current}
                </HoliText>
                <View style={styles.buttonContainer}>
                  <HoliButton
                    label={t('global.share.copy.link')}
                    onPress={copyToClipboard}
                    testID="space-share-url-btn"
                  >
                    <HoliText bold>{t('global.share.copy.link')}</HoliText>
                  </HoliButton>
                </View>
              </>
            ) : (
              <HoliText bold style={styles.copiedText}>
                {t('global.share.copied')}
              </HoliText>
            )}
          </View>
        </View>
      </Modal>
    </>
  )
}

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
    justifyContent: 'space-between',
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
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 32,
  },
  copiedText: {
    color: colors.error20,
  },
})

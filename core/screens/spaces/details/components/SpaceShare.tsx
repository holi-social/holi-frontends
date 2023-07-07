import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Alert,
  Clipboard,
  Modal,
  Platform,
  Pressable,
  Share,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'

import { Space, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import { colors } from '@holi/ui/styles/globalVars'

type SpaceShareProps = {
  space: Space
  style?: StyleProp<ViewStyle>
}

const SpaceShare: React.VFC<SpaceShareProps> = ({ space, style }: SpaceShareProps) => {
  const { t } = useTranslation()
  const prefix = useRef('')
  const [show, setShow] = React.useState(false)
  const [isCopied, setIsCopied] = React.useState(false)

  const isCollaborator = space.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)
  const isAdministrator = space.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)

  // dynamic import is used to fix Web SSR building and do not put expo libs into Next.JS build
  // TODO: but better solution will be to create your Linking module, that re-export `expo-linking` for mobile and provide dependency free solution for Web
  // TODO: refactor with HOLI-4898
  useEffect(() => {
    import(/* webpackPrefetch: true */ 'expo-linking').then(
      (Linking) => (prefix.current = Linking.createURL(`/spaces/${space.name}`))
    )
  }, [space.name])

  const onShareMobile = async () => {
    try {
      const result = await Share.share({
        message: space.title + (Platform.OS === 'android' ? `: ${prefix.current}` : ''),
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
    }, 1500)
  }

  const onShareWeb = () => {
    setShow(true)
  }

  useEffect(() => {
    setTimeout(() => {
      setIsCopied(false)
    }, 1000)
  }, [show])

  return (
    <>
      {isCollaborator || isAdministrator ? (
        <HoliButtonLoading
          inline
          type="secondary"
          variant="small"
          label={t('spaces.share')}
          onPress={Platform.OS !== 'web' ? onShareMobile : onShareWeb}
          style={style}
          icon="share"
          testID="follow-btn"
        />
      ) : null}
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
                  {prefix.current}
                </HoliText>
                <View style={styles.buttonContainer}>
                  <HoliButton
                    label={t('spaces:spaces.share.copy.link')}
                    style={style}
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

export default SpaceShare

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
    paddingVertical: 18,
  },
  shareText: {
    marginLeft: 11,
    color: colors.foreground30,
  },
  copiedText: {
    color: colors.error20,
  },
})

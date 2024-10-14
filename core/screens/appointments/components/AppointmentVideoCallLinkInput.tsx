import React, { memo, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { urlRegex } from '@holi/core/helpers'
import { jitsiUrl } from '@holi/core/helpers/config'
import digitalTools from '@holi/core/static/digitalTools'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Add, Delete, Settings3, Vidicon } from '@holi/icons/src/generated'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const autoGenerateJitsiUrl = () => {
  const characters = 'abcdefghijklmnopqrstuvwxyz'
  const sectionsLength = [3, 4, 3] // Length of each section in the format
  let code = ''

  sectionsLength.forEach((length, index) => {
    for (let i = 0; i < length; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    if (index !== sectionsLength.length - 1) {
      code += '-'
    }
  })

  return `${jitsiUrl}/${code}`
}

const getMeetingProvider = (url = '') => {
  // first check if it's using the custom jitsiUrl
  if (url.includes(jitsiUrl)) {
    return digitalTools.find((t) => t.name.toLowerCase().includes('jitsi'))
  }
  // if not, check what tool it's using
  return digitalTools.filter((t) => (url || '').toLowerCase().includes(t.slug))[0]
}

interface AppointmentVideoCallLinkInputProps {
  style?: StyleProp<ViewStyle>
  testID?: string
  url?: string
  additionalInfo?: string
  onChangeUrl: (url: string) => void
  onChangeAdditionalInfo: (url: string) => void
}

const AppointmentVideoCallLinkInput: React.FC<AppointmentVideoCallLinkInputProps> = ({
  style,
  testID,
  url,
  additionalInfo,
  onChangeUrl,
  onChangeAdditionalInfo,
}: AppointmentVideoCallLinkInputProps) => {
  const { show: showModal, hide: hideModal, props: modalProps } = useModalState()
  const { show: showDeleteModal, visible: deleteModalVisible, hide: hideDeleteModal } = useModalState()
  const [urlError, setUrlError] = useState<string>()
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { colors } = theme

  const meetingProvider = getMeetingProvider(url)

  useEffect(() => {
    // Check if the input URL is in a valid format
    if (!!url && !urlRegex.test(url) && url.length > 0) {
      setUrlError(t('global.validation.url.invalid'))
    } else {
      setUrlError(undefined)
    }
  }, [t, url])

  const onDismissModal = () => {
    // clear url in case modal is closed while it is invalid
    if (!url || urlError) {
      onChangeUrl('')
    }
    hideModal()
  }

  const handleDelete = () => {
    onChangeUrl('')
    onChangeAdditionalInfo('')
    hideDeleteModal()
    hideModal()
  }

  return (
    <>
      <View style={style}>
        {!url && (
          <View style={styles.buttonWrapper}>
            <HoliButton
              label={t('global.time')}
              testID={`btn-${testID}`}
              type="secondary"
              onPress={() => onChangeUrl(autoGenerateJitsiUrl())}
              inline
            >
              <HoliText>{t('global.videoCall.add.button')}</HoliText>
              <HoliIcon icon={Add} style={styles.buttonIcon} />
            </HoliButton>
          </View>
        )}
        {!!url && (
          <View style={styles.card}>
            {!!meetingProvider && (
              <View style={styles.iconContainer}>
                <HoliLocalImage
                  imageSource={meetingProvider.img}
                  width={32}
                  height={32}
                  label={meetingProvider.name}
                  resizeMode="contain"
                />
              </View>
            )}
            {!meetingProvider && (
              <View style={[styles.placeholderIcon, styles.placeholderIconSM]}>
                <HoliIcon icon={Vidicon} size={16} />
              </View>
            )}
            <View style={styles.detailsContainer}>
              <HoliText ellipsizeMode="tail" bold numberOfLines={1} style={styles.meetingProviderUrl}>
                {url}
              </HoliText>
              {!!additionalInfo && (
                <HoliText ellipsizeMode="middle" size="extrasmall" color="gray300" style={styles.meetingProviderInfo}>
                  {additionalInfo}
                </HoliText>
              )}
            </View>
            <HoliButton transparent inline label={t('global.edit')} onPress={showModal} style={styles.editButton}>
              <HoliIcon icon={Settings3} size={24} color={colors.foreground30} />
            </HoliButton>
          </View>
        )}
      </View>
      <HoliModal label={t('global.videoCall.add.button')} {...modalProps} onDismiss={onDismissModal}>
        <ScrollView>
          <View style={mixins.container}>
            <View style={styles.modalTitleContainer}>
              <View style={styles.iconContainer}>
                {meetingProvider && (
                  <HoliLocalImage
                    imageSource={meetingProvider.img}
                    width={40}
                    height={40}
                    label={meetingProvider.name}
                    resizeMode="contain"
                  />
                )}
                {!meetingProvider && (
                  <View style={[styles.placeholderIcon, styles.placeholderIconMD]}>
                    <HoliIcon icon={Vidicon} size={16} />
                  </View>
                )}
              </View>
              {!!url && (
                <HoliBox padding={[0, 0, 0, 12]} layout={styles.modalTitle}>
                  <HoliHeading ellipsizeMode="tail">{url.replace('https://', '')}</HoliHeading>
                </HoliBox>
              )}
            </View>
            <View style={styles.modalDescriptionContainer}>
              <HoliText color="gray300">{t('spaces.appointments.input.videoCall.description')}</HoliText>
            </View>
            <HoliTextInput
              value={url}
              onChange={onChangeUrl}
              placeholder={t('global.https.placeholder')}
              inputLabel={t('global.url')}
              aria-label={t('global.url')}
              validationErrorText={urlError}
              inputProps={{
                keyboardType: 'url',
                inputMode: 'url',
                autoFocus: true,
              }}
              style={styles.input}
            />
            <HoliTextInput
              value={additionalInfo}
              onChange={onChangeAdditionalInfo}
              placeholder={t('spaces.appointments.input.videoCall.additionalInfo.placeholder')}
              inputLabel={t('spaces.appointments.input.videoCall.additionalInfo.label')}
              aria-label={t('spaces.appointments.input.videoCall.additionalInfo.label')}
              maxNoOfCharacters={100}
              noOfVisibleLines={4}
              maxNoOfVisibleLines={4}
              showCharacterCount
              style={styles.input}
            />
            <View style={styles.modalOptionsContainer}>
              <HoliButton
                transparent
                label={t('spaces.appointments.input.videoCall.delete.button')}
                contentStyle={styles.modalOptionButton}
                onPress={showDeleteModal}
              >
                <HoliIcon icon={Delete} color={colors.error20} style={styles.modalOptionIcon} />
                <HoliText color="error200">{t('spaces.appointments.input.videoCall.delete.button')}</HoliText>
              </HoliButton>
            </View>
          </View>
        </ScrollView>
        <HoliButton
          label={t('global.done')}
          inline
          testID="appointment-video-call-link-save-button"
          style={[mixins.container, styles.overlayButton]}
          onPress={hideModal}
        >
          {t('global.done')}
        </HoliButton>
        <HoliConfirmation
          primaryButtonType="warning"
          show={deleteModalVisible}
          label={t('spaces.appointments.input.videoCall.delete.button')}
          title={t('spaces.appointments.input.videoCall.delete.button')}
          description={t('spaces.appointments.input.videoCall.delete.confirmation')}
          onDismiss={hideDeleteModal}
          secondaryText={t('global.dismiss')}
          primaryText={t('global.delete')}
          testID="video-linkform-modal-exit-confirmation"
          onPrimary={handleDelete}
        />
      </HoliModal>
    </>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    buttonWrapper: {
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
    buttonIcon: {
      paddingLeft: 6,
    },
    card: {
      padding: 16,
      gap: 12,
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: theme.colors.background10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.background20,
    },
    iconContainer: {
      borderRadius: 8,
      position: 'relative',
      overflow: 'hidden',
    },
    placeholderIcon: {
      backgroundColor: theme.colors.background20,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    placeholderIconSM: {
      height: 32,
      width: 32,
    },
    placeholderIconMD: {
      height: 40,
      width: 40,
    },
    meetingProviderUrl: {
      flex: 1,
    },
    meetingProviderInfo: {
      paddingTop: 8,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      flex: 1,
      alignSelf: 'stretch',
    },
    editButton: {
      marginLeft: 12,
    },
    modalTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    modalTitle: {
      maxWidth: '85%',
    },
    modalDescriptionContainer: {
      marginTop: 16,
    },
    input: {
      marginTop: 24,
    },
    modalOptionsContainer: {
      marginTop: 24,
      borderTopWidth: 1,
      borderTopColor: theme.colors.background30,
      paddingBottom: dimensions.bottomBarHeight + 60,
    },
    modalOptionButton: {
      flexDirection: 'row',
      display: 'flex',
      padding: 12,
      alignItems: 'center',
    },
    modalOptionIcon: {
      marginRight: 12,
    },
    overlayButton: {
      position: Platform.OS === 'web' ? 'fixed' : 'absolute',
      bottom: 40,
      justifyContent: 'center',
      alignSelf: 'center',
      width: 420,
      maxWidth: '90%',
    },
    detailsContainer: {
      alignItems: 'flex-start',
      flex: 1,
      paddingTop: 4,
    },
  })

export default memo(AppointmentVideoCallLinkInput)

import React, { memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { urlRegex } from '@holi/core/helpers'
import { jitsiUrl } from '@holi/core/helpers/config'
import digitalTools from '@holi/core/static/digitalTools'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Add, Delete, Settings3, Vidicon } from '@holi/icons/src/generated'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { colors, vars } from '@holi/ui/styles/globalVars'
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
                <HoliLocalImage imageSource={meetingProvider.img} width={32} height={32} label={meetingProvider.name} />
              </View>
            )}
            {!meetingProvider && (
              <View style={[styles.placeholderIcon, styles.placeholderIconSM]}>
                <HoliIcon icon={Vidicon} size={16} />
              </View>
            )}
            <HoliText ellipsizeMode="tail" numberOfLines={1} style={styles.meetingProviderUrl}>
              {url}
            </HoliText>
            <HoliButton transparent inline label={t('global.edit')} onPress={showModal} style={styles.editButton}>
              <HoliIcon icon={Settings3} size={20} color={colors.foreground20} />
            </HoliButton>
          </View>
        )}
      </View>
      <HoliModal label={t('global.videoCall.add.button')} {...modalProps} onDismiss={onDismissModal}>
        <View style={mixins.container}>
          <View style={styles.modalTitleContainer}>
            <View style={styles.iconContainer}>
              {meetingProvider && (
                <HoliLocalImage imageSource={meetingProvider.img} width={40} height={40} label={meetingProvider.name} />
              )}
              {!meetingProvider && (
                <View style={[styles.placeholderIcon, styles.placeholderIconMD]}>
                  <HoliIcon icon={Vidicon} size={16} />
                </View>
              )}
            </View>
            {!!url && (
              <HoliHeading style={styles.modalTitle} lineBreakMode="tail">
                {url.replace('https://', '')}
              </HoliHeading>
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
            maxNoOfCharacters={240}
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
      </HoliModal>
      <HoliConfirmation
        confirmationButtonType="warning"
        show={deleteModalVisible}
        label={t('spaces.appointments.input.videoCall.delete.button')}
        title={t('spaces.appointments.input.videoCall.delete.button')}
        description={t('spaces.appointments.input.videoCall.delete.confirmation')}
        onDismiss={hideDeleteModal}
        dismissText={t('global.dismiss')}
        confirmText={t('global.delete')}
        testID="video-linkform-modal-exit-confirmation"
        onConfirm={handleDelete}
      />
    </>
  )
}

const styles = StyleSheet.create({
  buttonWrapper: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  buttonIcon: {
    paddingLeft: 6,
  },
  card: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.background20,
  },
  iconContainer: {
    borderRadius: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  placeholderIcon: {
    backgroundColor: colors.background20,
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
    marginLeft: 12,
    flex: 1,
  },
  editButton: {
    marginLeft: 12,
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    marginLeft: 12,
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
    borderTopColor: colors.background30,
    paddingBottom: +vars.bottomBarHeight + 64,
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
})

export default memo(AppointmentVideoCallLinkInput)

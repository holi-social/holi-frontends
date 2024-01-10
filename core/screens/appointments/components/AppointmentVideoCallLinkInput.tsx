import React, { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import { jitsiUrl } from '@holi/core/helpers/config'
import { getLocale } from '@holi/core/i18n/helpers/dateHelper'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { INVITE_ONLY_TYPE } from '@holi/core/screens/appointments/components/AppointmentInputForm'
import AppointmentDrawer from '@holi/core/screens/spaces/appointments/components/AppointmentDrawer'
import digitalTools from '@holi/core/static/digitalTools'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Add, GlobeFilled, LockFilled, MapPin2, More, Settings3, Time, VideoChat } from '@holi/icons/src/generated'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { localizeDate } from '@holi/ui/helper/date'
import { colors } from '@holi/ui/styles/globalVars'
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
  console.log(url, jitsiUrl, url.includes(jitsiUrl))
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
  const { t } = useTranslation()
  const mixins = useStyleMixins()

  const meetingProvider = getMeetingProvider(url)

  console.log(meetingProvider)

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
            <HoliText ellipsizeMode="tail" numberOfLines={1} style={styles.meetingProviderUrl}>
              {url}
            </HoliText>
            <HoliButton transparent inline label={t('global.edit')} onPress={showModal} style={styles.editButton}>
              <HoliIcon icon={Settings3} size={20} color={colors.foreground20} />
            </HoliButton>
          </View>
        )}
      </View>
      <HoliModal label={t('global.videoCall.add.button')} {...modalProps}>
        <View style={mixins.container}>
          <HoliTextInput
            value={url}
            onChange={onChangeUrl}
            placeholder={t('global.https.placeholder')}
            inputLabel={t('global.url')}
            aria-label={t('global.url')}
            inputProps={{
              keyboardType: 'url',
              inputMode: 'url',
              autoFocus: true,
            }}
          />
          <HoliTextInput
            value={additionalInfo}
            onChange={onChangeAdditionalInfo}
            placeholder={t('spaces.appointments.input.videoCall.additionalInfo.placeholder')}
            inputLabel={t('spaces.appointments.input.videoCall.additionalInfo.label')}
            aria-label={t('spaces.appointments.input.videoCall.additionalInfo.label')}
            maxNoOfCharacters={240}
            showCharacterCount
          />
        </View>
      </HoliModal>
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
  meetingProviderUrl: {
    marginLeft: 12,
    flex: 1,
  },
  editButton: {
    marginLeft: 12,
  },
})

export default memo(AppointmentVideoCallLinkInput)

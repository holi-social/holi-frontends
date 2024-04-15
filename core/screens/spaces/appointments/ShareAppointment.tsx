import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { LinkType, useShareLink } from '@holi/core/hooks/useShareLink'
import { Appointment } from '@holi/core/screens/appointments/types'
import { Space } from '@holi/core/screens/spaces/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { FileCopy, Share } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

type ShareAppointmentProps = {
  space: Space
  appointment: Appointment
  isMobile: boolean
  date: string
  startTime: string
}

const ShareAppointment: React.FC<ShareAppointmentProps> = ({
  space,
  appointment,
  isMobile,
  date,
  startTime,
}: ShareAppointmentProps) => {
  const { t } = useTranslation()

  const message = `${t('spaces.appointments.share.message.title')}${t('spaces.appointments.share.message.text', {
    appointment: appointment.title,
    space: space.title,
  })}${t('spaces.appointments.share.message.date', { date: date, time: startTime })}${
    appointment.locationDetails?.completeAddress
      ? t('spaces.appointments.share.message.location', { location: appointment.locationDetails.completeAddress })
      : ''
  }${appointment.videoCallLink?.url ? t('spaces.appointments.share.message.link') : ''}${
    appointment.videoCallLink?.url ? appointment.videoCallLink?.url : ''
  }`

  const [, shareLink] = useShareLink({
    link: `/spaces/${space?.name}/appointments/${appointment?.id}`,
    linkType: LinkType.UNIVERSAL,
    message: isMobile ? message : '',
  })

  return (
    <HoliButton
      transparent
      label={isMobile ? t('global.share') : t('spaces.appointments.copyLink')}
      onPress={shareLink}
    >
      <View style={styles.shareContainer}>
        <HoliIcon icon={isMobile ? Share : FileCopy} size={24} style={styles.shareIcon} />
        <HoliText bold>{isMobile ? t('global.share') : t('spaces.appointments.copyLink')}</HoliText>
      </View>
    </HoliButton>
  )
}

const styles = StyleSheet.create({
  shareContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingRight: 12,
  },
  shareIcon: {
    marginTop: -2,
  },
})

export default ShareAppointment

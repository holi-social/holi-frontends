import type React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { isApp } from '@holi/core/helpers/isApp'
import { LinkType, useShareLink } from '@holi/core/hooks/useShareLink'
import type { Space } from '@holi/core/screens/spaces/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { FileCopy, Share } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import type { Appointment } from '@holi/api/graphql/graphql-codegen'

type ShareAppointmentProps = {
  space: Space
  appointment: Appointment
  date: string
  startTime: string
}

const ShareAppointment: React.FC<ShareAppointmentProps> = ({
  space,
  appointment,
  date,
  startTime,
}: ShareAppointmentProps) => {
  const { t } = useTranslation()

  const meetLink = appointment.videoCallLink?.url
    ? `${t('spaces.appointments.share.message.link')} ${appointment.videoCallLink?.url}`
    : ''
  const message = `${t('spaces.appointments.share.message.title')}${t('spaces.appointments.share.message.text', {
    appointment: appointment.title,
    space: space.title,
  })}${t('spaces.appointments.share.message.date', { date: date, time: startTime })}${
    appointment.locationDetails?.completeAddress
      ? t('spaces.appointments.share.message.location', { location: appointment.locationDetails.completeAddress })
      : ''
  }${meetLink}\n`

  const [, shareLink] = useShareLink({
    link: `/spaces/${space?.name}/appointments/${appointment?.id}`,
    linkType: LinkType.UNIVERSAL,
    message: isApp ? message : '',
  })

  return (
    <HoliButton transparent label={isApp ? t('global.share') : t('spaces.appointments.copyLink')} onPress={shareLink}>
      <View style={styles.shareContainer}>
        <HoliIcon icon={isApp ? Share : FileCopy} size={24} style={styles.shareIcon} />
        <HoliText bold>{isApp ? t('global.share') : t('spaces.appointments.copyLink')}</HoliText>
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

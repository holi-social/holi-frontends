import { useMutation } from '@apollo/client'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import {
  GenerateAppointmentIcsFileResponse,
  generateAppointmentIcsFileMutation,
} from '@holi/core/screens/appointments/mutations'
import { Appointment } from '@holi/core/screens/appointments/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { CalendarCheck } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

interface AppointmentCalendarButtonProps {
  appointment: Appointment
}

const AppointmentCalendarButton: React.FC<AppointmentCalendarButtonProps> = ({ appointment: { id } }) => {
  const { t } = useTranslation()
  const [generateAppointmentIcsFile] = useMutation<GenerateAppointmentIcsFileResponse>(
    generateAppointmentIcsFileMutation,
    {
      onError: (error) =>
        logError(error, 'Failed to generate appointment .ics file', {
          location: 'AppointmentDetails.generateAppointmentIcsFile',
          id,
        }),
    }
  )

  const handleGenerateIcsFile = async () => {
    try {
      const response = await generateAppointmentIcsFile({ variables: { appointmentId: id } })
      if (response.data) {
        return // This will be handled in a separate merge request
      } else {
        logError(response.errors, 'Could not generate appointment .ics file', {
          location: 'AppointmentDetails.handleGenerateIcsFile',
        })
      }
    } catch (error) {
      logError(error, 'Could not generate appointment .ics file', {
        location: 'AppointmentDetails.handleGenerateIcsFile',
      })
    }
  }
  return (
    <>
      <HoliButton
        transparent
        label={t('spaces.appointments.addToCallendar.button.label')}
        onPress={handleGenerateIcsFile}
      >
        <View style={styles.calendarButtonContainer}>
          <HoliIcon icon={CalendarCheck} size={24} />
          <HoliText bold>{t('spaces.appointments.addToCallendar.button.label')}</HoliText>
        </View>
      </HoliButton>
      <HoliText color="gray300" size="small" style={styles.calendarButtonDescription}>
        {t('spaces.appointments.addToCallendar.description')}
      </HoliText>
    </>
  )
}

const styles = StyleSheet.create({
  calendarButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingRight: 12,
  },
  calendarButtonDescription: {
    marginLeft: 30,
  },
})

export default memo(AppointmentCalendarButton)

import { useMutation } from '@apollo/client'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { logError } from '@holi/core/errors/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
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

const AppointmentCalendarButton: React.FC<AppointmentCalendarButtonProps> = ({ appointment: { id, slug } }) => {
  const { t } = useTranslation()
  const { isLoggedIn } = useLoggedInUser()
  const { navigate } = useRouting()

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
        const icsDataBytes = atob(response.data.generateAppointmentIcsFile)
        const blob = new Blob([icsDataBytes], { type: 'text/calendar' })
        const url = window.URL.createObjectURL(blob)

        // Create a link element and trigger a click to download the file
        const link = document.createElement('a')
        link.href = url
        link.download = `${slug}.ics`
        document.body.appendChild(link)
        link.click()

        // Remove the link element
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
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
        label={
          isLoggedIn
            ? t('spaces.appointments.addToCallendar.button.label')
            : t('spaces.appointments.addToCallendar.login.label')
        }
        onPress={() => (isLoggedIn ? handleGenerateIcsFile() : navigate('/login'))}
      >
        <View style={styles.calendarButtonContainer}>
          <HoliIcon icon={CalendarCheck} size={24} />
          <HoliText bold>
            {isLoggedIn
              ? t('spaces.appointments.addToCallendar.button.label')
              : t('spaces.appointments.addToCallendar.login.label')}
          </HoliText>
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

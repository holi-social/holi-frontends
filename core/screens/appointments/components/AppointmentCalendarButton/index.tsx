import * as Calendar from 'expo-calendar'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import { logError } from '@holi/core/errors/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { Appointment } from '@holi/core/screens/appointments/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { CalendarCheck } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { colors } from '@holi/ui/styles/globalVars'

const CALENDAR_NAME = 'holi'

interface AppointmentCalendarButtonProps {
  appointment: Appointment
}

const AppointmentCalendarButton: React.FC<AppointmentCalendarButtonProps> = ({ appointment }) => {
  const { t } = useTranslation()
  const { isLoggedIn } = useAuth()
  const { navigate } = useRouting()
  const { openToast } = useToast()

  const getOrCreateCalendar = async () => {
    const calendars = await Calendar.getCalendarsAsync()
    const calendar = calendars.find((calendar) => calendar.name === CALENDAR_NAME)

    if (calendar) {
      return calendar
    }

    try {
      const calendarId = await Calendar.createCalendarAsync({
        title: CALENDAR_NAME,
        color: colors.brandA300,
        entityType: Calendar.EntityTypes.EVENT,
        source: { isLocalAccount: true, name: CALENDAR_NAME } as Calendar.Source,
        name: CALENDAR_NAME,
        ownerAccount: 'personal',
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
      })

      return calendars.find((calendar) => calendar.id === calendarId)
    } catch (error) {
      logError(error, 'Failed to create Holi calendar', {
        location: 'useCalendar.getOrCreateCalendar',
      })
    }
  }

  const getCalendar = async () => {
    const calendarPermission = await Calendar.requestCalendarPermissionsAsync()

    if (calendarPermission.granted) {
      if (Platform.OS === 'ios') {
        const remindersPermission = await Calendar.requestRemindersPermissionsAsync()
        if (remindersPermission.granted) {
          return Calendar.getDefaultCalendarAsync()
        } else {
          openToast(t('appointment.reminders.permissions.error.notGranted'), HoliToastType.ERROR)
        }
      } else {
        return getOrCreateCalendar()
      }
    }
    openToast(t('appointment.calendar.permissions.error.notGranted'), HoliToastType.ERROR)
  }

  const handleAddToCalendar = async () => {
    const calendar = await getCalendar()

    if (!calendar) {
      return
    }

    const eventDetails = {
      id: appointment.id,
      title: appointment.title,
      startDate: new Date(appointment.startDateTime),
      endDate: new Date(appointment.endDateTime),
      location: appointment.locationDetails?.completeAddress,
      organizer: appointment.creator?.fullName,
      url: appointment.videoCallLink?.url,
      notes: appointment.description,
    }

    const event = await Calendar.createEventAsync(calendar.id, eventDetails)
    if (event) {
      openToast(t('appointment.calendar.add.success'), HoliToastType.SUCCESS)
    } else {
      openToast(t('appointment.calendar.add.error'), HoliToastType.ERROR)
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
        onPress={() => (isLoggedIn ? handleAddToCalendar() : navigate('/login'))}
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

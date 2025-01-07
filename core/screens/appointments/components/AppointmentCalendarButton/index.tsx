import * as Calendar from 'expo-calendar'
import type React from 'react'
import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Platform, StyleSheet, View } from 'react-native'

import HoliModal, { useModalState } from '@holi//ui/components/molecules/HoliModal'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { logError } from '@holi/core/errors/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import type { Appointment } from '@holi/core/screens/appointments/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { CalendarCheck } from '@holi/icons/src/generated'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Button } from 'holi-bricks/components/button'

const CALENDAR_NAME = 'holi'

interface AppointmentCalendarButtonProps {
  appointment: Appointment
}

// Note: Android does not have a default calendar, so we need to create one to store Holi appointments.
const getOrCreateCalendar = async (theme: HoliTheme) => {
  const calendars = await Calendar.getCalendarsAsync()
  const calendar = calendars.find((calendar) => calendar.name === CALENDAR_NAME)

  if (calendar) {
    return calendar
  }

  try {
    const calendarId = await Calendar.createCalendarAsync({
      title: CALENDAR_NAME,
      color: theme.colors.brandA300,
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

const AppointmentCalendarButton: React.FC<AppointmentCalendarButtonProps> = ({ appointment }) => {
  const { t } = useTranslation()
  const { isLoggedIn } = useLoggedInUser()
  const { navigate } = useRouting()
  const { openToast } = useToast()
  const { show: showModal, hide: hideModal, props: modalProps } = useModalState()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const getCalendar = async () => {
    const calendarPermission = await Calendar.requestCalendarPermissionsAsync()

    if (calendarPermission.granted) {
      if (Platform.OS === 'ios') {
        return Calendar.getDefaultCalendarAsync()
      } else {
        return getOrCreateCalendar(theme)
      }
    }
    showModal()
  }

  const handleAddToCalendar = async () => {
    const calendar = await getCalendar()

    if (!calendar) {
      return
    }

    const eventDetails = {
      title: appointment.title,
      startDate: new Date(appointment.startDateTime),
      endDate: new Date(appointment.endDateTime),
      location: appointment.locationDetails?.completeAddress ?? appointment.videoCallLink?.url,
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

  const openSettings = () => {
    Linking.openSettings()
    hideModal()
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
      <HoliModal label="calendar-permissions" {...modalProps} autoHeight={true} style={styles.modal}>
        <HoliLocalImage
          imageSource={require('@holi/ui/assets/img/illustrations/calendar_permissions.svg')}
          width={70}
          height={60}
          label="calendar-permissions"
          isSvg
        />
        <HoliGap size="m" />
        <HoliText size="extralarge">{t('appointment.calendar.permissions.title')}</HoliText>
        <HoliGap size="s" />
        <HoliText>{t('appointment.calendar.permissions.description')}</HoliText>
        <HoliGap size="m" />
        <Button
          label={t('appointment.calendar.permissions.open.button.label')}
          variant="primary"
          onPress={openSettings}
        />
        <HoliGap size="s" />
        <Button
          label={t('appointment.calendar.permissions.close.button.label')}
          variant="secondary"
          onPress={hideModal}
        />
        <HoliGap size="s" />
      </HoliModal>
    </>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    calendarButtonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingRight: 12,
    },
    calendarButtonDescription: {
      marginLeft: 30,
    },
    modal: {
      backgroundColor: theme.colors.background30,
      padding: 24,
    },
  })

export default memo(AppointmentCalendarButton)

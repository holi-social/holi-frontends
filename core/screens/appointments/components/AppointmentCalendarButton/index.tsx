import * as Calendar from 'expo-calendar'
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Platform, StyleSheet, View } from 'react-native'

import HoliModal, { useModalState } from '@holi//ui/components/molecules/HoliModal'
import { useAuth } from '@holi/core/auth/helpers/useAuth'
import { logError } from '@holi/core/errors/helpers'
import { getLocale } from '@holi/core/i18n/helpers/dateHelper'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { Appointment } from '@holi/core/screens/appointments/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { CalendarCheck } from '@holi/icons/src/generated'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

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
  const { i18n, t } = useTranslation()
  const { isLoggedIn } = useAuth()
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

    // Expo 49 contains a bug that causes the event URL to be distorted when saved in an iOS calendar.
    // Include the "url" property to the event details after updating Expo.
    const locale = getLocale(i18n.language)

    const localizedVideoCallLink = locale === 'de' ? 'Videokonferenz-Link' : 'Video call link'

    const description = appointment.videoCallLink
      ? `${appointment.description}\n${localizedVideoCallLink}: ${appointment.videoCallLink.url}`
      : appointment.description

    const eventDetails = {
      id: appointment.id,
      title: appointment.title,
      startDate: new Date(appointment.startDateTime),
      endDate: new Date(appointment.endDateTime),
      location: appointment.locationDetails?.completeAddress ?? appointment.videoCallLink?.url,
      organizer: appointment.creator?.fullName,
      notes: description,
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
        <HoliButton
          label={t('appointment.calendar.permissions.open.button.label')}
          type="primary"
          onPress={openSettings}
        >
          <HoliText>{t('appointment.calendar.permissions.open.button.label')}</HoliText>
        </HoliButton>
        <HoliGap size="s" />
        <HoliButton
          label={t('appointment.calendar.permissions.close.button.label')}
          type="secondary"
          onPress={hideModal}
        >
          <HoliText>{t('appointment.calendar.permissions.close.button.label')}</HoliText>
        </HoliButton>
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

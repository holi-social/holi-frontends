import type React from 'react'
import { memo, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import type { Appointment, Space } from '@holi/api/graphql/graphql-codegen'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { SuppressSsrHydrationWarning } from '@holi/core/components/SuppressSsrHydrationWarning'
import { getLocale } from '@holi/core/i18n/helpers/dateHelper'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { INVITE_ONLY_TYPE } from '@holi/core/screens/appointments/components/AppointmentInputForm'
import AppointmentDrawer from '@holi/core/screens/spaces/appointments/components/AppointmentDrawer'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { GlobeFilled, LockFilled, MapPin2, More, Time, VideoChat } from '@holi/icons/src/generated'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { localizeDate } from '@holi/ui/helper/date'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { CalendarIcon } from 'holi-bricks/components/calendarIcon'

type AppointmentCardProps = {
  appointment: Appointment
  space: Pick<Space, 'id' | 'name'>
  isAdmin?: boolean
  isMember?: boolean
  pastAppointments?: boolean
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  space,
  isAdmin,
  isMember,
  pastAppointments,
}: AppointmentCardProps) => {
  const { t, i18n } = useTranslation()
  const { navigate } = useRouting()
  const loginState = useLoggedInUser()
  const [imageError, setImageError] = useState(false)
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { colors } = theme

  const currentLanguage = getLocale(i18n.language || '')
  const date = localizeDate(new Date(appointment.startDateTime), currentLanguage, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour12: false,
  })

  const endDate = localizeDate(new Date(appointment.endDateTime), currentLanguage, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour12: false,
  })

  const startTime = localizeDate(
    new Date(appointment.startDateTime),
    currentLanguage,
    {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    },
    true
  )

  const endTime = localizeDate(
    new Date(appointment.endDateTime),
    currentLanguage,
    {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    },
    true
  )

  const goToDetailView = () => navigate(`/spaces/${space.name}/appointments/${appointment.id}`)
  const isAppointmentCreator = loginState.isLoggedIn && appointment?.creator?.id === loginState.user?.id

  const shouldShowVisibilityLabel = loginState.isLoggedIn && (isMember || isAdmin)
  const userIsAllowedToEdit = isAdmin || isAppointmentCreator
  const isHybrid = appointment?.isHybrid

  return (
    <View key={appointment.id} style={styles.appointmentItem} testID="space-appointment-tile">
      <View style={styles.imageContainer}>
        {!imageError && !!appointment.thumbnail && (
          <HoliButton transparent label={appointment.title} onPress={goToDetailView} style={styles.clickOverlay}>
            <HoliImage
              label={t('spaces.appointments.thumbnail.label')}
              source={{ uri: appointment.thumbnail }}
              style={styles.image}
              onError={() => setImageError(true)}
              {...(appointment.thumbnailBlurhash ? { blurhash: appointment.thumbnailBlurhash } : {})}
            />
          </HoliButton>
        )}
        <View style={styles.header}>
          <AppointmentDrawer appointment={appointment} isAdmin={isAdmin} space={space}>
            <View style={appointment.thumbnail && !imageError ? styles.optionsWithImage : null}>
              <HoliIcon icon={More} colorOverride={colors.foreground30} />
            </View>
          </AppointmentDrawer>

          {shouldShowVisibilityLabel && (
            <View style={[styles.inviteOnly, appointment.thumbnail && !imageError ? styles.tagWithImage : {}]}>
              <HoliIcon
                icon={appointment.inviteOnly ? LockFilled : GlobeFilled}
                colorOverride={colors.foreground30}
                size={14}
                style={styles.iconGroupIcon}
              />
              <HoliText size="extrasmall">
                {t(
                  `appointment.card.${
                    appointment.inviteOnly ? INVITE_ONLY_TYPE.INVITE_ONLY : INVITE_ONLY_TYPE.PUBLIC
                  }.title`
                )}
              </HoliText>
            </View>
          )}
        </View>
      </View>

      <View
        style={[
          styles.detailContainer,
          appointment.thumbnail && !imageError ? styles.detailContainerWithImage : {},
          !userIsAllowedToEdit && !shouldShowVisibilityLabel ? styles.detailContainerWithoutHeader : {},
        ]}
      >
        <HoliButton
          transparent
          label={appointment.title}
          onPress={goToDetailView}
          style={[styles.clickOverlay, styles.flex1]}
          contentStyle={styles.titleButton}
        >
          <CalendarIcon
            day={new Date(appointment.startDateTime).getDate()}
            month={new Date(appointment.startDateTime).getMonth() + 1}
            size="sm"
            disabled={pastAppointments}
          />
          <HoliText ellipsizeMode="tail" bold numberOfLines={2} style={styles.flex1}>
            {appointment.title}
          </HoliText>
        </HoliButton>
      </View>
      <HoliButton
        transparent
        label={appointment.title}
        onPress={goToDetailView}
        style={[styles.clickOverlay, styles.paddingBottom]}
      >
        <View style={styles.iconsContainer}>
          <View style={styles.iconGroupContainer}>
            <HoliIcon icon={Time} size={12} colorOverride={colors.foreground20} style={styles.iconGroupIcon} />
            <HoliText style={styles.iconGroupText} size="extrasmall">
              <SuppressSsrHydrationWarning>
                {date} ∙ {startTime} {t('global.until')} {endDate !== date ? `${endDate} ∙ ` : ''}
                {endTime}
              </SuppressSsrHydrationWarning>
            </HoliText>
          </View>
        </View>

        {!loginState.isLoggedIn && isHybrid && (
          <View style={styles.iconsContainer}>
            <View style={styles.iconGroupContainer}>
              <HoliIcon icon={MapPin2} size={12} colorOverride={colors.foreground20} style={styles.iconGroupIcon} />
              <HoliText style={styles.iconGroupText} size="extrasmall">
                {t('appointment.card.hybrid.title')}
              </HoliText>
            </View>
          </View>
        )}

        {!loginState.isLoggedIn && !isHybrid && appointment.locationDetails && (
          <View style={styles.iconsContainer}>
            <View style={styles.iconGroupContainer}>
              <HoliText style={styles.noIconGroupText} size="extrasmall">
                {appointment.locationDetails.completeAddress}
              </HoliText>
            </View>
          </View>
        )}
        {!loginState.isLoggedIn && !isHybrid && appointment.hasVideoCallLink && (
          <View style={styles.iconsContainer}>
            <View style={styles.iconGroupContainer}>
              <HoliIcon icon={VideoChat} size={12} colorOverride={colors.foreground20} style={styles.iconGroupIcon} />
              <HoliText style={styles.iconGroupText} size="extrasmall">
                {t('appointment.card.virtual.title')}
              </HoliText>
            </View>
          </View>
        )}
        {loginState.isLoggedIn && appointment.locationDetails && (
          <View style={styles.iconsContainer}>
            <View style={styles.iconGroupContainer}>
              <HoliIcon icon={MapPin2} size={12} colorOverride={colors.foreground20} style={styles.iconGroupIcon} />
              <HoliText style={styles.iconGroupText} size="extrasmall">
                {appointment.locationDetails.completeAddress}
              </HoliText>
            </View>
          </View>
        )}
        {loginState.isLoggedIn && appointment.videoCallLink?.url && (
          <View style={styles.iconsContainer}>
            <View style={styles.iconGroupContainer}>
              <HoliIcon icon={VideoChat} size={12} colorOverride={colors.foreground20} style={styles.iconGroupIcon} />
              <HoliText style={styles.iconGroupText} size="extrasmall">
                {appointment.videoCallLink?.url}
              </HoliText>
            </View>
          </View>
        )}
      </HoliButton>
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      position: 'absolute',
      width: '100%',
      top: 8,
    },
    inviteOnly: {
      padding: 2,
      paddingRight: 4,
      height: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    tagWithImage: {
      borderRadius: 24,
      borderWidth: 1,
      borderColor: theme.colors.background30,
      backgroundColor: theme.colors.background10,
      marginLeft: 6,
    },
    optionsWithImage: {
      borderRadius: 6,
      borderWidth: 1,
      borderColor: theme.colors.background30,
      backgroundColor: theme.colors.background10,
      marginRight: 6,
    },
    detailContainer: {
      marginTop: 16,
      minHeight: 40,
      marginRight: 40,
    },
    detailContainerWithoutHeader: {
      marginTop: 0,
    },
    detailContainerWithImage: {
      marginTop: 0,
    },
    clickOverlay: {
      position: 'relative',
      pointerEvents: 'auto',
    },
    flex1: {
      flex: 1,
    },
    titleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 8,
    },
    image: {
      borderRadius: 8,
      height: 166,
      justifyContent: 'center',
    },
    imageContainer: {
      position: 'relative',
      marginBottom: 16,
    },
    appointmentItem: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.background30,
      backgroundColor: theme.colors.background10,
      padding: 8,
      flexShrink: 1,
    },
    iconsContainer: {
      marginTop: 4,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    iconGroupContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      flexShrink: 1,
      flex: 1,
    },
    iconGroupIcon: {
      marginRight: 4,
    },
    iconGroupText: {
      color: theme.colors.foreground20,
      marginRight: 8,
      maxWidth: '90%',
    },
    noIconGroupText: {
      color: theme.colors.foreground20,
      marginLeft: 16,
      marginRight: 8,
      maxWidth: '90%',
    },
    paddingBottom: {
      paddingBottom: 8,
    },
  })

export default memo(AppointmentCard)

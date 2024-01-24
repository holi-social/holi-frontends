import React, { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, useWindowDimensions } from 'react-native'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import { getLocale } from '@holi/core/i18n/helpers/dateHelper'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { INVITE_ONLY_TYPE } from '@holi/core/screens/appointments/components/AppointmentInputForm'
import { Appointment } from '@holi/core/screens/appointments/types'
import AppointmentDrawer from '@holi/core/screens/spaces/appointments/components/AppointmentDrawer'
import { Space } from '@holi/core/screens/spaces/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { GlobeFilled, LockFilled, MapPin2, More, Time, VideoChat } from '@holi/icons/src/generated'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliCalendarIcon from '@holi/ui/components/molecules/HoliCalendarIcon'
import { localizeDate } from '@holi/ui/helper/date'
import { colors, vars } from '@holi/ui/styles/globalVars'

type AppointmentCardProps = {
  appointment: Appointment
  space: Space
  isAdmin?: boolean
  isMember?: boolean
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  space,
  isAdmin,
  isMember,
}: AppointmentCardProps) => {
  const { t, i18n } = useTranslation()
  const { navigate } = useRouting()
  const { userId, isLoggedIn } = useAuth()
  const [imageError, setImageError] = useState(false)

  const { width: screenWidth } = useWindowDimensions()
  const styles = getStyles(screenWidth)

  const currentLanguage = getLocale(i18n.language || '')
  const date = localizeDate(new Date(appointment.startDateTime), currentLanguage, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })

  const endDate = localizeDate(new Date(appointment.endDateTime), currentLanguage, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })

  const startTime = localizeDate(
    new Date(appointment.startDateTime),
    currentLanguage,
    {
      hour: '2-digit',
      minute: '2-digit',
    },
    true
  )

  const endTime = localizeDate(
    new Date(appointment.endDateTime),
    currentLanguage,
    {
      hour: '2-digit',
      minute: '2-digit',
    },
    true
  )

  const goToDetailView = () => navigate(`/spaces/${space.name}/appointments/${appointment.id}`)
  const isAppointmentCreator = appointment?.creator.id === userId

  const shouldShowVisibilityLabel = isLoggedIn && (isMember || isAdmin)
  const userIsAllowedToEdit = isAdmin || isAppointmentCreator

  return (
    <View key={appointment.id} style={styles.appointmentItem} testID="space-appointment-tile">
      <View style={[styles.imageContainer, styles.imageMargin]}>
        {!imageError && !!appointment.thumbnail && screenWidth < +vars.breakpointS && (
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
        <View style={[styles.header]}>
          {shouldShowVisibilityLabel && (
            <View
              style={[
                styles.inviteOnly,
                appointment.thumbnail && !imageError && screenWidth < +vars.breakpointS ? styles.tagWithImage : {},
              ]}
            >
              <HoliIcon
                icon={appointment.inviteOnly ? LockFilled : GlobeFilled}
                color={colors.foreground30}
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
          {(isAdmin || isAppointmentCreator) && (
            <AppointmentDrawer appointment={appointment} isAdmin={isAdmin} space={space}>
              <View style={appointment.thumbnail && !imageError ? styles.optionsWithImage : null}>
                <HoliIcon icon={More} color={colors.foreground30} />
              </View>
            </AppointmentDrawer>
          )}
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View
          style={[
            styles.detailContainer,
            appointment.thumbnail && !imageError && screenWidth < +vars.breakpointS
              ? styles.detailContainerWithImage
              : {},
            !userIsAllowedToEdit && !shouldShowVisibilityLabel ? styles.detailContainerWithoutHeader : {},
          ]}
        >
          <HoliButton
            transparent
            label={appointment.title}
            onPress={goToDetailView}
            style={[styles.clickOverlay, screenWidth < +vars.breakpointS && styles.flex1]}
            contentStyle={styles.titleButton}
          >
            <HoliCalendarIcon
              day={new Date(appointment.startDateTime).getDate()}
              month={new Date(appointment.startDateTime).getMonth() + 1}
              size="small"
            />
            <HoliText ellipsizeMode="tail" bold numberOfLines={2} style={styles.flex1}>
              {appointment.title}
            </HoliText>
          </HoliButton>
          <HoliButton transparent label={appointment.title} onPress={goToDetailView} style={styles.clickOverlay}>
            <View style={styles.iconsContainer}>
              <View style={styles.iconGroupContainer}>
                <HoliIcon icon={Time} size={12} color={colors.foreground20} style={styles.iconGroupIcon} />
                <HoliText style={styles.iconGroupText} size="extrasmall">
                  {date} ∙ {startTime} {t('global.until')} {endDate !== date ? `${endDate} ∙ ` : ''}
                  {endTime}
                </HoliText>
              </View>
            </View>
            {!isLoggedIn && (
              <View style={styles.iconsContainer}>
                <View style={styles.iconGroupContainer}>
                  <HoliIcon icon={MapPin2} size={12} color={colors.foreground20} style={styles.iconGroupIcon} />
                  <HoliText style={styles.iconGroupText} size="extrasmall">
                    {t('appointment.card.login.location')}
                  </HoliText>
                </View>
              </View>
            )}
            {!isLoggedIn && (
              <View style={styles.iconsContainer}>
                <View style={styles.iconGroupContainer}>
                  <HoliIcon icon={VideoChat} size={12} color={colors.foreground20} style={styles.iconGroupIcon} />
                  <HoliText style={styles.iconGroupText} size="extrasmall">
                    {t('appointment.card.login.videochat')}
                  </HoliText>
                </View>
              </View>
            )}
            {isLoggedIn && appointment.location && (
              <View style={styles.iconsContainer}>
                <View style={styles.iconGroupContainer}>
                  <HoliIcon icon={MapPin2} size={12} color={colors.foreground20} style={styles.iconGroupIcon} />
                  <HoliText style={styles.iconGroupText} size="extrasmall">
                    {appointment.location}
                  </HoliText>
                </View>
              </View>
            )}
            {isLoggedIn && appointment.videoCallLink?.url && (
              <View style={styles.iconsContainer}>
                <View style={styles.iconGroupContainer}>
                  <HoliIcon icon={VideoChat} size={12} color={colors.foreground20} style={styles.iconGroupIcon} />
                  <HoliText style={styles.iconGroupText} size="extrasmall">
                    {appointment.videoCallLink?.url}
                  </HoliText>
                </View>
              </View>
            )}
          </HoliButton>
        </View>
        {!imageError && !!appointment.thumbnail && screenWidth > +vars.breakpointS && (
          <HoliButton transparent label={appointment.title} onPress={goToDetailView} style={styles.clickOverlay}>
            <HoliImage
              label={t('spaces.appointments.thumbnail.label')}
              source={{ uri: appointment.thumbnail }}
              style={styles.imageL}
              onError={() => setImageError(true)}
              {...(appointment.thumbnailBlurhash ? { blurhash: appointment.thumbnailBlurhash } : {})}
            />
          </HoliButton>
        )}
      </View>
    </View>
  )
}

const getStyles = (screenWidth: number) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      position: screenWidth > +vars.breakpointS ? 'relative' : 'absolute',
      width: '100%',
      top: screenWidth > +vars.breakpointS ? 0 : 8,
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
      borderWidth: screenWidth < +vars.breakpointS ? 1 : 0,
      borderColor: colors.background30,
      backgroundColor: colors.background10,
      marginLeft: 6,
    },
    optionsWithImage: {
      borderRadius: 6,
      borderWidth: screenWidth < +vars.breakpointS ? 1 : 0,
      borderColor: colors.background30,
      backgroundColor: colors.background10,
      marginRight: 6,
    },
    detailContainer: {
      marginTop: screenWidth < +vars.breakpointS ? 16 : undefined,
      minHeight: 40,
      alignSelf: 'stretch',
      display: 'flex',
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
      width: 'auto',
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
    imageL: {
      borderRadius: 8,
      height: 166,
      width: 224,
      justifyContent: 'center',
      alignSelf: 'center',
    },
    imageContainer: {
      position: 'relative',
    },
    imageMargin: {
      marginBottom: 16,
    },
    appointmentItem: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.background30,
      backgroundColor: colors.background10,
      padding: screenWidth > +vars.breakpointS ? 16 : 8,
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
      color: colors.foreground20,
      marginRight: 8,
      maxWidth: '90%',
    },
  })

/*     header: {
      flexDirection: 'row',
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
      borderColor: colors.background30,
      backgroundColor: colors.background10,
      marginLeft: 6,
    },
    optionsWithImage: {
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.background30,
      backgroundColor: colors.background10,
      marginRight: 6,
    },
    detailContainer: {
      marginTop: 16,
      minHeight: 40,
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
      borderColor: colors.background30,
      backgroundColor: colors.background10,
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
      color: colors.foreground20,
      marginRight: 8,
      maxWidth: '90%',
    },
  }) */

export default memo(AppointmentCard)

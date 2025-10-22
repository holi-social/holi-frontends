import { useQuery } from '@apollo/client'
import React, { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Platform, ScrollView, StyleSheet, View } from 'react-native'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { SuppressSsrHydrationWarning } from '@holi/core/components/SuppressSsrHydrationWarning'
import { jitsiUrl } from '@holi/core/helpers/config'
import { useClientWindowDimensions } from '@holi/core/helpers/useClientWindowDimensions'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import useRefreshOnNavigation, { type RefreshOnNavigationParams } from '@holi/core/hooks/useRefreshOnNavigation'
import { getLocale } from '@holi/core/i18n/helpers/dateHelper'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import AppointmentCalendarButton from '@holi/core/screens/appointments/components/AppointmentCalendarButton'
import { appointmentByIdOrSlugQuery, type appointmentByIdOrSlugResponse } from '@holi/core/screens/appointments/queries'
import ShareAppointment from '@holi/core/screens/spaces/appointments/ShareAppointment'
import AppointmentDrawer from '@holi/core/screens/spaces/appointments/components/AppointmentDrawer'
import SpaceAvatar from '@holi/core/screens/spaces/components/SpaceAvatar'
import { useSpace } from '@holi/core/screens/spaces/hooks/useSpace'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ExternalLink, Global, LockFilled, MapPin2, More, Time, VideoChat } from '@holi/icons/src/generated'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import { localizeDate } from '@holi/ui/helper/date'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'
import { Avatar } from 'holi-bricks/components/avatar'
import { CalendarIcon } from 'holi-bricks/components/calendarIcon'
import { SpaceUserConnectionType } from '@holi/api/graphql/graphql-codegen'
import { breakpoints } from 'holi-bricks/foundations'
import { useApolloNotFoundErrorHandling } from '@holi/core/hooks/useApolloNotFoundErrorHandling'

const IMAGE_ASPECT_RATIO = 327 / 210

export type AppointmentDetailsParams = RefreshOnNavigationParams & {
  spaceIdOrName: string
  idOrSlug: string
}

const { useParam } = createParamHooks<AppointmentDetailsParams>()

const AppointmentDetails = () => {
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const [idOrSlug] = useParam('idOrSlug')
  const [imageError, setImageError] = useState(false)
  const setScreenOptions = useSetScreenOptions()
  const { navigateBack, navigate } = useRouting()
  const loginState = useLoggedInUser()
  const { width: deviceWidth } = useClientWindowDimensions()

  const { t, i18n } = useTranslation()
  const mixins = useStyleMixins()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const { error: errorSpace, space, refetch: refetchSpace } = useSpace(spaceIdOrName)

  const {
    error: errorAppointment,
    data: appointmentData,
    refetch: refetchAppointment,
    called: calledAppointment,
  } = useQuery<appointmentByIdOrSlugResponse>(appointmentByIdOrSlugQuery, {
    variables: { idOrSlug },
    skip: !idOrSlug,
  })

  useOnRefresh(() => Promise.all([refetchAppointment(), refetchSpace()]))
  useApolloNotFoundErrorHandling(errorAppointment, 'Failed to load appointment', {
    location: 'AppointmentDetails.appointmentByIdOrSlugQuery',
    idOrSlug,
  })
  useRefreshOnNavigation({ initialized: calledAppointment })

  const appointment = appointmentData?.appointment

  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceUserConnectionType.Administrator)

  const renderActionDrawer = useCallback(
    () =>
      space &&
      appointment && (
        <AppointmentDrawer
          appointment={appointment}
          space={space}
          isAdmin={isAdmin}
          handleDelete={() => navigateBack()}
        >
          <View>
            <HoliIcon icon={More} colorOverride={colors.foreground30} />
          </View>
        </AppointmentDrawer>
      ),
    [isAdmin, space, appointment, navigateBack, colors.foreground30]
  )

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      animation: 'slide_from_left',
      headerTitle: () => <HoliText>{t('spaces.appointments.details.title')}</HoliText>,
      headerLeft: () => <HeaderBackButton />,
      headerRight: () => <View style={styles.headerRight}>{renderActionDrawer()}</View>,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [setScreenOptions, t, renderActionDrawer, colors.background10, styles.headerRight])

  if (!appointment || !space) {
    return <HoliLoader />
  }

  // Error and loading states are handled the same way and just hide the component
  if (errorSpace || errorAppointment || !appointment || !space) {
    return <></>
  }

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

  const navigateToVideoCall = () => {
    if (!appointment.videoCallLink?.url) return
    if (Platform.OS === 'web') {
      // Directly call api that performs redirects
      Linking.openURL(appointment.videoCallLink?.url.replace(jitsiUrl, '/api/video-call'))
    } else {
      // Open webview that will then navigate to the same page as web above
      navigate(appointment.videoCallLink?.url.replace(jitsiUrl, '/video-call'))
    }
  }

  const openMap = () => {
    if (!appointment.locationDetails) return
    if (appointment.locationDetails.completeAddress) {
      const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        appointment.locationDetails.completeAddress
      )}`

      Linking.openURL(mapUrl)
    }
  }

  return (
    <ScrollView style={styles.defaultLayout} contentContainerStyle={styles.contentStyle}>
      <View style={[mixins.container, deviceWidth < breakpoints.lg && styles.smallScreenPadding]}>
        <View style={styles.imageContainer}>
          {!imageError && !!appointment.thumbnail && (
            <HoliImage
              label={t('spaces.appointments.thumbnail.label')}
              source={{ uri: appointment.thumbnail }}
              style={styles.image}
              onError={() => setImageError(true)}
              {...(appointment.thumbnailBlurhash ? { blurhash: appointment.thumbnailBlurhash } : {})}
            />
          )}
        </View>
        <View style={[styles.card, styles.firstCard]}>
          <View style={styles.titleContainer}>
            <CalendarIcon
              day={new Date(appointment.startDateTime).getDate()}
              month={new Date(appointment.startDateTime).getMonth() + 1}
              size="md"
            />
            <View style={styles.infoText}>
              <HoliHeading ellipsizeMode="tail" level="1" size="m" testID="appointment-title">
                {appointment.title}
              </HoliHeading>
            </View>
          </View>
          <View style={styles.firstIconContainer}>
            <View style={styles.iconGroupContainer}>
              <HoliIcon icon={Time} size={24} style={styles.iconGroupIcon} />
              <HoliText bold style={styles.infoText}>
                <SuppressSsrHydrationWarning>
                  {date} ∙ {startTime} {t('global.until')} {endDate !== date ? `${endDate} ∙ ` : ''}
                  {endTime}
                </SuppressSsrHydrationWarning>
              </HoliText>
            </View>
          </View>
          {!loginState.isLoggedIn && appointment.locationDetails && appointment.locationDetails.completeAddress && (
            <>
              <View style={styles.iconGroupContainer}>
                <HoliIcon icon={MapPin2} size={24} style={styles.iconGroupIcon} />
                <HoliButton
                  label={t('appointment.card.login.location')}
                  transparent
                  inline
                  style={styles.iconGroupWithDescription}
                  onPress={() => navigate('/login')}
                >
                  <HoliText bold>{t('appointment.card.login.location')}</HoliText>
                </HoliButton>
              </View>
              <View style={styles.noIconsContainer}>
                <HoliButton
                  label={appointment.locationDetails.completeAddress}
                  transparent
                  inline
                  style={styles.iconGroupWithDescription}
                  onPress={() => navigate('/login')}
                >
                  <HoliText color="gray300" size="small">
                    {appointment.locationDetails.completeAddress}
                  </HoliText>
                </HoliButton>
              </View>
            </>
          )}
          {!loginState.isLoggedIn && appointment.hasVideoCallLink && (
            <View style={styles.iconGroupContainer}>
              <HoliIcon icon={VideoChat} size={24} style={styles.iconGroupIcon} />
              <HoliButton
                label={t('appointment.card.login.videochat')}
                transparent
                inline
                style={styles.iconGroupWithDescription}
                onPress={() => navigate('/login')}
              >
                <HoliText bold>{t('appointment.card.login.videochat')}</HoliText>
              </HoliButton>
            </View>
          )}
          {loginState.isLoggedIn && appointment.locationDetails && (
            <View style={styles.iconGroupContainer}>
              <HoliIcon icon={MapPin2} size={24} style={styles.iconGroupIcon} />
              <HoliButton
                label={appointment.locationDetails.completeAddress as string}
                transparent
                inline
                style={styles.externalLinkButton}
                contentStyle={styles.iconGroupWithDescription}
                onPress={openMap}
              >
                <HoliText bold style={styles.infoText}>
                  {appointment.locationDetails.completeAddress}
                </HoliText>
                <HoliIcon icon={ExternalLink} size={16} style={styles.externalLinkIcon} />
              </HoliButton>
            </View>
          )}
          {loginState.isLoggedIn && appointment.videoCallLink?.url && (
            <View style={styles.iconGroupContainer}>
              <HoliIcon icon={VideoChat} size={24} style={styles.iconGroupIcon} />
              <HoliButton
                label={appointment.videoCallLink?.url}
                transparent
                inline
                style={styles.externalLinkButton}
                contentStyle={styles.iconGroupWithDescription}
                onPress={navigateToVideoCall}
              >
                <View style={styles.infoText}>
                  <HoliText bold ellipsizeMode="tail" numberOfLines={2}>
                    {appointment.videoCallLink?.url}
                  </HoliText>
                  {appointment.videoCallLink?.additionalInfo && (
                    <HoliText style={styles.iconGroupContainerDescription} color="gray200">
                      {appointment.videoCallLink.additionalInfo}
                    </HoliText>
                  )}
                </View>
                <HoliIcon icon={ExternalLink} size={16} style={styles.externalLinkIcon} />
              </HoliButton>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <HoliHeading level="2" size="m">
            {t('spaces.appointments.details.about')}
          </HoliHeading>
          <HoliRichTextOutput
            style={styles.description}
            text={appointment.description}
            color="support"
            size="sm"
            allowAllLinks
            testID="appointment-description"
          />
        </View>
        <View style={styles.card}>
          <AppointmentCalendarButton appointment={appointment} />
          <HoliGap size="s" />
          <ShareAppointment space={space} appointment={appointment} date={date} startTime={startTime} />
        </View>
        <View style={styles.card}>
          <HoliHeading level="2" size="m">
            {t('spaces.appointments.details.details')}
          </HoliHeading>
          {loginState.isLoggedIn && appointment.creator && (
            <View style={styles.avatar}>
              <Avatar
                source={appointment.creator.avatar}
                imgPlaceholder={appointment.creator.avatarBlurhash}
                label={appointment.creator.fullName || t('user.profileView.anonymous')}
                initials={appointment.creator.avatarLabel || ''}
                testID="appointment-contact-avatar"
              />
              <HoliText style={styles.avatarName}>
                {t('spaces.appointments.details.createdBy')}{' '}
                {appointment.creator.fullName || t('user.profileView.anonymous')}
              </HoliText>
            </View>
          )}
          {loginState.isLoggedIn && !appointment.creator && (
            <View style={styles.avatar}>
              <SpaceAvatar space={space} size="md" />
              <HoliText style={styles.avatarName}>
                {t('spaces.appointments.details.organisedBy')} {space.title}
              </HoliText>
            </View>
          )}
          <View style={styles.detailsIconGroup}>
            <HoliIcon icon={appointment.inviteOnly ? LockFilled : Global} size={24} style={styles.detailsIcon} />
            <HoliText>
              {appointment.inviteOnly
                ? t('spaces.appointments.details.restricted')
                : t('spaces.appointments.details.public')}
            </HoliText>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    defaultLayout: {
      backgroundColor: theme.colors.background20,
    },
    contentStyle: {
      paddingBottom: 120,
    },
    smallScreenPadding: {
      paddingHorizontal: 0,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 14,
    },
    image: {
      width: '100%',
      aspectRatio: IMAGE_ASPECT_RATIO,
      height: Platform.OS === 'web' ? '100%' : 'auto',
    },
    imageContainer: {
      position: 'relative',
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 8,
    },
    card: {
      padding: 16,
      backgroundColor: theme.colors.background10,
      flexShrink: 1,
      borderRadius: 24,
      marginBottom: 2,
    },
    firstCard: {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    },
    noIconsContainer: {
      marginLeft: 32,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    firstIconContainer: {
      marginTop: 24,
    },
    iconGroupContainer: {
      flex: 1,
      marginTop: 16,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    iconGroupIcon: {
      marginRight: 8,
      marginTop: -2,
    },
    externalLinkButton: {
      flex: 1,
    },
    iconGroupWithDescription: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 6,
    },
    iconGroupContainerDescription: {
      marginTop: 2,
      flex: 1,
    },
    description: {
      marginTop: 16,
    },
    avatar: {
      marginTop: 16,
      marginRight: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatarName: {
      marginLeft: 16,
    },
    detailsIconGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 16,
    },
    detailsIcon: {
      borderWidth: 1,
      borderColor: theme.colors.background20,
      borderRadius: 50,
      padding: 13,
      marginRight: 16,
    },
    infoText: {
      flex: 1,
      ...Platform.select({
        web: {
          overflow: 'hidden',
        },
      }),
    },
    externalLinkIcon: {
      marginTop: 2,
    },
  })

export default memo(AppointmentDetails)

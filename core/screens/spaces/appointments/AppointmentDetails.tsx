import { useQuery } from '@apollo/client'
import React, { memo, useCallback, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DimensionValue, Linking, Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import { jitsiUrl } from '@holi/core/helpers/config'
import { useOnRefresh } from '@holi/core/helpers/useOnRefresh'
import { LinkType, useShareLink } from '@holi/core/hooks/useShareLink'
import { getLocale } from '@holi/core/i18n/helpers/dateHelper'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { appointmentByIdOrSlugQuery, appointmentByIdOrSlugResponse } from '@holi/core/screens/appointments/queries'
import AppointmentDrawer from '@holi/core/screens/spaces/appointments/components/AppointmentDrawer'
import { useSpace } from '@holi/core/screens/spaces/hooks/useSpace'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import {
  ExternalLink,
  FileCopy,
  Global,
  LockFilled,
  MapPin2,
  More,
  Share,
  Time,
  VideoChat,
} from '@holi/icons/src/generated'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliCalendarIcon from '@holi/ui/components/molecules/HoliCalendarIcon'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import { localizeDate } from '@holi/ui/helper/date'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const IMAGE_ASPECT_RATIO = 327 / 210

export type AppointmentDetailsParams = {
  spaceIdOrName: string
  idOrSlug: string
}

const { useParam } = createParamHooks<AppointmentDetailsParams>()

const AppointmentDetails = () => {
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const [idOrSlug] = useParam('idOrSlug')
  const [imageError, setImageError] = useState(false)
  const setScreenOptions = useSetScreenOptions()
  const { navigateBack, replaceRoute, navigate } = useRouting()
  const { userId, isLoggedIn } = useAuth()
  const { width: deviceWidth } = useWindowDimensions()

  const { t, i18n } = useTranslation()
  const mixins = useStyleMixins()

  const { loading: loadingSpace, error: errorSpace, space, refetch: refetchSpace } = useSpace(spaceIdOrName)

  const {
    loading: loadingAppointment,
    error: errorAppointment,
    data: appointmentData,
    refetch: refetchAppointment,
    called: calledAppointment,
  } = useQuery<appointmentByIdOrSlugResponse>(appointmentByIdOrSlugQuery, {
    variables: { idOrSlug },
    onError: (error) =>
      !isNotFoundError(error) &&
      logError(error, 'Failed to load appointment', {
        location: 'AppointmentDetails.appointmentByIdOrSlugQuery',
        idOrSlug,
      }),
    skip: !idOrSlug,
  })
  const { refreshing, onRefresh } = useOnRefresh(() => Promise.all([refetchAppointment, refetchSpace]))

  const appointment = appointmentData?.appointment

  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)
  const isAppointmentCreator = appointment?.creator.id === userId
  const isMobile = Platform.OS !== 'web'

  const [, shareLink] = useShareLink({
    link: `/spaces/${space?.name}/appointments/${appointment?.id}`,
    linkType: LinkType.UNIVERSAL,
    message: '',
  })

  const renderActionDrawer = useCallback(
    () =>
      space && appointment && (isAdmin || isAppointmentCreator) ? (
        <AppointmentDrawer
          appointment={appointment}
          space={space}
          isAdmin={isAdmin}
          handleDelete={() => navigateBack()}
        >
          <View>
            <HoliIcon icon={More} color={colors.foreground30} />
          </View>
        </AppointmentDrawer>
      ) : (
        <></>
      ),
    [isAdmin, space, appointment, isAppointmentCreator, navigateBack]
  )

  useLayoutEffect(() => {
    setScreenOptions({
      animation: 'slide_from_left',
      headerTransparent: true,
      headerStyle: { backgroundColor: colors.background10 },
      headerTitle: () => <HoliText>{t('spaces.appointments.details.title')}</HoliText>,
      headerLeft: () => <HeaderBackButton />,
      headerRight: () => <View style={styles.headerRight}>{renderActionDrawer()}</View>,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [setScreenOptions, t, renderActionDrawer])

  if (loadingAppointment || loadingSpace || refreshing) {
    return <HoliLoader />
  }

  if (
    (errorAppointment && isNotFoundError(errorAppointment)) ||
    (calledAppointment && !loadingAppointment && !appointment)
  ) {
    replaceRoute('/404')
    return <></>
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

  return (
    <>
      <ScrollHeaderLayout.Refreshable
        refreshableProps={{ refreshing, onRefresh }}
        style={styles.defaultLayout}
        contentStyle={styles.contentStyle}
        headerOverlap
      >
        <View style={[mixins.container, deviceWidth < +vars.breakpointL ? styles.smallScreenPadding : {}]}>
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
              <HoliCalendarIcon
                day={new Date(appointment.startDateTime).getDate()}
                month={new Date(appointment.startDateTime).getMonth() + 1}
                size="medium"
              />
              <HoliHeading style={styles.title} ellipsizeMode="tail" level="1" size="medium" testID="appointment-title">
                {appointment.title}
              </HoliHeading>
            </View>
            <View style={[styles.iconsContainer, styles.firstIconContainer]}>
              <View style={styles.iconGroupContainer}>
                <HoliIcon icon={Time} size={24} style={styles.iconGroupIcon} />
                <HoliText bold>
                  {date} ∙ {startTime} {t('global.until')} {endDate !== date ? `${endDate} ∙ ` : ''}
                  {endTime}
                </HoliText>
              </View>
            </View>
            {!isLoggedIn && (
              <View style={styles.iconsContainer}>
                <View style={styles.iconGroupContainer}>
                  <HoliIcon icon={MapPin2} size={24} style={styles.iconGroupIcon} />
                  <HoliText bold>{t('appointment.card.login.location')}</HoliText>
                </View>
              </View>
            )}
            {!isLoggedIn && (
              <View style={styles.iconsContainer}>
                <View style={styles.iconGroupContainer}>
                  <HoliIcon icon={VideoChat} size={24} style={styles.iconGroupIcon} />
                  <HoliText bold>{t('appointment.card.login.videochat')}</HoliText>
                </View>
              </View>
            )}
            {isLoggedIn && appointment.location && (
              <View style={styles.iconsContainer}>
                <View style={styles.iconGroupContainer}>
                  <HoliIcon icon={MapPin2} size={24} style={styles.iconGroupIcon} />
                  <HoliText bold>{appointment.location}</HoliText>
                </View>
              </View>
            )}
            {isLoggedIn && appointment.videoCallLink?.url && (
              <View style={styles.iconsContainer}>
                <View style={styles.iconGroupContainer}>
                  <HoliIcon icon={VideoChat} size={24} style={styles.iconGroupIcon} />
                  <HoliButton
                    label={appointment.videoCallLink?.url}
                    transparent
                    inline
                    style={styles.iconGroupWithDescription}
                    onPress={navigateToVideoCall}
                  >
                    <View style={styles.externalLinkContainer}>
                      <HoliText bold ellipsizeMode="tail" numberOfLines={2}>
                        {appointment.videoCallLink?.url}
                      </HoliText>
                      <HoliIcon icon={ExternalLink} size={16} style={styles.externalLinkIcon} />
                    </View>
                    {appointment.videoCallLink?.additionalInfo && (
                      <HoliText style={styles.iconGroupContainerDescription} color="gray200">
                        {appointment.videoCallLink.additionalInfo}
                      </HoliText>
                    )}
                  </HoliButton>
                </View>
              </View>
            )}
          </View>

          <View style={styles.card}>
            <HoliHeading level="2" size="medium">
              {t('spaces.appointments.details.about')}
            </HoliHeading>
            <HoliRichTextOutput
              style={styles.description}
              text={appointment.description}
              color="gray300"
              size="small"
              allowAllLinks
              testID="appointment-description"
            />
          </View>
          <View style={styles.card}>
            {isMobile ? (
              <HoliButton transparent label={t('global.share')} onPress={shareLink}>
                <View style={styles.interactionLinkContainer}>
                  <HoliIcon icon={Share} size={24} style={styles.interactionLinkIcon} />
                  <HoliText bold>{t('global.share')}</HoliText>
                </View>
              </HoliButton>
            ) : (
              <HoliButton transparent label={t('spaces.appointments.copyLink')} onPress={shareLink}>
                <View style={styles.interactionLinkContainer}>
                  <HoliIcon icon={FileCopy} size={24} style={styles.interactionLinkIcon} />
                  <HoliText bold>{t('spaces.appointments.copyLink')}</HoliText>
                </View>
              </HoliButton>
            )}
          </View>
          <View style={styles.card}>
            <HoliHeading level="2" size="medium">
              {t('spaces.appointments.details.details')}
            </HoliHeading>
            <View style={styles.avatar}>
              <HoliAvatar
                imageSrc={appointment.creator.avatar}
                imageBlurhash={appointment.creator.avatarBlurhash}
                label={appointment.creator.fullName || t('user.profileView.anonymous')}
                initials={appointment.creator.avatarLabel || ''}
                defaultColor={appointment.creator.avatarDefaultColor || ''}
                testID="appointment-contact-avatar"
              />
              <HoliText style={styles.avatarName}>
                {t('spaces.appointments.details.createdBy')}{' '}
                {appointment.creator.fullName || t('user.profileView.anonymous')}
              </HoliText>
            </View>
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
      </ScrollHeaderLayout.Refreshable>
    </>
  )
}

const styles = StyleSheet.create({
  defaultLayout: {
    paddingBottom: 120,
    minHeight: '100%',
    paddingTop: +vars.topBarHeight,
    backgroundColor: colors.background20,
    ...Platform.select({
      web: {
        minHeight: '100vh' as DimensionValue,
      },
    }),
  },
  contentStyle: {
    paddingBottom: 0,
    ...Platform.select({
      web: {
        minHeight: '100vh' as DimensionValue,
      },
      native: {
        paddingTop: +vars.topBarHeight,
      },
    }),
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
  title: {
    maxWidth: '80%',
  },
  card: {
    padding: 16,
    flex: 1,
    backgroundColor: colors.background10,
    flexShrink: 1,
    borderRadius: 24,
    marginBottom: 2,
  },
  firstCard: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  iconsContainer: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  firstIconContainer: {
    marginTop: 24,
  },
  iconGroupContainer: {
    flexDirection: 'row',
    flexShrink: 1,
  },
  iconGroupIcon: {
    marginRight: 8,
    marginTop: -2,
  },
  iconGroupWithDescription: {
    maxWidth: '95%',
  },
  iconGroupContainerDescription: {
    marginTop: 2,
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
    borderColor: colors.background20,
    borderRadius: 50,
    padding: 13,
    marginRight: 16,
  },
  externalLinkContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    paddingRight: 12,
  },
  externalLinkIcon: {
    marginTop: 2,
  },
  interactionLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingRight: 12,
  },
  interactionLinkIcon: {
    marginTop: -2,
  },
})

export default memo(AppointmentDetails)

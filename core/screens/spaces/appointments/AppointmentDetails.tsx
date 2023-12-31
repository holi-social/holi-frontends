import { useQuery } from '@apollo/client'
import React, { memo, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import { useOnRefresh } from '@holi/core/helpers/useOnRefresh'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import AppointmentCard from '@holi/core/screens/appointments/components/AppointmentCard'
import { appointmentByIdOrSlugQuery, appointmentByIdOrSlugResponse } from '@holi/core/screens/appointments/queries'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type AppointmentDetailsParams = {
  spaceIdOrName: string
  idOrSlug: string
}

const { useParam } = createParam<AppointmentDetailsParams>()

const AppointmentDetails = () => {
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const [idOrSlug] = useParam('idOrSlug')
  const setScreenOptions = useSetScreenOptions()
  const { replaceRoute } = useRouting()

  const { t } = useTranslation()
  const mixins = useStyleMixins()

  const {
    loading: loadingSpace,
    error: errorSpace,
    data: spaceData,
    refetch: refetchSpace,
  } = useQuery<SpaceByIdResponse>(spaceByIdQuery, {
    variables: { idOrName: spaceIdOrName },
    onError: (error) =>
      !isNotFoundError(error) &&
      logError(error, 'Failed to load space', { location: 'TaskDetails.spaceByIdQuery', spaceIdOrName }),
    skip: !spaceIdOrName,
  })

  const {
    loading: loadingAppointment,
    error: errorAppointment,
    data: appointmentData,
    refetch: refetchAppointment,
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

  const space = spaceData?.spaceById
  const appointment = appointmentData?.appointment

  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)

  useLayoutEffect(() => {
    setScreenOptions({
      animation: 'slide_from_left',
      headerTransparent: true,
      headerStyle: { backgroundColor: colors.background10 },
      headerTitle: () => <HoliText>{t('spaces.appointments.details.title')}</HoliText>,
      headerLeft: () => <HeaderBackButton />,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [setScreenOptions, t])

  if (loadingAppointment || loadingSpace || refreshing) {
    return <HoliLoader />
  }

  if ((errorAppointment && isNotFoundError(errorAppointment)) || (!loadingAppointment && !appointment)) {
    replaceRoute('NotFound')
    return <></>
  }

  // Error and loading states are handled the same way and just hide the component
  if (errorSpace || errorAppointment || !appointment || !space) {
    return <></>
  }

  return (
    <>
      <ScrollHeaderLayout.Refreshable
        refreshableProps={{ refreshing, onRefresh }}
        style={styles.defaultLayout}
        contentStyle={styles.contentStyle}
        headerOverlap
      >
        <View style={mixins.container}>
          <AppointmentCard appointment={appointment} space={space} isAdmin={isAdmin} />
        </View>
      </ScrollHeaderLayout.Refreshable>
    </>
  )
}

const styles = StyleSheet.create({
  defaultLayout: {
    paddingBottom: 120,
    minHeight: '100%',
    paddingTop: vars.topBarHeight,
    backgroundColor: colors.background20,
    ...Platform.select({
      web: {
        minHeight: '100vh',
      },
    }),
  },
  contentStyle: {
    paddingBottom: 0,
    // paddingTop: vars.topBarHeight,
    ...Platform.select({
      web: {
        minHeight: '100vh',
        paddingTop: 12,
      },
      native: {
        paddingTop: vars.topBarHeight,
      },
    }),
  },
})

export default memo(AppointmentDetails)

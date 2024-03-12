import { useQuery } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { DimensionValue, Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { useBreakpointMatcher } from '@holi/core/helpers'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useOnRefresh } from '@holi/core/helpers/useOnRefresh'
import useRefreshOnNavigation, { RefreshOnNavigationParams } from '@holi/core/hooks/useRefreshOnNavigation'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { Pagination } from '@holi/core/pagination/Pagination'
import { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import AppointmentsList from '@holi/core/screens/appointments/components/AppointmentsList'
import { APPOINTMENT_STATUS_TYPE, appointmentsBySpaceIdQuery } from '@holi/core/screens/appointments/queries'
import { spaceMembersQuery, spaceMembershipRequestsQuery } from '@holi/core/screens/spaces/details/queries'
import { SpaceByIdResponse, spaceMembershipByIdQuery } from '@holi/core/screens/spaces/queries'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Add } from '@holi/icons/src/generated'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { colors, dimensions } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type SpaceAppointmentsParams = RefreshOnNavigationParams & {
  spaceIdOrName: string
  tab?: string
}

const { useParam } = createParamHooks<SpaceAppointmentsParams>()

const PAGE_SIZE = 20
const TAB_UPCOMING = 0
const TAB_PAST = 1

const SpaceAppointments: React.VFC<SpaceAppointmentsParams> = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const [selectedTab] = useParam('tab')
  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const tabBarStyle = useBreakpointMatcher([[dimensions.breakpointS, mixins.container]])
  const { height: screenHeight, width: screenWidth } = useWindowDimensions()
  const styles = createStyles(screenHeight)
  const screenOffset = Math.min(screenWidth, dimensions.maxScreenWidth) / 2

  const { data, loading, called } = useQuery<SpaceByIdResponse>(spaceMembershipByIdQuery, {
    skip: !spaceIdOrName,
    variables: { idOrName: spaceIdOrName },
  })

  const { refetch: refetchUpcomingAppointments } = useQuery<SpaceByIdResponse>(spaceMembersQuery, {
    skip: !spaceIdOrName,
    variables: { idOrName: spaceIdOrName },
  })

  const { refetch: refetchPastAppointments } = useQuery<SpaceByIdResponse>(spaceMembershipRequestsQuery, {
    skip: !spaceIdOrName,
    variables: { idOrName: spaceIdOrName },
  })

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      title: t('spaces.appointments.title'),
      headerTransparent: true,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [setScreenOptions, t])

  const space = data?.spaceById

  const initialTab = selectedTab === 'pending' || space?.membershipRequests?.totalResults ? TAB_PAST : TAB_UPCOMING
  const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)

  // TODO: use upcoming spaceAppointmentsQuery (with filter by upcoming and past appointments)
  const queryOptions: PaginationQueryHookOptions = {
    pageSize: PAGE_SIZE,
    queryPath: 'appointments',
    variables: {
      spaceId: space?.id,
      limit: PAGE_SIZE,
    },
  }

  const { refreshing, onRefresh } = useOnRefresh(() =>
    Promise.all([refetchUpcomingAppointments(), refetchPastAppointments()])
  )

  useRefreshOnNavigation({ initialized: called, onRefresh })

  if (loading || !space) {
    return <HoliLoader />
  }

  return (
    <>
      <ScrollHeaderLayout.Refreshable
        headerOverlap
        keyboardShouldPersistTaps="handled"
        style={styles.wrapper}
        refreshableProps={{
          refreshing,
          onRefresh,
        }}
      >
        <HoliTabs
          id="appointments-tabs"
          testID="appointments-tabs"
          style={styles.tabWrapper}
          tabBarStyle={[tabBarStyle, styles.tabBar]}
          initialStep={initialTab}
          tabs={[
            {
              title: t('spaces.appointments.tabs.upcoming'),
              style: styles.tabStyle,
              children: (
                <View style={[mixins.container, styles.all]}>
                  <Pagination
                    query={appointmentsBySpaceIdQuery}
                    queryOptions={{
                      ...queryOptions,
                      variables: { ...queryOptions.variables, statusType: APPOINTMENT_STATUS_TYPE.UPCOMING },
                    }}
                    loadMoreOnScroll
                  >
                    {space && <AppointmentsList space={space} />}
                  </Pagination>
                </View>
              ),
            },
            {
              title: t('spaces.appointments.tabs.past'),
              style: styles.tabStyle,
              children: (
                <View style={[mixins.container, styles.all]}>
                  <Pagination
                    query={appointmentsBySpaceIdQuery}
                    queryOptions={{
                      ...queryOptions,
                      variables: { ...queryOptions.variables, statusType: APPOINTMENT_STATUS_TYPE.PAST },
                    }}
                    loadMoreOnScroll
                  >
                    {space && <AppointmentsList space={space} />}
                  </Pagination>
                </View>
              ),
            },
          ]}
        />
      </ScrollHeaderLayout.Refreshable>
      {isMember && (
        <HoliButton
          label={t('spaces.appointments.add.button.label')}
          testID="btn-add-appointment"
          inline
          style={[styles.overlayButton, { transform: [{ translateX: -16 + screenOffset }] }]}
          onPress={() => navigate(`/spaces/${spaceIdOrName}/appointments/create`)}
        >
          <HoliIcon icon={Add} size={24} color={colors.foreground30} />
        </HoliButton>
      )}
    </>
  )
}

const createStyles = (screenHeight: number) =>
  StyleSheet.create({
    wrapper: {
      minHeight: '100%',
      ...Platform.select({
        native: {
          paddingTop: dimensions.topBarHeight + 24,
        },
        web: {
          paddingTop: dimensions.topBarHeight,
          minHeight: '100vh' as DimensionValue,
        },
      }),
    },
    tabWrapper: {
      height: '100%',
    },
    tabBar: {
      paddingTop: 24,
    },
    tabStyle: {
      flex: 1,
      backgroundColor: colors.background20,
      paddingBottom: 42,
    },
    all: {
      paddingVertical: 16,
      ...Platform.select({
        web: {
          minHeight: screenHeight - dimensions.topBarHeight - dimensions.bottomBarHeight - 52,
        },
        native: {
          minHeight: screenHeight - dimensions.topBarHeight - dimensions.bottomBarHeight - 80,
        },
      }),
    },
    overlayButton: {
      position: Platform.OS === 'web' ? 'fixed' : 'absolute',
      bottom: 32,
      right: '50%',
      justifyContent: 'center',
      elevation: 4,
      overflow: 'visible',
      paddingHorizontal: 13,
    },
  })
export default SpaceAppointments

import { useQuery } from '@apollo/client'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet } from 'react-native'

import { useClientWindowDimensions } from '@holi/core/helpers/useClientWindowDimensions'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { ScrollViewRefreshable } from '@holi/core/helpers/withRefreshControl'
import useRefreshOnNavigation, { RefreshOnNavigationParams } from '@holi/core/hooks/useRefreshOnNavigation'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { Pagination } from '@holi/core/pagination/Pagination'
import { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import AppointmentsList from '@holi/core/screens/appointments/components/AppointmentsList'
import { APPOINTMENT_STATUS_TYPE, appointmentsBySpaceIdQuery } from '@holi/core/screens/appointments/queries'
import { SpaceByIdResponse, spaceMembershipByIdQuery } from '@holi/core/screens/spaces/queries'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Add } from '@holi/icons/src/generated'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type SpaceAppointmentsParams = RefreshOnNavigationParams & {
  spaceIdOrName: string
  tab?: string
}

const { useParam } = createParamHooks<SpaceAppointmentsParams>()

const PAGE_SIZE = 20
const TAB_UPCOMING = 0
const TAB_PAST = 1

const SpaceAppointments = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const [selectedTab] = useParam('tab')
  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const { height: screenHeight, width: screenWidth } = useClientWindowDimensions()
  const screenOffset = Math.min(screenWidth, dimensions.maxScreenWidth) / 2
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(screenHeight, theme), [screenHeight, theme])

  const { data, loading, called } = useQuery<SpaceByIdResponse>(spaceMembershipByIdQuery, {
    skip: !spaceIdOrName,
    variables: { idOrName: spaceIdOrName },
  })

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      title: t('spaces.appointments.title'),
      headerTransparent: false,
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

  useRefreshOnNavigation({ initialized: called })

  if (loading || !space) {
    return <HoliLoader />
  }

  return (
    <>
      <HoliTabs
        id="appointments-tabs"
        testID="appointments-tabs"
        style={styles.tabWrapper}
        initialStep={initialTab}
        backgroundColor={colors.background20}
        tabs={[
          {
            title: t('spaces.appointments.tabs.upcoming'),
            style: styles.tabStyle,
            children: (
              <ScrollViewRefreshable
                style={[mixins.container, styles.all, { minHeight: '100%' }]}
                webWrapperStyle={{ justifyContent: 'center' }}
              >
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
              </ScrollViewRefreshable>
            ),
          },
          {
            title: t('spaces.appointments.tabs.past'),
            style: styles.tabStyle,
            children: (
              <ScrollViewRefreshable
                style={[mixins.container, styles.all]}
                webWrapperStyle={{ justifyContent: 'center' }}
              >
                <Pagination
                  query={appointmentsBySpaceIdQuery}
                  queryOptions={{
                    ...queryOptions,
                    variables: { ...queryOptions.variables, statusType: APPOINTMENT_STATUS_TYPE.PAST },
                  }}
                  loadMoreOnScroll
                >
                  {space && <AppointmentsList space={space} pastAppointments={true} />}
                </Pagination>
              </ScrollViewRefreshable>
            ),
          },
        ]}
      />

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

const getStyles = (screenHeight: number, theme: HoliTheme) =>
  StyleSheet.create({
    tabWrapper: {
      height: '100%',
    },
    tabStyle: {
      flex: 1,
      backgroundColor: theme.colors.background20,
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

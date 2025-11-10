import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native'

import { useClientWindowDimensions } from '@holi/core/helpers/useClientWindowDimensions'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import { ScrollViewRefreshable } from '@holi/core/helpers/withRefreshControl'
import useRefreshOnNavigation, { type RefreshOnNavigationParams } from '@holi/core/hooks/useRefreshOnNavigation'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { Pagination } from '@holi/core/pagination/Pagination'
import type { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import AppointmentsList from '@holi/core/screens/appointments/components/AppointmentsList'
import { APPOINTMENT_STATUS_TYPE, appointmentsBySpaceIdQuery } from '@holi/core/screens/appointments/queries'
import { Add } from '@holi/icons/src/generated'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'
import { useTheme } from '@holi/ui/styles/theme'
import { ButtonIcon } from 'holi-bricks/components/button'
import { SpaceUserConnectionType, useSpaceMembershipByIdQuery } from '@holi/api/graphql/graphql-codegen'

export type SpaceAppointmentsParams = RefreshOnNavigationParams & {
  spaceIdOrName: string
  tab?: string
}

const { useParam } = createParamHooks<SpaceAppointmentsParams>()

const PAGE_SIZE = 20

enum SpaceAppointmentsTabs {
  UPCOMING = 'upcoming',
  PAST = 'past',
}

const SpaceAppointments = () => {
  const { t } = useTranslation()
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const [selectedTab] = useParam('tab')
  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const { width: screenWidth } = useClientWindowDimensions()
  const screenOffset = Math.min(screenWidth, dimensions.maxScreenWidth) / 2
  const { theme } = useTheme()
  const { colors } = theme

  const { data, loading, error } = useSpaceMembershipByIdQuery({
    skip: !spaceIdOrName,
    variables: { idOrName: spaceIdOrName ?? '' },
  })

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      title: t('spaces.appointments.title'),
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [setScreenOptions, t])

  const space = data?.spaceById

  const initialTab =
    selectedTab === 'pending' || space?.membershipRequests?.totalResults
      ? SpaceAppointmentsTabs.PAST
      : SpaceAppointmentsTabs.UPCOMING
  const [activeTab, setActiveTab] = useState<string>(initialTab)

  const isMember = space?.connectionStatusToMyself?.includes(SpaceUserConnectionType.Member)

  // TODO: use upcoming spaceAppointmentsQuery (with filter by upcoming and past appointments)
  const queryOptions: PaginationQueryHookOptions = {
    pageSize: PAGE_SIZE,
    queryPath: 'appointments',
    variables: {
      spaceId: space?.id,
      limit: PAGE_SIZE,
    },
  }

  useRefreshOnNavigation({ initialized: !!data || !!error || loading })

  const { top: safeAreaTop } = useSafeAreaInsets()
  const tabContentContainerStyle: StyleProp<ViewStyle> = {
    paddingTop: Spacing.xs,
    paddingBottom: safeAreaTop + dimensions.topBarHeight + Spacing['4xl'],
    marginHorizontal: Spacing.xs,
  }

  if (loading || !space) {
    return <HoliLoader />
  }

  return (
    <View style={styles.tabWrapper}>
      <HoliTabs
        testID="appointments-tabs"
        activeTab={activeTab}
        onChange={setActiveTab}
        backgroundColor={colors.background20}
        data={[
          {
            key: SpaceAppointmentsTabs.UPCOMING,
            tabTitle: t('spaces.appointments.tabs.upcoming'),
            content: () => (
              <ScrollViewRefreshable
                style={styles.tabContent}
                contentContainerStyle={tabContentContainerStyle}
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
            key: SpaceAppointmentsTabs.PAST,
            tabTitle: t('spaces.appointments.tabs.past'),
            content: () => (
              <ScrollViewRefreshable
                style={styles.tabContent}
                contentContainerStyle={tabContentContainerStyle}
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
        keyExtractor={({ key }) => key}
        renderTabContent={({ item }) => item.content()}
      />

      {isMember && (
        <View style={[styles.overlayButton, { transform: [{ translateX: -16 + screenOffset }] }]}>
          <ButtonIcon
            label={t('spaces.appointments.add.button.label')}
            testID="btn-add-appointment"
            onPress={() => navigate(`/spaces/${spaceIdOrName}/appointments/create`)}
            icon={Add}
            size="lg"
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  tabWrapper: {
    flex: 1,
  },
  tabContent: {
    minHeight: '100%',
    marginHorizontal: -Spacing.xs, // hack to override HoliTabs margin
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

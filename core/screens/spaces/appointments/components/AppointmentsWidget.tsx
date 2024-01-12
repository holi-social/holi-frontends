import { useQuery } from '@apollo/client'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import { useBreakpointMatcher } from '@holi/core/helpers'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import AppointmentCard from '@holi/core/screens/appointments/components/AppointmentCard'
import {
  APPOINTMENT_STATUS_TYPE,
  AppointmentsBySpaceIdResponse,
  appointmentsBySpaceIdQuery,
} from '@holi/core/screens/appointments/queries'
import { SpaceDetailsParams } from '@holi/core/screens/spaces/details/SpaceDetails'
import CollaboratorAreaCard from '@holi/core/screens/spaces/linkHub/components/CollaborationAreaCard'
import { Space, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { Add, CalendarEvent } from '@holi/icons/src/generated'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors, vars } from '@holi/ui/styles/globalVars'

interface AppointmentsWidgetProps {
  space: Space
  style?: StyleProp<ViewStyle>
}

const INITIAL_NUMBER_OF_ITEMS = 3

interface NoAppointmentsAvailableProps {
  onPress: () => void
}

const NoAppointmentsAvailable: React.FC<NoAppointmentsAvailableProps> = ({ onPress }) => {
  const { t } = useTranslation()
  return (
    <HoliButton
      label={t('spaces.global.empty.instruction')}
      transparent
      onPress={onPress}
      style={styles.noAppointmentsDescriptionContainer}
    >
      <HoliText size="small" style={styles.descriptionText}>
        {t('spaces.appointments.empty.description')}
      </HoliText>
      <HoliText size="small" style={styles.instruction}>
        {t('spaces.global.empty.instruction')}
      </HoliText>
    </HoliButton>
  )
}

const AppointmentsWidget: React.VFC<AppointmentsWidgetProps> = ({ space, style }) => {
  const { useParam } = createParamHooks<SpaceDetailsParams>()
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const [spaceIdOrName] = useParam('spaceIdOrName') // spaceIdOrName can either be space.id or space.name (slug)

  const itemsInRow = useBreakpointMatcher([
    [0, 1],
    [+vars.breakpointS, 2],
    [+vars.breakpointM, 3],
    [+vars.breakpointXxl, 4],
  ])

  const {
    data: appointmentsResult,
    error: errorSpace,
    loading: loadingSpace,
  } = useQuery<AppointmentsBySpaceIdResponse>(appointmentsBySpaceIdQuery, {
    variables: { spaceId: space.id, statusType: APPOINTMENT_STATUS_TYPE.UPCOMING },
    onError: (error) =>
      logError(error, 'Failed to load appointments widget', {
        location: 'AppointmentWidget.appointmentsBySpaceIdQuery',
        spaceIdOrName,
      }),
  })

  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)
  const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)

  const appointments = appointmentsResult?.appointments

  const data = appointments?.data || []
  const totalResults = appointments?.totalResults || 0

  const navigateToAppointmentsPage = useCallback(() => {
    navigate(`/spaces/${space.name}/appointments`)
  }, [navigate, space.name])

  const navigateToAddAppointmentPage = useCallback(() => {
    navigate(`/spaces/${spaceIdOrName}/appointments/create`)
  }, [navigate, spaceIdOrName])

  if (errorSpace || loadingSpace) return <></>

  // return empty block if there is no data and user is not a collaborator
  if (!data.length && !isAdmin && !isMember) return <></>

  return (
    <CollaboratorAreaCard
      headerLeftIcon={CalendarEvent}
      headerRightIcon={Add}
      headerRightButtonLabel={t('spaces.appointments.add.button.label')}
      title={t('spaces.appointments.title')}
      onPressHeaderLeft={navigateToAppointmentsPage}
      onPressHeaderRight={navigateToAddAppointmentPage}
      testID="space-appointments-card"
      style={[style, styles.container]}
    >
      {totalResults > 0 && (
        <HoliGridWrapper itemsInRow={itemsInRow} gap={16}>
          {data.slice(0, INITIAL_NUMBER_OF_ITEMS).map((item) => (
            <HoliGridCell key={item.id}>
              <AppointmentCard appointment={item} space={space} key={item.id} isAdmin={isAdmin} />
            </HoliGridCell>
          ))}
        </HoliGridWrapper>
      )}

      {totalResults === 0 && <NoAppointmentsAvailable onPress={navigateToAddAppointmentPage} />}

      {data.length > INITIAL_NUMBER_OF_ITEMS && (
        <View style={styles.seeAllButtonContainer}>
          <HoliButton
            label={t('spaces.global.seeAllButton.label')}
            style={styles.seeAllButton}
            onPress={navigateToAppointmentsPage}
          >
            <HoliText>{t('spaces.global.seeAllButton.label')}</HoliText>
          </HoliButton>
        </View>
      )}
    </CollaboratorAreaCard>
  )
}

export default AppointmentsWidget

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
    padding: 8,
  },
  seeAllButtonContainer: {
    alignSelf: 'center',
  },
  seeAllButton: {
    backgroundColor: colors.background10,
    marginTop: 16,
  },
  noAppointmentsDescriptionContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 8,
    marginTop: 24,
  },
  instruction: {
    marginTop: 12,
    alignSelf: 'center',
    color: colors.foreground30,
  },
  descriptionText: {
    textAlign: 'center',
    color: colors.foreground20,
  },
})

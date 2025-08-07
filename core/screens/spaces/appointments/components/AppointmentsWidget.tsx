import type React from 'react'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native'

import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import AppointmentCard from '@holi/core/screens/appointments/components/AppointmentCard'
import type { SpaceDetailsParams } from '@holi/core/screens/spaces/details/SpaceDetails'
import CollaboratorAreaCard from '@holi/core/screens/spaces/linkHub/components/CollaborationAreaCard'
import { Add, CalendarEvent } from '@holi/icons/src/generated'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import type { Appointment } from '@holi/api/graphql/graphql-codegen'
import { SpaceUserConnectionType } from '@holi/api/graphql/graphql-codegen'
import type { Space } from '@holi/api/graphql/graphql-codegen'
import { breakpoints } from 'holi-bricks/foundations'

interface AppointmentsWidgetProps {
  space: Space
  appointments?: Appointment[]
  totalResults?: number
  isCollaborator?: boolean
  style?: StyleProp<ViewStyle>
}

const INITIAL_NUMBER_OF_ITEMS = 3

interface NoAppointmentsAvailableProps {
  onPress: () => void
}

const NoAppointmentsAvailable: React.FC<NoAppointmentsAvailableProps> = ({ onPress }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

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

const gridBreakpoints: [number, number][] = [
  [0, 1],
  [breakpoints.md, 2],
]

const AppointmentsWidget = ({ space, appointments, totalResults, isCollaborator, style }: AppointmentsWidgetProps) => {
  const { useParam } = createParamHooks<SpaceDetailsParams>()
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const [spaceIdOrName] = useParam('spaceIdOrName') // spaceIdOrName can either be space.id or space.name (slug)
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceUserConnectionType.Administrator)
  const isMember = space?.connectionStatusToMyself?.includes(SpaceUserConnectionType.Member)

  const navigateToAppointmentsPage = useCallback(() => {
    navigate(`/spaces/${space.name}/appointments`)
  }, [navigate, space.name])

  const navigateToAddAppointmentPage = useCallback(() => {
    navigate(`/spaces/${spaceIdOrName}/appointments/create`)
  }, [navigate, spaceIdOrName])

  // return empty block if there is no data and user is not a collaborator
  if (!appointments?.length && !isAdmin && !isMember) return <></>

  return (
    <CollaboratorAreaCard
      headerLeftIcon={isCollaborator ? CalendarEvent : undefined}
      headerRightIcon={isCollaborator ? Add : undefined}
      headerRightButtonLabel={isMember ? t('spaces.appointments.add.button.label') : undefined}
      title={t('spaces.appointments.title')}
      onPressHeaderLeft={navigateToAppointmentsPage}
      onPressHeaderRight={navigateToAddAppointmentPage}
      testID="space-appointments-card"
      isCollaborator={isCollaborator}
      style={[style, styles.container, !isCollaborator ? styles.nonMemberContainer : {}]}
    >
      <View style={styles.contentWrapper}>
        {!!totalResults && (
          <HoliGridWrapper breakpoints={gridBreakpoints} gap={16}>
            {appointments?.slice(0, INITIAL_NUMBER_OF_ITEMS).map((item) => (
              <HoliGridCell key={item.id}>
                <AppointmentCard appointment={item} space={space} key={item.id} isAdmin={isAdmin} isMember={isMember} />
              </HoliGridCell>
            ))}
          </HoliGridWrapper>
        )}

        {totalResults === 0 && <NoAppointmentsAvailable onPress={navigateToAddAppointmentPage} />}

        {(appointments?.length || 0) > INITIAL_NUMBER_OF_ITEMS && (
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
      </View>
    </CollaboratorAreaCard>
  )
}

export default AppointmentsWidget

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      paddingBottom: 16,
    },
    nonMemberContainer: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    contentWrapper: {
      padding: 8,
    },
    seeAllButtonContainer: {
      alignSelf: 'center',
    },
    seeAllButton: {
      backgroundColor: theme.colors.background10,
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
      color: theme.colors.foreground30,
    },
    descriptionText: {
      textAlign: 'center',
      color: theme.colors.foreground20,
    },
  })

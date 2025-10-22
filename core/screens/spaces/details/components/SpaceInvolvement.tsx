import { useQuery } from '@apollo/client'
import type React from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native'

import { isSSR } from '@holi/core/helpers/isSSR'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import {
  APPOINTMENT_STATUS_TYPE,
  type AppointmentsBySpaceIdResponse,
  appointmentsBySpaceIdQuery,
} from '@holi/core/screens/appointments/queries'
import AppointmentsWidget from '@holi/core/screens/spaces/appointments/components/AppointmentsWidget'
import SpaceCollaboratorOnboardingSteps from '@holi/core/screens/spaces/details/components/SpaceCollaboratorOnboardingSteps'
import LinkHubWidget from '@holi/core/screens/spaces/linkHub/components/LinkHubWidget'
import NewToolsTeaser from '@holi/core/screens/spaces/linkHub/components/NewToolsTeaser'
import TaskCollaborationCard from '@holi/core/screens/spaces/tasks/components/TaskCollaborationCard'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowRightS, OpenArm } from '@holi/icons/src/generated'
import { HoliDivider } from '@holi/ui/components/atoms/HoliDivider'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import type { Appointment } from '@holi/api/graphql/graphql-codegen'
import { SpaceUserConnectionType } from '@holi/api/graphql/graphql-codegen'
import type { Space } from '@holi/api/graphql/graphql-codegen'
import { useApolloErrorLogging } from '@holi/core/hooks/useApolloErrorLogging'

interface SpaceInvolvementProps {
  style?: StyleProp<ViewStyle>
  space: Space
}

const SpaceInvolvement: React.FC<SpaceInvolvementProps> = ({ space, style }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const isMember = space?.connectionStatusToMyself?.includes(SpaceUserConnectionType.Member)
  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceUserConnectionType.Administrator)
  const isCollaborator = isAdmin || isMember

  const {
    data: appointmentsResult,
    error: errorAppointments,
    loading: loadingAppointments,
    refetch,
  } = useQuery<AppointmentsBySpaceIdResponse>(appointmentsBySpaceIdQuery, {
    variables: { spaceId: space.id, statusType: APPOINTMENT_STATUS_TYPE.UPCOMING },
    fetchPolicy: isSSR ? 'cache-first' : 'cache-and-network',
  })
  useOnRefresh(refetch)
  useApolloErrorLogging(errorAppointments, 'Failed to load appointments widget', {
    location: 'AppointmentWidget.appointmentsBySpaceIdQuery',
    spaceIdOrName: space.name,
  })

  return (
    <>
      <View style={style}>
        {isAdmin && (
          <HoliLink label={t('spaces.collaborate.onboarding.link')} href={`/spaces/${space.name}/onboarding`}>
            <View style={[styles.card, styles.onboarding]}>
              <HoliIcon icon={OpenArm} size={24} colorOverride={colors.brandColorB30} style={styles.icon} />
              <HoliText>{t('spaces.collaborate.onboarding.link')}</HoliText>
              <HoliIcon icon={ArrowRightS} size={24} style={styles.end} />
            </View>
          </HoliLink>
        )}

        {!isCollaborator && space.onboarding?.steps && space.onboarding.steps.length > 0 && (
          <SpaceCollaboratorOnboardingSteps
            steps={space.onboarding?.steps}
            header={t('spaces.collaborate.onboarding.info.header')}
            style={styles.onboardingSteps}
          />
        )}

        {/* include divider if any other block below has content when logged out */}
        {!isCollaborator &&
          space.onboarding?.steps &&
          space.onboarding.steps.length > 0 &&
          (!!appointmentsResult?.appointments?.data?.length || !!space.tasks?.length) && (
            <View style={(styles.divider, styles.dividerPadding)}>
              <HoliDivider />
            </View>
          )}

        {(!loadingAppointments || appointmentsResult?.appointments) && !errorAppointments && (
          <AppointmentsWidget
            space={space}
            style={styles.card}
            isCollaborator={isCollaborator}
            appointments={appointmentsResult?.appointments.data as Appointment[]}
            totalResults={appointmentsResult?.appointments.totalResults}
          />
        )}

        {/* include divider if any other block below has content when logged out */}
        {!isCollaborator && !!appointmentsResult?.appointments?.data?.length && !!space.tasks?.length && (
          <View style={(styles.divider, styles.dividerPadding)}>
            <HoliDivider />
          </View>
        )}

        {isCollaborator && <LinkHubWidget space={space} style={styles.card} />}

        <TaskCollaborationCard
          isAdmin={isAdmin}
          space={space}
          isCollaborator={isCollaborator}
          showNoResults={!space.onboarding?.steps?.length && !appointmentsResult?.appointments?.data?.length}
        />

        {isCollaborator && <NewToolsTeaser />}
      </View>
    </>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    card: {
      marginBottom: 16,
    },
    seeAllButtonContainer: {
      alignItems: 'center',
    },
    seeAllButton: {
      bottom: 0,
      paddingHorizontal: 20,
      borderWidth: 1,
      marginTop: 16,
      marginBottom: 8,
    },
    onboarding: {
      backgroundColor: theme.colors.background10,
      borderRadius: 16,
      paddingVertical: 16,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.background30,
    },
    onboardingSteps: {
      marginBottom: 32,
      paddingHorizontal: 8,
    },
    icon: {
      marginRight: 8,
      marginLeft: 16,
    },
    end: {
      marginLeft: 'auto',
      alignSelf: 'flex-end',
      marginRight: 16,
    },
    divider: {
      paddingHorizontal: 8,
      paddingBottom: 8,
    },
    dividerPadding: {
      paddingBottom: 8,
    },
  })

export default SpaceInvolvement

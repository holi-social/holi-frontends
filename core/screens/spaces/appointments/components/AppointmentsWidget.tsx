import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { SpaceDetailsParams } from '@holi/core/screens/spaces/details/SpaceDetails'
import CollaboratorAreaCard from '@holi/core/screens/spaces/linkHub/components/CollaborationAreaCard'
import { Space } from '@holi/core/screens/spaces/types'
import { Add, LinkM } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

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
  const { useParam } = createParam<SpaceDetailsParams>()
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const [spaceIdOrName] = useParam('spaceIdOrName') // spaceIdOrName can either be space.id or space.name (slug)
  const { appointments = [] } = space

  // TODO: create view space appointments screen
  const navigateToAppointmentsPage = useCallback(() => {
    navigate(`/spaces/${space.name}/appointments`)
  }, [navigate, space.name])

  // TODO: create add appointment screen
  const navigateToAddAppointmentPage = useCallback(() => {
    navigate(`/spaces/${spaceIdOrName}/appointments/create`)
  }, [navigate, spaceIdOrName])

  return (
    <CollaboratorAreaCard
      headerLeftIcon={LinkM}
      headerRightIcon={Add}
      headerRightButtonLabel={t('spaces.appointments.add.button.label')}
      title={t('spaces.appointments.title')}
      onPressHeaderLeft={navigateToAppointmentsPage}
      onPressHeaderRight={navigateToAddAppointmentPage}
      testID="space-appointments-card"
      style={[style, styles.container]}
    >
      {(appointments.length > 0 &&
        appointments.slice(0, INITIAL_NUMBER_OF_ITEMS).map((item, index) => (
          // TODO: Create AppointmentCard component
          <View key={index}>
            <HoliText>{item.title}</HoliText>
          </View>
        ))) || <NoAppointmentsAvailable onPress={navigateToAddAppointmentPage} />}
      {appointments.length > INITIAL_NUMBER_OF_ITEMS && (
        <View style={styles.seeAllButtonContainer}>
          <HoliButton
            label={t('spaces.global.seeAll.button.label')}
            style={styles.seeAllButton}
            onPress={navigateToAppointmentsPage}
          >
            <HoliText>{t('spaces.global.seeAll.button.label')}</HoliText>
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
  },
  seeAllButtonContainer: {
    alignSelf: 'center',
  },
  seeAllButton: {
    backgroundColor: colors.background10,
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

import React from 'react'
import { useTranslation } from 'react-i18next'

import type { CreateAppointmentInput } from '@holi/api/graphql/graphql-codegen'
import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import AppointmentInputForm, {
  getAppointmentDefaultInitialState,
} from '@holi/core/screens/appointments/components/AppointmentInputForm'
import { type Space, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliConfirmation, { useConfirmationState } from '@holi/ui/components/molecules/HoliConfirmation'

export type CreateAppointmentParams = {
  spaceIdOrName: string
}

interface AppointmentFormProps {
  space: Space
  initialAppointment?: CreateAppointmentInput
  headerTitle: string
  onSubmit: (appointment: CreateAppointmentInput) => Promise<void>
}

const AppointmentCreateEditForm = ({ space, initialAppointment, headerTitle, onSubmit }: AppointmentFormProps) => {
  const { navigateBack } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const { t } = useTranslation()

  const { props: confirmationModalProps, setShow: showConfirmationModal } = useConfirmationState({
    onPrimary: () => navigateBack(),
  })
  const exitConfirmationTitle = t('global.leavePage.confirmation.title')

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      animation: 'slide_from_bottom',
      headerTitle: () => (
        <HoliHeading level="1" size="s">
          {headerTitle}
        </HoliHeading>
      ),
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerLeft: () => <HeaderBackButton onPress={() => showConfirmationModal(true)} />,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [t, setScreenOptions, showConfirmationModal, headerTitle])

  return (
    <PermissionsGuard
      permissionType={PermissionsType.SPACES}
      space={space}
      spaceConnectionType={SpaceConnectionType.MEMBER}
      redirectRoute={`/spaces/${space.id}`}
    >
      <AppointmentInputForm
        space={space}
        initialAppointment={initialAppointment ?? getAppointmentDefaultInitialState({ spaceId: space.id })}
        onSubmit={onSubmit}
        onBackButtonPress={() => showConfirmationModal(true)}
      />

      <HoliConfirmation
        label={exitConfirmationTitle}
        title={exitConfirmationTitle}
        description={t('global.leavePage.confirmation.description')}
        secondaryText={t('global.leavePage.confirmation.dismiss')}
        primaryText={t('global.leavePage.confirmation.confirm')}
        testID="form-modal-exit-confirmation"
        {...confirmationModalProps}
      />
    </PermissionsGuard>
  )
}

export default AppointmentCreateEditForm

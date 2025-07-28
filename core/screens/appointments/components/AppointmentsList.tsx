import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import { usePaginationContext } from '@holi/core/pagination/Pagination'
import AppointmentCard from '@holi/core/screens/appointments/components/AppointmentCard'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliNoResults from '@holi/ui/components/molecules/HoliNoResults'
import { Button } from 'holi-bricks/components/button'
import { type Appointment, type Space, SpaceUserConnectionType } from '@holi/api/graphql/graphql-codegen'
import { breakpoints } from 'holi-bricks/foundations'

interface AppointmentsListProps {
  space: Pick<Space, 'id' | 'connectionStatusToMyself' | 'name'>
  pastAppointments?: boolean
}

const AppointmentsList = ({ space, pastAppointments = false }: AppointmentsListProps) => {
  const { data: appointments } = usePaginationContext<Appointment>()
  const { t } = useTranslation()
  const { navigate } = useRouting()

  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceUserConnectionType.Administrator)
  const isMember = space?.connectionStatusToMyself?.includes(SpaceUserConnectionType.Member)

  const gridBreakpoints: [number, number][] = [
    [0, 1],
    [breakpoints.md, 2],
  ]

  const navigateToAddAppointmentPage = useCallback(() => {
    navigate(`/spaces/${space.name}/appointments/create`)
  }, [navigate, space.name])

  return appointments.length > 0 ? (
    <HoliGridWrapper breakpoints={gridBreakpoints} gap={16}>
      {appointments.map((item) => (
        <HoliGridCell key={item.id}>
          <AppointmentCard
            appointment={item}
            space={space}
            key={item.id}
            isAdmin={isAdmin}
            isMember={isMember}
            pastAppointments={pastAppointments}
          />
        </HoliGridCell>
      ))}
    </HoliGridWrapper>
  ) : (
    <HoliNoResults
      firstText={t('appointment.noResults.title')}
      media={
        <HoliLocalImage
          imageSource={require('@holi/ui/assets/img/illustrations/illustration_settings.svg')}
          width={152}
          height={152}
          label=""
          isSvg
        />
      }
      secondText={isMember ? t('appointment.noResults.description') : ''}
    >
      {isMember && <Button label={t('appointment.noResults.button')} onPress={navigateToAddAppointmentPage} />}
    </HoliNoResults>
  )
}

export default AppointmentsList

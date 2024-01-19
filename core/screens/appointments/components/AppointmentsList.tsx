import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { useBreakpointMatcher } from '@holi/core/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { usePaginationContext } from '@holi/core/pagination/Pagination'
import AppointmentCard from '@holi/core/screens/appointments/components/AppointmentCard'
import { Appointment } from '@holi/core/screens/appointments/types'
import { Space, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliNoResults from '@holi/ui/components/molecules/HoliNoResults'
import { vars } from '@holi/ui/styles/globalVars'

interface AppointmentsListProps {
  space: Space
}

const AppointmentsList: React.VFC<AppointmentsListProps> = ({ space }) => {
  const { data: appointments } = usePaginationContext<Appointment>()
  const { t } = useTranslation()
  const { navigate } = useRouting()

  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)
  const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)

  const itemsInRow = useBreakpointMatcher([
    [0, 1],
    [+vars.breakpointS, 2],
    [+vars.breakpointM, 3],
    [+vars.breakpointXxl, 4],
  ])

  const navigateToAddAppointmentPage = useCallback(() => {
    navigate(`/spaces/${space.name}/appointments/create`)
  }, [navigate, space.name])

  return appointments.length > 0 ? (
    <HoliGridWrapper itemsInRow={itemsInRow} gap={16}>
      {appointments.map((item) => (
        <HoliGridCell key={item.id}>
          <AppointmentCard appointment={item} space={space} key={item.id} isAdmin={isAdmin} isMember={isMember} />
        </HoliGridCell>
      ))}
    </HoliGridWrapper>
  ) : (
    <HoliNoResults
      firstText={t('appointment.noResults.title')}
      media={
        // TODO: update illustration with the calendar icon component
        <HoliLocalImage
          imageSource={require('@holi/ui/assets/img/illustrations/illustration_settings.svg')}
          width={152}
          height={152}
          label=""
          isSvg
        />
      }
      secondText={t('appointment.noResults.description')}
    >
      <HoliButton label={t('appointment.noResults.button')} onPress={navigateToAddAppointmentPage}>
        {t('appointment.noResults.button')}
      </HoliButton>
    </HoliNoResults>
  )
}

export default AppointmentsList

import React from 'react'

import { useBreakpointMatcher } from '@holi/core/helpers'
import { usePaginationContext } from '@holi/core/pagination/Pagination'
import AppointmentCard from '@holi/core/screens/appointments/components/AppointmentCard'
import { Appointment } from '@holi/core/screens/appointments/types'
import { Space, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import { vars } from '@holi/ui/styles/globalVars'

interface AppointmentsListProps {
  space: Space
}

const AppointmentsList: React.VFC<AppointmentsListProps> = ({ space }) => {
  const { data: appointments } = usePaginationContext<Appointment>()

  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)

  const itemsInRow = useBreakpointMatcher([
    [0, 1],
    [+vars.breakpointS, 2],
    [+vars.breakpointM, 3],
    [+vars.breakpointXxl, 4],
  ])

  return (
    appointments.length > 0 && (
      <HoliGridWrapper itemsInRow={itemsInRow} gap={16}>
        {appointments.map((item) => (
          <HoliGridCell key={item.id}>
            <AppointmentCard appointment={item} space={space} key={item.id} isAdmin={isAdmin} showFullView={false} />
          </HoliGridCell>
        ))}
      </HoliGridWrapper>
    )
  )
}

export default AppointmentsList

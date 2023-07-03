import React from 'react'
import { useTranslation } from 'react-i18next'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import { Space, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'

export type SpaceInviteProps = {
  spaceIdOrName: string
  space: Space
}

const SpaceInvite: React.VFC<SpaceInviteProps> = ({ space, spaceIdOrName }) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()

  const isCollaborator = space.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)
  const isAdministrator = space.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)

  return (
    <>
      {isCollaborator || isAdministrator ? (
        <HoliButtonLoading
          inline
          variant="small"
          label={t('spaces.invite.btn.invite')}
          icon="user-add"
          onPress={() => navigate(`/spaces/${spaceIdOrName}/invite`)}
        />
      ) : null}
    </>
  )
}

export default SpaceInvite

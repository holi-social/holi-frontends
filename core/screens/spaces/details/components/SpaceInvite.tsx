import React from 'react'
import { useTranslation } from 'react-i18next'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import { Space, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { UserAdd } from '@holi/icons/src/generated'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'

export interface SpaceInviteProps {
  space: Space
}

const SpaceInvite: React.FC<SpaceInviteProps> = ({ space }) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()

  const isCollaborator = space.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)
  const isAdministrator = space.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)

  return isCollaborator || isAdministrator ? (
    <HoliButtonLoading
      inline
      variant="small"
      label={t('spaces.invite.btn.invite')}
      icon={UserAdd}
      testID={'btn-space-invite'}
      onPress={() => navigate(`/spaces/${space.name}/invite`)}
    />
  ) : null
}

export default SpaceInvite

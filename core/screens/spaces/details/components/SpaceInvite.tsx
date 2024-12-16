import type React from 'react'
import { useTranslation } from 'react-i18next'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import { type Space, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { UserAdd } from '@holi/icons/src/generated'
import { Button } from 'holi-bricks/components/button'

export interface SpaceInviteProps {
  space: Space
}

const SpaceInvite: React.FC<SpaceInviteProps> = ({ space }) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()

  const isCollaborator = space.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)
  const isAdministrator = space.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)

  return isCollaborator || isAdministrator ? (
    <Button
      inline
      size="sm"
      label={t('spaces.invite.btn.invite')}
      icon={UserAdd}
      testID={'btn-space-invite'}
      onPress={() => navigate(`/spaces/${space.name}/invite`)}
    />
  ) : null
}

export default SpaceInvite

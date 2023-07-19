import React from 'react'
import { useTranslation } from 'react-i18next'

import { useToastForNotAvailableFeature } from '@holi/core/helpers'
import { Space, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { UserAdd } from '@holi/icons/src/generated'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'

export type SpaceInviteProps = {
  spaceIdOrName: string
  space: Space
}

const SpaceInvite: React.VFC<SpaceInviteProps> = ({
  space,
  // TODO: ucomment once feature is implemented
  // spaceIdOrName
}) => {
  const { t } = useTranslation()
  const showToast = useToastForNotAvailableFeature()
  // TODO: ucomment once feature is implemented
  // const { navigate } = useRouting()

  const isCollaborator = space.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)
  const isAdministrator = space.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)

  return (
    <>
      {isCollaborator || isAdministrator ? (
        <HoliButtonLoading
          inline
          variant="small"
          label={t('spaces.invite.btn.invite')}
          icon={UserAdd}
          onPress={() => {
            showToast()
            // TODO: remove toast above and add navigate below once feature is implemented
            // navigate(`/spaces/${spaceIdOrName}/invite`)
          }}
        />
      ) : null}
    </>
  )
}

export default SpaceInvite

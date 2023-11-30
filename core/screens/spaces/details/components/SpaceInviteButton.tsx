import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { EditSpaceCollaboratorsParams } from '@holi/core/screens/spaces/edit/components/EditSpaceCollaborators'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { UserAdd } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

const SpaceInviteButton = () => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { useParam } = createParam<EditSpaceCollaboratorsParams>()
  const [spaceIdOrName] = useParam('spaceIdOrName')

  return (
    <HoliButton
      label={t('spaces.collaborators.manage.invite')}
      onPress={() => navigate(`/spaces/${spaceIdOrName}/invite`)}
      inline
      testID="btn-invite-to-space"
    >
      <HoliText style={styles.inviteBtn}>{t('spaces.collaborators.manage.invite')}</HoliText>
      <HoliIcon icon={UserAdd} size={16} />
    </HoliButton>
  )
}

const styles = StyleSheet.create({
  inviteBtn: {
    paddingRight: 6,
  },
})

export default SpaceInviteButton

import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import EditSpaceModal from '@holi/core/screens/spaces/components/EditSpaceModal'
import SpaceNameAndGoalForm from '@holi/core/screens/spaces/components/SpaceInputs/SpaceNameAndGoalForm'
import { updateSpaceMutation } from '@holi/core/screens/spaces/queries'
import { Space } from '@holi/core/screens/spaces/types'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

type EditSpaceNameAndGoalProps = {
  space: Space
  onDismiss: () => void
}

const EditSpaceNameAndGoal: React.VFC<EditSpaceNameAndGoalProps> = ({
  space,
  onDismiss,
}: EditSpaceNameAndGoalProps) => {
  const [spaceName, setSpaceName] = useState<string>(space.title)
  const [spaceGoal, setSpaceGoal] = useState<string>(space.description)
  const { openToast } = useToast()

  const [updateSpace, { loading }] = useMutation(updateSpaceMutation, {
    onCompleted: () => {
      openToast(t('spaces.edit.success'), HoliToastType.SUCCESS)
      onDismiss()
    },
    onError: () => openToast(t('global.technicalError'), HoliToastType.ERROR),
  })

  const { t } = useTranslation()

  const onSave = () => {
    updateSpace({ variables: { input: { id: space.id, title: spaceName, description: spaceGoal } } })
  }

  return (
    <EditSpaceModal
      onDismiss={onDismiss}
      onSave={onSave}
      saveButtonDisabled={loading || !spaceName || spaceName.length < 2 || !spaceGoal || spaceGoal.length < 1}
    >
      <SpaceNameAndGoalForm
        title={t('spaces.edit.nameAndGoal')}
        onChangeSpaceGoal={setSpaceGoal}
        onChangeSpaceName={setSpaceName}
        spaceGoal={spaceGoal}
        spaceName={spaceName}
      />
    </EditSpaceModal>
  )
}

export default EditSpaceNameAndGoal

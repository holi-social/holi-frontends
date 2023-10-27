import { useMutation } from '@apollo/client'
import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useErrorHandling } from '@holi/core/errors/hooks'
import SpaceTermsInput from '@holi/core/screens/spaces/components/SpaceInputs/SpaceTermsInput'
import EditSpaceModal from '@holi/core/screens/spaces/edit/components/EditSpaceModal'
import { updateSpaceMutation } from '@holi/core/screens/spaces/edit/mutations'
import { SpaceTermContext } from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { Space } from '@holi/core/screens/spaces/types'
import { Term } from '@holi/core/screens/userprofile/types'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

type EditSpaceSDGsProps = {
  space: Space
  onDismiss: () => void
}

const EditSpaceSDGs: React.VFC<EditSpaceSDGsProps> = ({ space, onDismiss }: EditSpaceSDGsProps) => {
  const [sdgs, setSdgs] = useState<Term[]>([...(space?.sdgs || [])])
  const { openToast } = useToast()
  const { sdgs: allSdgs } = useContext(SpaceTermContext)
  const { displayError } = useErrorHandling()

  const [updateSpace] = useMutation(updateSpaceMutation, {
    onCompleted: () => {
      openToast(t('spaces.edit.success'), HoliToastType.SUCCESS)
      onDismiss()
    },
    onError: (error) =>
      displayError(error, 'Failed to update space SDGs', {
        location: 'EditSpaceSDGs.updateSpace',
        spaceId: space.id,
      }),
  })

  const { t } = useTranslation()

  const onSave = () => updateSpace({ variables: { input: { id: space.id, sdgs: sdgs.map((sdg) => sdg.id) } } })

  return (
    <EditSpaceModal onDismiss={onDismiss} onSave={onSave}>
      <SpaceTermsInput
        title={t('spaces.input.sdgs.title')}
        description={t('spaces.input.sdgs.description')}
        searchPlaceholder={t('spaces.input.sdgs.search')}
        selected={sdgs}
        onSelect={setSdgs}
        terms={allSdgs}
        showSortNumber
      />
    </EditSpaceModal>
  )
}

export default EditSpaceSDGs

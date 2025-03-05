import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { Term } from '@holi/core/domain/shared/types'
import { useErrorHandling } from '@holi/core/errors/hooks'
import SpaceTermsInput from '@holi/core/screens/spaces/components/SpaceInputs/SpaceTermsInput'
import EditSpaceModalWithFooter from '@holi/core/screens/spaces/edit/components/EditSpaceModalWithFooter'
import { updateSpaceMutation } from '@holi/core/screens/spaces/edit/mutations'
import type { Space } from '@holi/core/screens/spaces/types'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { useSDGs } from '@holi/core/domain/shared/hooks'

type EditSpaceSDGsProps = {
  space: Space
  onDismiss: () => void
}

const EditSpaceSDGs = ({ space, onDismiss }: EditSpaceSDGsProps) => {
  const [sdgs, setSdgs] = useState<Term[]>([...(space?.sdgs || [])])
  const { openToast } = useToast()
  const { sdgs: allSdgs } = useSDGs()
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
    <EditSpaceModalWithFooter onDismiss={onDismiss} onSave={onSave}>
      <SpaceTermsInput
        description={t('spaces.input.sdgs.description')}
        searchPlaceholder={t('spaces.input.sdgs.search')}
        selected={sdgs}
        onSelect={setSdgs}
        terms={allSdgs}
        showSortNumber
      />
    </EditSpaceModalWithFooter>
  )
}

export default EditSpaceSDGs

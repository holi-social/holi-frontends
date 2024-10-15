import { useMutation } from '@apollo/client'
import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Term } from '@holi/core/domain/shared/types'
import { useErrorHandling } from '@holi/core/errors/hooks'
import SpaceTermsInput from '@holi/core/screens/spaces/components/SpaceInputs/SpaceTermsInput'
import EditSpaceModalWithFooter from '@holi/core/screens/spaces/edit/components/EditSpaceModalWithFooter'
import { updateSpaceMutation } from '@holi/core/screens/spaces/edit/mutations'
import { SpaceTermContext } from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { Space } from '@holi/core/screens/spaces/types'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

type EditSpaceTopicsProps = {
  space: Space
  onDismiss: () => void
}

const EditSpaceTopics: React.FC<EditSpaceTopicsProps> = ({ space, onDismiss }: EditSpaceTopicsProps) => {
  const [topics, setTopics] = useState<Term[]>([...(space?.topics || [])])
  const { openToast } = useToast()
  const { displayError } = useErrorHandling()
  const { topics: allTopics } = useContext(SpaceTermContext)

  const [updateSpace] = useMutation(updateSpaceMutation, {
    onCompleted: () => {
      openToast(t('spaces.edit.success'), HoliToastType.SUCCESS)
      onDismiss()
    },
    onError: (error) =>
      displayError(error, 'Failed to update space', {
        location: 'EditSpaceTopics',
        spaceId: space.id,
      }),
  })

  const { t } = useTranslation()

  const onSave = () => updateSpace({ variables: { input: { id: space.id, topics: topics.map((topic) => topic.id) } } })

  return (
    <EditSpaceModalWithFooter onDismiss={onDismiss} onSave={onSave} saveButtonDisabled={!topics.length}>
      <SpaceTermsInput
        description={t('spaces.input.topics.description')}
        searchPlaceholder={t('spaces.input.topics.search')}
        hint={t('spaces.input.topics.hint')}
        selected={topics}
        onSelect={setTopics}
        terms={allTopics}
        color="green"
      />
    </EditSpaceModalWithFooter>
  )
}

export default EditSpaceTopics

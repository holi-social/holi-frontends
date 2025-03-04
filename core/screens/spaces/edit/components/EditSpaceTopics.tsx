import { useMutation } from '@apollo/client'
import type React from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useErrorHandling } from '@holi/core/errors/hooks'
import EditSpaceModalWithFooter from '@holi/core/screens/spaces/edit/components/EditSpaceModalWithFooter'
import { updateSpaceMutation } from '@holi/core/screens/spaces/edit/mutations'
import type { Space } from '@holi/core/screens/spaces/types'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { TermsInput } from '@holi/core/components/TermsInput'

type EditSpaceTopicsProps = {
  space: Space
  onDismiss: () => void
}

const EditSpaceTopics: React.FC<EditSpaceTopicsProps> = ({ space, onDismiss }: EditSpaceTopicsProps) => {
  const [topics, setTopics] = useState<string[]>([...(space?.topicsV2 || [])])
  const { openToast } = useToast()
  const { displayError } = useErrorHandling()

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

  const onSave = () => updateSpace({ variables: { input: { id: space.id, topicsV2: topics } } })

  return (
    <EditSpaceModalWithFooter onDismiss={onDismiss} onSave={onSave} saveButtonDisabled={!topics.length}>
      <TermsInput
        description={t('spaces.input.topics.description')}
        searchPlaceholder={t('spaces.input.topics.search')}
        hint={t('spaces.input.topics.hint')}
        selected={topics}
        onSelect={setTopics}
        termType="topic"
      />
    </EditSpaceModalWithFooter>
  )
}

export default EditSpaceTopics

import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import EditSpaceModal from '@holi/core/screens/spaces/components/EditSpaceModal'
import SpaceTopicsInput from '@holi/core/screens/spaces/components/SpaceInputs/SpaceTopicsInput'
import { updateSpaceMutation } from '@holi/core/screens/spaces/queries'
import { Space } from '@holi/core/screens/spaces/types'
import { Topic } from '@holi/core/screens/userprofile/types'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

type EditSpaceTopicsProps = {
  space: Space
  onDismiss: () => void
}

const EditSpaceTopics: React.VFC<EditSpaceTopicsProps> = ({ space, onDismiss }: EditSpaceTopicsProps) => {
  const [topics, setTopics] = useState<Topic[]>([...(space?.topics || [])])
  const { openToast } = useToast()

  const [updateSpace, { loading }] = useMutation(updateSpaceMutation, {
    onCompleted: () => {
      openToast(t('spaces.edit.success'), HoliToastType.SUCCESS)
      onDismiss()
    },
    onError: () => openToast(t('global.technicalError'), HoliToastType.ERROR),
  })

  const { t } = useTranslation()

  const onSave = () => updateSpace({ variables: { input: { id: space.id, topics: topics.map((topic) => topic.id) } } })

  return (
    <EditSpaceModal onDismiss={onDismiss} onSave={onSave} saveButtonDisabled={loading || !topics.length}>
      <SpaceTopicsInput selectedTopics={topics} onSelectSpaceTopics={setTopics} />
    </EditSpaceModal>
  )
}

export default EditSpaceTopics

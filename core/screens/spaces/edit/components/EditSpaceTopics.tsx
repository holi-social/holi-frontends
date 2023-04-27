import { useMutation } from '@apollo/client'
import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

import SpaceTermsInput from '@holi/core/screens/spaces/components/SpaceInputs/SpaceTermsInput'
import EditSpaceModal from '@holi/core/screens/spaces/edit/components/EditSpaceModal'
import { updateSpaceMutation } from '@holi/core/screens/spaces/queries'
import { Space } from '@holi/core/screens/spaces/types'
import { Term } from '@holi/core/screens/userprofile/types'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

import { SpaceTermContext } from './SpaceTermContextProvider'

type EditSpaceTopicsProps = {
  space: Space
  onDismiss: () => void
}

const EditSpaceTopics: React.VFC<EditSpaceTopicsProps> = ({ space, onDismiss }: EditSpaceTopicsProps) => {
  const [topics, setTopics] = useState<Term[]>([...(space?.topics || [])])
  const { openToast } = useToast()
  const { topics: allTopics } = useContext(SpaceTermContext)

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
      <SpaceTermsInput
        title={t('spaces.input.topics.title')}
        description={t('spaces.input.topics.description')}
        searchPlaceholder={t('spaces.input.topics.search')}
        hint={t('spaces.input.topics.hint')}
        selected={topics}
        onSelect={setTopics}
        terms={allTopics}
      />
    </EditSpaceModal>
  )
}

export default EditSpaceTopics

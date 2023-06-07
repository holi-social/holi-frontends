import { useMutation } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { logError } from '@holi/core/errors/helpers'
import { isValidUrl } from '@holi/core/helpers'
import SpaceLinksForm from '@holi/core/screens/spaces/components/SpaceInputs/SpaceLinkForm'
import { AddExternalLinkResponse, addExternalLinkMutation } from '@holi/core/screens/spaces/create/mutations'
import EditSpaceModal from '@holi/core/screens/spaces/edit/components/EditSpaceModal'
import { spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { Space, SpaceLinkType } from '@holi/core/screens/spaces/types'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

interface CreateSpaceLinksProps {
  space: Space
  onDismiss: () => void
}

const CreateSpaceLinks: React.VFC<CreateSpaceLinksProps> = ({ space, onDismiss }: CreateSpaceLinksProps) => {
  const { openToast } = useToast()
  const [url, setUrl] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [type, setType] = useState<string>(SpaceLinkType.OTHER || '')
  const [validationErrorTextUrl, setValidationErrorTextUrl] = useState('')
  const [validationErrorTextName, setValidationErrorTextName] = useState('')
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true)

  const { t } = useTranslation()

  const [addLinkToSpace, { loading }] = useMutation<AddExternalLinkResponse>(addExternalLinkMutation, {
    onCompleted: () => {
      openToast(t('spaces.input.socialLinks.add.success'), HoliToastType.SUCCESS)
      onDismiss()
    },
    onError: (e) => {
      setValidationErrorTextUrl(t('global.validation.url.invalid'))
      logError(e, '[Spaces] Social link could not be added')
    },
    refetchQueries: [{ query: spaceByIdQuery, variables: { idOrName: space.id } }],
  })

  useEffect(() => {
    if (url.length > 0 && name.length > 0 && isValidUrl(url)) {
      setSaveButtonDisabled(false)
    } else {
      setSaveButtonDisabled(true)
    }
    if (url.length > 0 && !isValidUrl(url)) {
      setValidationErrorTextUrl(t('spaces.input.socialLinks.validation.url.invalid'))
    } else {
      setValidationErrorTextUrl('')
    }
  }, [name, url, t])

  useEffect(() => {
    const linkTypes = Object.values(SpaceLinkType)
    linkTypes.forEach((type) => {
      if (url.toUpperCase().includes(type)) {
        setType(type)
      }
    })
  }, [url])

  const onSave = () => {
    if (!url) {
      setValidationErrorTextUrl(t('spaces.input.socialLinks.validation.url.mandatory'))
      return
    }
    if (!name) {
      setValidationErrorTextName(t('spaces.input.socialLinks.validation.name.mandatory'))
      return
    }

    addLinkToSpace({
      variables: {
        input: {
          spaceId: space.id,
          url: url,
          name: name,
          type: type,
        },
      },
    })
  }

  return (
    <EditSpaceModal
      onDismiss={onDismiss}
      onSave={onSave}
      saveButtonDisabled={saveButtonDisabled || loading}
      scrollable={false}
      loading={loading}
    >
      <SpaceLinksForm
        title={t('spaces.input.socialLinks.title')}
        onChangeUrl={setUrl}
        onChangeName={setName}
        url={url}
        name={name}
        validationErrorTextUrl={validationErrorTextUrl}
        validationErrorTextName={validationErrorTextName}
      />
    </EditSpaceModal>
  )
}

export default CreateSpaceLinks

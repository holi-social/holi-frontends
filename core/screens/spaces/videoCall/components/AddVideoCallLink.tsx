import { useMutation } from '@apollo/client'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { TranslatedFieldErrors, useFieldErrors } from '@holi/core/errors/hooks'
import { generateSpaceVideoCallUrl } from '@holi/core/screens/spaces/helpers/urls'
import { spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { Space } from '@holi/core/screens/spaces/types'
import {
  AddVideoCallLinkResponse,
  AddVideoCallLinkSchema,
  addVideoCallLinkMutation,
} from '@holi/core/screens/spaces/videoCall/mutations'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'

interface AddVideoCallLinkProps {
  space: Space
}

const AddVideoCallLink: React.FC<AddVideoCallLinkProps> = ({ space }: AddVideoCallLinkProps) => {
  const { t } = useTranslation()
  const [roomName, setRoomName] = useState('')
  const [fieldErrors, setFieldErrors] = useState<TranslatedFieldErrors>({})
  const [inputValid, setInputValid] = useState(false)
  const { handleGraphQLError } = useFieldErrors({
    handledFieldErrors: ['roomName'],
  })

  const [addVideoCallLink, { loading }] = useMutation<AddVideoCallLinkResponse>(addVideoCallLinkMutation, {
    onCompleted: () => setRoomName(''),
    onError: (error) => setFieldErrors(handleGraphQLError(error)),
    refetchQueries: [{ query: spaceByIdQuery, variables: { idOrName: space.name } }],
  })

  const createLink = useCallback(() => {
    const url = generateSpaceVideoCallUrl(space, roomName)
    return addVideoCallLink({
      variables: {
        input: {
          spaceId: space.id,
          url,
          roomName,
        },
      },
    })
  }, [addVideoCallLink, roomName, space])

  useEffect(() => {
    const resultSchema = AddVideoCallLinkSchema.safeParse({
      roomName,
    })
    setInputValid(resultSchema.success)
  }, [roomName])

  return (
    <>
      <HoliTextInput
        placeholder={t('spaces.input.videoCallLink.roomName.placeholder')}
        inputLabel={t('spaces.input.videoCallLink.roomName.label')}
        validationErrorText={fieldErrors.roomName?.length ? fieldErrors.roomName[0] : undefined}
        value={roomName}
        onChange={setRoomName}
        accessibilityLabel={t('spaces.input.videoCallLink.roomName.label')}
        testID="video-call-link-room-name"
        style={{ marginTop: 16 }}
        isRequired={true}
        maxNoOfCharacters={50}
      />
      <HoliButtonLoading
        disabled={loading || !inputValid}
        label={loading ? t('spaces.input.videoCallLink.generating') : t('spaces.input.videoCallLink.generate')}
        onPress={createLink}
        testID="video-call-link-generate-btn"
        icon={loading ? 'loader-4' : undefined}
        iconSpinning={loading}
      />
    </>
  )
}

export default AddVideoCallLink

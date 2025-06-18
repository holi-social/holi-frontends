import type React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, type StyleProp, View, type ViewStyle } from 'react-native'
import { z } from 'zod'

import type { FieldError } from '@holi/core/errors/helpers'
import { type TranslatedFieldErrors, useFieldErrors } from '@holi/core/errors/hooks'
import { createUUID } from '@holi/core/helpers'
import { generateSpaceVideoCallUrl } from '@holi/core/screens/spaces/helpers/urls'
import { useVideoCallLinkStorage } from '@holi/core/screens/spaces/videoCall/useVideoCallLinkStorage'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import type { Space } from '@holi/api/graphql/graphql-codegen'

interface AddVideoCallLinkProps {
  space: Pick<Space, 'name'>
  style?: StyleProp<ViewStyle>
}

const AddVideoCallLinkSchema = z.object({
  roomName: z.string().trim().min(1).max(50).optional(),
})

const AddVideoCallLink: React.FC<AddVideoCallLinkProps> = ({ space, style }: AddVideoCallLinkProps) => {
  const { t } = useTranslation()
  const [roomName, setRoomName] = useState('')
  const [inputValid, setInputValid] = useState(false)
  const { addVideoCallLink } = useVideoCallLinkStorage(space.name)
  const { translateFieldErrors } = useFieldErrors({
    i18nPrefix: 'spaces.videocall.link',
    handledFieldErrors: ['roomName'],
  })
  const [fieldErrors, setFieldErrors] = useState<TranslatedFieldErrors>({})

  const createLink = useCallback(async () => {
    const url = generateSpaceVideoCallUrl(space, roomName)
    return addVideoCallLink({
      id: createUUID(),
      url,
      roomName,
      created: new Date().toISOString(),
    }).finally(() => {
      setRoomName('')
      Keyboard.dismiss()
    })
  }, [addVideoCallLink, roomName, space])

  useEffect(() => {
    const resultSchema = AddVideoCallLinkSchema.safeParse({
      roomName,
    })
    if (!resultSchema.success) {
      const { fieldErrors } = resultSchema.error.flatten<FieldError>()
      setFieldErrors(translateFieldErrors(fieldErrors))
    }
    setInputValid(resultSchema.success)
  }, [roomName, translateFieldErrors])

  return (
    <View style={style}>
      <HoliBox padding={[0, 0, 16, 0]}>
        <HoliTextInput
          placeholder={t('spaces.input.videoCallLink.roomName.placeholder')}
          inputLabel={t('spaces.input.videoCallLink.roomName.label')}
          validationErrorText={fieldErrors.roomName?.length ? fieldErrors.roomName[0] : undefined}
          value={roomName}
          onChange={setRoomName}
          aria-label={t('spaces.input.videoCallLink.roomName.label')}
          testID="video-call-link-room-name"
          isRequired={true}
          maxNoOfCharacters={50}
        />
      </HoliBox>
      <HoliButtonLoading
        disabled={!inputValid}
        label={t('spaces.input.videoCallLink.generate')}
        loadingLabel={t('spaces.input.videoCallLink.loading')}
        variant={'small'}
        onPress={createLink}
        testID="video-call-link-generate-btn"
      />
    </View>
  )
}

export default AddVideoCallLink

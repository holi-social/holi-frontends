import { getOrCreatePrivateRoom } from '@holi/chat/src/store'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { ButtonTracked } from '@holi/core/components/Trackable'
import { HoliError } from '@holi/core/errors/classes/HoliError'
import { logError } from '@holi/core/errors/helpers'
import { chatServerName } from '@holi/core/helpers/config'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSignupModal } from '@holi/core/providers/SignupModalProvider'
import { useRepresentative } from '@holi/core/screens/spaces/hooks/useRepresentative'
import { TrackingEvent } from '@holi/core/tracking'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import { useActionDrawerContext } from '@holi/ui/components/organisms/HoliActionDrawer/Drawer'
import type { ButtonProps } from 'holi-bricks/components/button'
import { Stack } from 'holi-bricks/components/stack'
import { Text } from 'holi-bricks/components/text'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

type StartSpaceChatButtonProps = {
  preDrawerButtonProps: Omit<ButtonProps, 'trackingEvent' | 'testID' | 'onPress'>
  drawerTitle: string
  drawerContent: string
  drawerButtonLabel: string
  spaceIdOrName: string | undefined
}

type ButtonWrapperProps = {
  spaceIdOrName: string | undefined
  drawerButtonLabel: string
}

const ButtonWrapper = ({ spaceIdOrName, drawerButtonLabel }: ButtonWrapperProps) => {
  const { isLoggedIn } = useLoggedInUser()
  const { hideDrawer } = useActionDrawerContext()
  const { openSignupModal } = useSignupModal()
  const { openToast } = useToast()
  const { navigate } = useRouting()
  const { representative } = useRepresentative(spaceIdOrName)
  const { t } = useTranslation()

  const [isLoading, setIsLoading] = useState(false)

  async function openChatRoom(chatPartnerIdentity: string) {
    try {
      const chatPartnerMatrixId = '@' + chatPartnerIdentity + ':' + chatServerName
      const { room_id } = await getOrCreatePrivateRoom([chatPartnerMatrixId])

      if (!room_id) {
        openToast(t('chat.room.error.noRoom'), HoliToastType.ERROR)
      } else {
        navigate('/chat/rooms/' + room_id)
        hideDrawer()
      }
    } catch (e) {
      logError(e, 'Failed to start space-chat with chat partner ' + chatPartnerIdentity, {
        location: 'StartChatDrawerActionButton.openChatRoom',
      })
      openToast(t('chat.room.error.openRoom'), HoliToastType.ERROR)
    }
  }

  const safelyOpenSignupModal = () => {
    /* prevent having two modals open as startChat shows another one for guest, which breaks on ios */
    hideDrawer()

    openSignupModal({
      description: t('chat.start.loginRedirect.text'),
      trackTrigger: 'START_CHAT',
    })
  }
  const start = async () => {
    setIsLoading(true)

    if (!isLoggedIn) {
      safelyOpenSignupModal()
      setIsLoading(false)
      return
    }

    if (!representative?.identity) {
      logError(
        new HoliError('Can not create a chat without a space representatives identity'),
        'Failed to start chat',
        {
          location: 'StartChatDrawerActionButton.start',
        }
      )
      setIsLoading(false)
      return
    }

    try {
      await openChatRoom(representative.identity)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ButtonTracked
      trackingEvent={TrackingEvent.TaskCTA.startedConversationFromTask}
      loading={isLoading}
      disabled={isLoading}
      onPress={start}
      variant="primary"
      size="lg"
      label={drawerButtonLabel}
    />
  )
}

export const StartSpaceChatButton = ({
  preDrawerButtonProps,
  drawerTitle,
  drawerContent,
  drawerButtonLabel,
  spaceIdOrName,
}: StartSpaceChatButtonProps) => {
  const { t } = useTranslation()

  return (
    <HoliActionDrawer.Drawer
      renderCustomButton={(onPress, testID) => (
        <ButtonTracked
          trackingEvent={TrackingEvent.TaskCTA.contactedOrganization}
          onPress={onPress}
          variant="primary"
          size="lg"
          testID={testID}
          {...preDrawerButtonProps}
          loading={preDrawerButtonProps?.loading}
        />
      )}
      label={t('global.options')}
      testID="ask-space-question"
    >
      <Stack direction="column" gap="xs">
        <HoliLocalImage
          imageSource={require('@holi/ui/assets/img/spaces/chat.svg')}
          isSvg
          label="chat"
          width={40}
          height={36}
          resizeMode="contain"
        />

        <Stack direction="column" gap="xs">
          <Text size="3xl">{drawerTitle}</Text>
          <Text size="md">{drawerContent}</Text>
        </Stack>
        <ButtonWrapper spaceIdOrName={spaceIdOrName} drawerButtonLabel={drawerButtonLabel} />
      </Stack>
    </HoliActionDrawer.Drawer>
  )
}

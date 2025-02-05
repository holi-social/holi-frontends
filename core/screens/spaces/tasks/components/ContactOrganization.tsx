import { getOrCreateSpaceTaskRoom, roomAlreadyExists } from '@holi/chat/src/store'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { ButtonTracked } from '@holi/core/components/Trackable'
import { HoliError } from '@holi/core/errors/classes/HoliError'
import { logError } from '@holi/core/errors/helpers'
import { chatServerName } from '@holi/core/helpers/config'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSignupModal } from '@holi/core/providers/SignupModalProvider'
import { TrackingEvent } from '@holi/core/tracking'
import { ChatSmile2 } from '@holi/icons/src/generated'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import { useActionDrawerContext } from '@holi/ui/components/organisms/HoliActionDrawer/Drawer'
import dimensions from '@holi/ui/styles/globalVars/dimensions'
import { Text } from 'holi-bricks/components/text'
import { useStyles } from 'holi-bricks/hooks'
import { Spacing } from 'holi-bricks/tokens'
import { createStyleSheet } from 'holi-bricks/utils'
import React, { useEffect, useState } from 'react'
import { Platform, View } from 'react-native'
import { Trans, useTranslation } from 'react-i18next'
import { useSpace } from '@holi/core/screens/spaces/hooks/useSpace'
import type { Task } from '@holi/core/screens/spaces/types'
import type { User } from '@holi/core/domain/shared/types'
import { useSpaceAdminUsers } from '@holi/core/screens/spaces/hooks/useAdmins'
import { useChatInitialized } from '@holi/chat/src/client/chatState'

const StartChatDrawerActionButton = ({
  disabled,
  spaceIdOrName,
  task,
  alreadyStarted = false,
}: ContactOrganizationProps) => {
  const { t } = useTranslation()
  const { isLoggedIn } = useLoggedInUser()
  const { hideDrawer } = useActionDrawerContext()
  const { openSignupModal } = useSignupModal()
  const { openToast } = useToast()
  const { navigate } = useRouting()
  const { adminUsers } = useSpaceAdminUsers(spaceIdOrName)

  const [isLoading, setIsLoading] = useState(false)

  const safelyOpenSignupModal = () => {
    /* prevent having two modals open as startChat shows another one for guest, which breaks on ios */
    hideDrawer()

    openSignupModal({
      description: t('chat.start.loginRedirect.text'),
      trackTrigger: 'START_CHAT',
    })
  }

  async function openChatRoom(chatPartner: User[], task: Task) {
    const chatPartnerIdentities = chatPartner?.map((chatPartner) => chatPartner.identity)

    try {
      const chatPartnerMatrixIds = chatPartnerIdentities.map((identity) => '@' + identity + ':' + chatServerName)
      const { room_id } = await getOrCreateSpaceTaskRoom(chatPartnerMatrixIds, {
        type: 'space.task',
        content: {
          taskId: task.id,
          taskName: task.name,
          spaceName: task.space?.name,
          holiSpaceId: task.space?.id,
        },
      })

      if (!room_id) {
        openToast(t('chat.room.error.noRoom'), HoliToastType.ERROR)
      } else {
        navigate('/chat/rooms/' + room_id)
        hideDrawer()
      }
    } catch (e) {
      logError(e, 'Failed to start contact-organization-chat with chat partner ' + chatPartner, {
        location: 'StartChatDrawerActionButton.openChatRoom',
      })
      openToast(t('chat.room.error.openRoom'), HoliToastType.ERROR)
    }
  }

  const startTaskChat = async () => {
    if (!isLoggedIn) {
      safelyOpenSignupModal()
      return
    }

    if (!adminUsers) {
      logError(
        new HoliError('Can not create a chat without a space representatives identity'),
        'Failed to start chat',
        {
          location: 'StartChatDrawerActionButton.start',
        }
      )
      return
    }

    setIsLoading(true)
    try {
      await openChatRoom(adminUsers, task)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ButtonTracked
      trackingEvent={TrackingEvent.TaskContactOrganization.contactedOrganization}
      loading={isLoading}
      disabled={disabled || isLoading}
      onPress={startTaskChat}
      variant="primary"
      size="lg"
      icon={ChatSmile2}
      label={alreadyStarted ? t('spaces.tasks.goToExistingTaskChat') : t('spaces.tasks.contactOrganization.cta')}
    />
  )
}

type ContactOrganizationProps = {
  disabled?: boolean
  spaceIdOrName?: string
  task: Task
  alreadyStarted?: boolean
}

const ContactOrganizationButton = (props: {
  testID: string | undefined
  onPress: () => void
  disabled?: boolean
}) => {
  const { styles } = useStyles(contactOrganizationButtonStyles)
  const { t } = useTranslation()
  const label = t('spaces.tasks.contactOrganization')

  return (
    <View
      style={[
        styles.ctaWrapper,
        Platform.OS === 'web' && {
          position: 'fixed',
        },
      ]}
      testID={props.testID}
    >
      <ButtonTracked
        disabled={props.disabled}
        trackingEvent={TrackingEvent.TaskContactOrganization.startedConversationFromTask}
        onPress={props.onPress}
        variant="primary"
        icon={ChatSmile2}
        size="lg"
        label={label}
      />
    </View>
  )
}

const contactOrganizationButtonStyles = createStyleSheet(() => ({
  ctaWrapper: {
    padding: Spacing.xxs,
    left: 0,
    right: 0,
    bottom: 0,
    maxWidth: Number(dimensions.maxScreenWidth),
    position: 'absolute',
    marginHorizontal: 'auto',
  },
}))

export const ContactOrganization = ({ spaceIdOrName, task }: ContactOrganizationProps) => {
  const { styles } = useStyles(stylesheet)
  const { t } = useTranslation()
  const { space } = useSpace(spaceIdOrName)
  const { adminUsers } = useSpaceAdminUsers(spaceIdOrName)
  const [alreadyStarted, setAlreadyStarted] = useState<boolean>(false)
  const { user } = useLoggedInUser()
  const isChatInitialized = useChatInitialized()

  useEffect(() => {
    const checkChatExists = async () => {
      if (!adminUsers) return

      const chatPartnerIdentities = adminUsers.map((adminAsUser) => adminAsUser.identity)
      const chatPartnerMatrixIds = chatPartnerIdentities.map((identity) => '@' + identity + ':' + chatServerName)
      const exists = await roomAlreadyExists(chatPartnerMatrixIds)
      setAlreadyStarted(exists)
    }

    checkChatExists()
  }, [adminUsers])

  if (!spaceIdOrName) return null

  const isSpaceAdmin = adminUsers?.some((admin) => {
    return admin.id === user?.id
  })
  if (isSpaceAdmin) return null

  return (
    <HoliActionDrawer.Drawer
      renderCustomButton={(onPress, testID) =>
        alreadyStarted ? (
          <View
            style={[
              styles.ctaWrapper,
              Platform.OS === 'web' && {
                position: 'fixed',
              },
            ]}
            testID={testID}
          >
            <StartChatDrawerActionButton
              disabled={!isChatInitialized}
              spaceIdOrName={spaceIdOrName}
              task={task}
              alreadyStarted
            />
          </View>
        ) : (
          <ContactOrganizationButton disabled={!isChatInitialized} testID={testID} onPress={onPress} />
        )
      }
      label={t('global.options')}
      testID="contact-organization-drawer"
    >
      <View style={styles.ctaDrawerContentWrapper}>
        <View style={styles.ctaDrawerContent}>
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/spaces/chat.svg')}
            isSvg
            label="chat"
            width={40}
            height={40}
            resizeMode="contain"
          />

          <Text size="3xl">{t('spaces.tasks.contactOrganization.title')}</Text>

          <Text size="md" color="support">
            <Trans t={t} i18nKey="spaces.tasks.contactOrganization.description" values={{ organization: space?.title }}>
              <Text size="lg" textAlign="center" />
            </Trans>
          </Text>

          <Text size="sm" color="support">
            {t('spaces.tasks.contactOrganization.subdescription')}
          </Text>
        </View>

        <StartChatDrawerActionButton disabled={!isChatInitialized} spaceIdOrName={spaceIdOrName} task={task} />
      </View>
    </HoliActionDrawer.Drawer>
  )
}

const stylesheet = createStyleSheet({
  ctaDrawerContent: {
    flexDirection: 'column',
    gap: Spacing['3xs'],
  },
  ctaDrawerContentWrapper: {
    flexDirection: 'column',
    gap: Spacing.xs,
  },
  image: {
    alignSelf: 'center',
  },
  ctaWrapper: {
    padding: Spacing.xxs,
    left: 0,
    right: 0,
    bottom: 0,
    maxWidth: Number(dimensions.maxScreenWidth),
    position: 'absolute',
    marginHorizontal: 'auto',
  },
})

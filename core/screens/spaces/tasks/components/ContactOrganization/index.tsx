import { getExistingRoomId, getOrCreateSpaceTaskRoom, toMatrixIdentity } from '@holi/chat/src/store'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import dimensions from '@holi/ui/styles/globalVars/dimensions'
import { Text } from 'holi-bricks/components/text'
import { Button } from 'holi-bricks/components/button'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { Spacing } from 'holi-bricks/foundations'
import React from 'react'
import { Linking, Platform, View } from 'react-native'
import { Trans, useTranslation } from 'react-i18next'
import { useSpaceAdminUsers } from '@holi/core/screens/spaces/hooks/useSpaceAdminUsers'
import { useChatInitialized } from '@holi/chat/src/client/chatState'

import { StartChatButton } from './StartChatButton'
import { ContactOrganizationActionButton } from './ContactOrganizationActionButton'
import { TrackingEvent } from '@holi/core/tracking'
import { ExternalLink, HandHeartFilled } from '@holi/icons/src/generated'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { Stack } from 'holi-bricks/components/stack'
import { Image } from 'holi-bricks/components/image'
import { useActionDrawerContext } from '@holi/ui/components/organisms/HoliActionDrawer/Drawer'
import { ButtonTracked } from '@holi/core/components/Trackable'
import { InteractionType } from '@holi/api/graphql/graphql-codegen'

interface Props {
  spaceIdOrName?: string
  taskName: string
  taskId?: string
  spaceTitle?: string
  spaceId?: string
  alreadyStarted?: boolean
  interactionType?: InteractionType
  interactionSignupLink?: string
}

const CloseButtonInsideDrawer = () => {
  const { hideDrawer } = useActionDrawerContext()
  return (
    <Button
      label="Close"
      onPress={() => {
        hideDrawer()
      }}
    />
  )
}

export const ContactOrganization = ({
  spaceIdOrName,
  spaceId,
  spaceTitle,
  taskId,
  taskName,
  interactionType,
  interactionSignupLink,
}: Props) => {
  const { styles } = useStyles(stylesheet)
  const { t } = useTranslation()
  const { adminUsers, loading: adminUsersLoading } = useSpaceAdminUsers(spaceIdOrName)
  const { user: loggedInUser } = useLoggedInUser()
  const isChatInitialized = useChatInitialized()
  const { displayError } = useErrorHandling()

  const { navigate } = useRouting()

  if (!adminUsers) return null

  const getOrCreateRoom = async () => {
    if (!spaceId || !taskId || !spaceTitle) {
      displayError(new Error('Cannot create a task room chat'), 'Cannot create a task room chat', {
        location: 'ContactOrganization.getOrCreateRoom',
        spaceIdOrName,
      })
      return undefined
    }

    const chatPartnerMatrixIds = adminUsers.map(({ identity }) => toMatrixIdentity(identity))
    const { room_id } = await getOrCreateSpaceTaskRoom(chatPartnerMatrixIds, {
      type: 'space.task',
      content: {
        taskId: taskId,
        taskName: taskName,
        spaceName: spaceTitle,
        holiSpaceId: spaceId,
      },
    })
    return room_id
  }

  const findExistingRoomId = () => {
    if (!loggedInUser) return undefined
    if (!isChatInitialized) return undefined
    if (!adminUsers) return undefined

    const adminMatrixUserIds = adminUsers.map(({ identity }) => toMatrixIdentity(identity))
    return getExistingRoomId(adminMatrixUserIds, 'space.task')
  }
  const existingRoomId = findExistingRoomId()

  const isSpaceAdmin = adminUsers?.some((admin) => admin.id === loggedInUser?.id)
  if (!spaceIdOrName || isSpaceAdmin) return null

  if (existingRoomId) {
    return (
      <View
        style={[
          styles.ctaWrapper,
          Platform.OS === 'web' && {
            position: 'fixed',
          },
        ]}
      >
        <Button
          label={t('spaces.tasks.goToExistingTaskChat')}
          onPress={() => navigate('/chat/rooms/' + existingRoomId)}
        />
      </View>
    )
  }

  if (interactionType === InteractionType.Chat) {
    return (
      <HoliActionDrawer.Drawer
        renderCustomButton={(onPress, testID) => (
          <ContactOrganizationActionButton
            loading={loggedInUser && (!isChatInitialized || adminUsersLoading)}
            testID={testID}
            onPress={onPress}
          />
        )}
        label={t('global.options')}
        testID="contact-organization-drawer"
      >
        <Stack gap="3xs">
          <Stack padding="3xs" gap="3xs">
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
              <Trans t={t} i18nKey="spaces.tasks.contactOrganization.description" values={{ organization: spaceTitle }}>
                <Text size="lg" />
              </Trans>
            </Text>
          </Stack>

          <Stack padding={{ top: 'xxs' }}>
            <StartChatButton
              chatPartners={adminUsers}
              trackingEvent={TrackingEvent.TaskCTA.contactedOrganization}
              // icon={ChatSmile2}
              label={t('spaces.tasks.contactOrganization.cta.chat.open')}
              getRoomId={getOrCreateRoom}
            />
          </Stack>
        </Stack>
      </HoliActionDrawer.Drawer>
    )
  }

  if (interactionType === InteractionType.Link) {
    return (
      <ButtonTracked
        icon={ExternalLink}
        label={t('spaces.tasks.contactOrganization.cta.link')}
        onPress={() => {
          if (interactionSignupLink) Linking.openURL(interactionSignupLink)
        }}
        trackingEvent={TrackingEvent.TaskCTA.signupButton}
      />
    )
  }

  // else interactionType === InteractionType.Ready
  return (
    <HoliActionDrawer.Drawer
      renderCustomButton={(onPress, testID) => (
        <ButtonTracked
          loading={loggedInUser && (!isChatInitialized || adminUsersLoading)}
          testID={testID}
          onPress={onPress}
          icon={HandHeartFilled}
          label={t('spaces.tasks.contactOrganization.cta.ready')}
          trackingEvent={TrackingEvent.TaskCTA.illDoItCTA}
        />
      )}
      label={t('global.options')}
      testID="contact-organization-drawer"
    >
      <Stack gap="md">
        <Stack padding={{ left: 'xxs', right: 'xxs' }} gap="lg">
          <Stack gap="xs" alignItems="center">
            <Image
              source={require('@holi/ui/assets/img/icons/give-five-big.svg')}
              width={140}
              resizeMode="contain"
              alt={t('spaces.tasks.contactOrganization.thanks.image.alt')}
              height={107}
            />
            <Text size="3xl" textAlign="center">
              {t('spaces.tasks.contactOrganization.thanks.title')}
            </Text>
          </Stack>
          <Text size="md" color="support">
            {t('spaces.tasks.contactOrganization.thanks.subtitle')}
          </Text>
        </Stack>
        <CloseButtonInsideDrawer />
      </Stack>
    </HoliActionDrawer.Drawer>
  )
}

const stylesheet = createStyleSheet({
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

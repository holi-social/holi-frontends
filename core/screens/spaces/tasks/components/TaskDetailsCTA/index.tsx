import React, { useState } from 'react'
import { Linking, Platform, View } from 'react-native'
import { Trans, useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native-unistyles'

import { getExistingRoomId, getOrCreateSpaceTaskRoom, toMatrixIdentity } from '@holi/chat/src/store'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import dimensions from '@holi/ui/styles/globalVars/dimensions'
import { Text } from 'holi-bricks/components/text'
import { Button } from 'holi-bricks/components/button'
import { Spacing } from 'holi-bricks/foundations'

import { useSpaceAdminUsers } from '@holi/core/screens/spaces/hooks/useSpaceAdminUsers'
import { useChatInitialized } from '@holi/chat/src/client/chatState'

import { StartChatButton } from './StartChatButton'
import { TrackingEvent } from '@holi/core/tracking'
import { CheckboxCircleFilled, Chat3, ExternalLink, HandHeartFilled } from '@holi/icons/src/generated'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { Stack } from 'holi-bricks/components/stack'
import { Image } from 'holi-bricks/components/image'
import { useActionDrawerContext } from '@holi/ui/components/organisms/HoliActionDrawer/Drawer'
import { ButtonTracked } from '@holi/core/components/Trackable'
import { InteractionType, type Duration, type Regularity } from '@holi/api/graphql/graphql-codegen'
import { Snackbar } from 'holi-bricks/components/snackbar/Snackbar'
import type { User } from '@holi/core/domain/shared/types'

interface Props {
  spaceIdOrName?: string
  taskName: string
  taskId?: string
  spaceTitle?: string
  spaceId?: string
  alreadyStarted?: boolean
  interactionType?: InteractionType
  interactionSignupLink?: string
  taskDuration?: Duration
  taskRegularity?: Regularity
}

const CloseButtonInsideDrawer = () => {
  const { hideDrawer } = useActionDrawerContext()
  const { t } = useTranslation()
  return (
    <Button
      label={t('spaces.tasks.contactOrganization.modal.close')}
      onPress={() => {
        hideDrawer()
      }}
    />
  )
}

export const TaskDetailsCTA = ({
  spaceIdOrName,
  spaceId,
  spaceTitle,
  taskId,
  taskName,
  interactionType,
  interactionSignupLink,
  taskDuration,
  taskRegularity,
}: Props) => {
  const { t } = useTranslation()
  const { adminUsers, loading: adminUsersLoading } = useSpaceAdminUsers(spaceIdOrName)
  const { user: loggedInUser } = useLoggedInUser()
  const isChatInitialized = useChatInitialized()
  const { displayError } = useErrorHandling()
  const [showSnackbar, setShowSnackbar] = useState(false)

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

    const chatPartnerMatrixIds = adminUsers.map(({ identity }) => toMatrixIdentity(identity ?? ''))
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

    const adminMatrixUserIds = adminUsers.map(({ identity }) => toMatrixIdentity(identity ?? ''))
    return getExistingRoomId(adminMatrixUserIds, 'space.task')
  }
  const existingRoomId = findExistingRoomId()

  const isSpaceAdmin = adminUsers?.some((admin) => admin.id === loggedInUser?.id)
  if (!spaceIdOrName || !taskId || isSpaceAdmin) return null

  const taskProps = {
    taskId,
    taskName,
    regularity: taskRegularity,
    duration: taskDuration,
  }

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
          <View testID={testID}>
            <Button
              onPress={onPress}
              loading={loggedInUser && (!isChatInitialized || adminUsersLoading)}
              disabled={loggedInUser && (!isChatInitialized || adminUsersLoading)}
              variant="primary"
              icon={Chat3}
              label={t('spaces.tasks.contactOrganization.cta.chat')}
            />
          </View>
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
              chatPartners={adminUsers as User[]}
              trackingEvent={TrackingEvent.Task.CTAButton.startedConversation(taskProps)}
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
        trackingEvent={TrackingEvent.Task.CTAButton.signedUp(taskProps)}
      />
    )
  }

  // else interactionType === InteractionType.Ready
  return (
    <>
      <Snackbar
        label={t('spaces.tasks.contactOrganization.snackbar')}
        icon={CheckboxCircleFilled}
        dismissible
        onDismiss={() => setShowSnackbar(false)}
        visible={showSnackbar}
      />
      <HoliActionDrawer.Drawer
        renderCustomButton={(onPress, testID) => (
          <ButtonTracked
            testID={testID}
            onPress={onPress}
            icon={HandHeartFilled}
            label={t('spaces.tasks.contactOrganization.cta.ready')}
            trackingEvent={TrackingEvent.Task.CTAButton.illDoIt(taskProps)}
          />
        )}
        label={t('global.options')}
        testID="contact-organization-drawer"
        onHide={() => {
          setShowSnackbar(true)
        }}
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
    </>
  )
}

const styles = StyleSheet.create({
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

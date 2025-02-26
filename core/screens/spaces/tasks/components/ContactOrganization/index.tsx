import { getExistingRoomId, getOrCreateSpaceTaskRoom, toMatrixIdentity } from '@holi/chat/src/store'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import dimensions from '@holi/ui/styles/globalVars/dimensions'
import { Text } from 'holi-bricks/components/text'
import { Button } from 'holi-bricks/components/button'
import { useStyles } from 'holi-bricks/hooks'
import { Spacing } from 'holi-bricks/tokens'
import { createStyleSheet } from 'holi-bricks/utils'
import React from 'react'
import { Platform, View } from 'react-native'
import { Trans, useTranslation } from 'react-i18next'
import { useSpaceAdminUsers } from '@holi/core/screens/spaces/hooks/useSpaceAdminUsers'
import { useChatInitialized } from '@holi/chat/src/client/chatState'

import { StartChatButton } from './StartChatButton'
import { ContactOrganizationActionButton } from './ContactOrganizationActionButton'
import { TrackingEvent } from '@holi/core/tracking'
import { ChatSmile2 } from '@holi/icons/src/generated'
import { useErrorHandling } from '@holi/core/errors/hooks'

interface Props {
  spaceIdOrName?: string
  taskName: string
  taskId?: string
  spaceTitle?: string
  spaceId?: string
  alreadyStarted?: boolean
}

export const ContactOrganization = ({ spaceIdOrName, spaceId, spaceTitle, taskId, taskName }: Props) => {
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

  return (
    <HoliActionDrawer.Drawer
      renderCustomButton={(onPress, testID) => (
        <ContactOrganizationActionButton
          loading={!isChatInitialized || adminUsersLoading}
          testID={testID}
          onPress={onPress}
        />
      )}
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
            <Trans t={t} i18nKey="spaces.tasks.contactOrganization.description" values={{ organization: spaceTitle }}>
              <Text size="lg" textAlign="center" />
            </Trans>
          </Text>

          <Text size="sm" color="support">
            {t('spaces.tasks.contactOrganization.subdescription')}
          </Text>
        </View>

        <StartChatButton
          chatPartners={adminUsers}
          trackingEvent={TrackingEvent.TaskContactOrganization.contactedOrganization}
          icon={ChatSmile2}
          label={t('spaces.tasks.contactOrganization.cta')}
          getRoomId={getOrCreateRoom}
        />
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

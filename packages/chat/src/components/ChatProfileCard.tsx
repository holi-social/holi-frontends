import React from 'react'
import type { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { joinRoom, leaveRoom } from '@holi/chat/src/store'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import type { User } from '@holi/core/screens/userprofile/types'
import HoliDivider from '@holi/ui/components/atoms/HoliDivider'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import HoliCardBoard from '@holi/ui/components/organisms/HoliCardBoard'
import { vars } from '@holi/ui/styles/globalVars'

interface Props {
  roomId: string
  user?: User
  userIsLoading: boolean
}

const ChatProfileCard = ({ roomId, user, userIsLoading }: PropsWithChildren<Props>) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { openToast } = useToast()

  const handleRejectRoom = async () => {
    await leaveRoom(roomId)
    navigate('/chat')
  }

  const handleJoin = async () => {
    try {
      await joinRoom(roomId)
    } catch (e) {
      openToast(t('chat.offline'))
    }
  }

  return (
    <View style={styles.container}>
      <HoliCardBoard.Card>
        <HoliCardBoard.Slot>
          {user ? (
            <>
              <HoliAvatar
                imageSrc={user?.avatar}
                imageBlurhash={user?.avatarBlurhash}
                label={user.fullName || ''}
                initials={user?.avatarLabel || ''}
                defaultColor={user?.avatarDefaultColor || ''}
                size="large"
                loading={userIsLoading}
              />
              <View>
                <HoliHeading size="medium">{user.fullName}</HoliHeading>
                {!!user?.pronouns && <HoliText color="gray300">{user?.pronouns}</HoliText>}
              </View>
            </>
          ) : null}
        </HoliCardBoard.Slot>
        <HoliDivider />
        <HoliCardBoard.Slot>
          <HoliText color="gray300">
            {t('chat.invitation.copy', { fullName: user?.fullName ?? 'Anonymous User' })}
          </HoliText>
          <View style={styles.buttons}>
            <HoliButton inline label={t('chat.invitation.reject')} type="secondary" onPress={handleRejectRoom}>
              {t('chat.invitation.reject')}
            </HoliButton>
            <HoliButton inline label={t('chat.invitation.accept')} onPress={handleJoin}>
              {t('chat.invitation.accept')}
            </HoliButton>
          </View>
        </HoliCardBoard.Slot>
      </HoliCardBoard.Card>
    </View>
  )
}

export default ChatProfileCard

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
    maxWidth: vars.maxScreenWidth,
    paddingHorizontal: 16,
    paddingVertical: vars.bottomBarHeight,
  },
  buttons: {
    flexDirection: 'row',
    columnGap: 20,
    maxWidth: '100%',
  },
})

import { useSetAtom } from 'jotai'
import React from 'react'
import type { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { joinRoomAtom } from '@holi/chat/src/store'
import type { User } from '@holi/core/screens/userprofile/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliColumn from '@holi/ui/components/atoms/HoliColumn'
import HoliColumns from '@holi/ui/components/atoms/HoliColumns'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliCardBoard from '@holi/ui/components/organisms/HoliCardBoard'
import { vars } from '@holi/ui/styles/globalVars'

interface Props {
  roomId: string
  user?: User
  userIsLoading: boolean
}

const ChatProfileInvitationCard = ({ roomId, user, userIsLoading }: PropsWithChildren<Props>) => {
  const { t } = useTranslation()
  const joinRoom = useSetAtom(joinRoomAtom)

  return (
    <View style={styles.container}>
      <HoliCardBoard>
        {user ? (
          <>
            <HoliBox padding={[0, 0, 16, 0]}>
              <HoliAvatar
                imageSrc={user?.avatar}
                imageBlurhash={user?.avatarBlurhash}
                label={user.fullName || ''}
                initials={user?.avatarLabel || ''}
                defaultColor={user?.avatarDefaultColor || ''}
                size="large"
                loading={userIsLoading}
              />
            </HoliBox>
            <HoliBox padding={[0, 0, 16, 0]}>
              <HoliHeading size="medium">{user.fullName}</HoliHeading>
              {!!user?.pronouns ?? <HoliText color="gray300">{user?.pronouns}</HoliText>}
            </HoliBox>
            <HoliColumns>
              <HoliColumn width="auto">
                <HoliButton label={t('chat.accept.invitation')} onPress={async () => await joinRoom(roomId)}>
                  {t('chat.accept.invitation')}
                </HoliButton>
              </HoliColumn>
            </HoliColumns>
          </>
        ) : null}
      </HoliCardBoard>
    </View>
  )
}

export default ChatProfileInvitationCard

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
    maxWidth: vars.maxScreenWidth,
    paddingHorizontal: 16,
    paddingVertical: vars.bottomBarHeight,
  },
})

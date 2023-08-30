import { useAtomValue } from 'jotai'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native'

import RoomList from '@holi/chat/src/components/RoomList'
import { ChatRoomAtom, roomAtomsSortedByDateAtom } from '@holi/chat/src/store'
import { useChatInitialized } from '@holi/chat/src/store'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { User } from '@holi/core/screens/userprofile/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Pencil } from '@holi/icons/src/generated'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliNoResults from '@holi/ui/components/molecules/HoliNoResults'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const ChatHomeNeedToLogin = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { navigate } = useRouting()

  return (
    <ScrollHeaderLayout.Default backgroundColor={colors.background20}>
      <View style={mixins.container}>
        <HoliNoResults
          firstText={t('loginRedirect.title')}
          media={
            <HoliLocalImage
              imageSource={require('@holi/ui/assets/img/illustrations/illustration_chat_emtpy.svg')}
              width={251}
              height={188}
              label=""
              isSvg
            />
          }
          secondText={t('loginRedirect.text')}
          style={[styles.noResultsMessage]}
        >
          <HoliButton label={t('loginRedirect.btnConfirm')} onPress={() => navigate('/login')}>
            {t('loginRedirect.btnConfirm')}
          </HoliButton>
        </HoliNoResults>
      </View>
    </ScrollHeaderLayout.Default>
  )
}

const ChatHomeNoExistingRooms = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { navigate } = useRouting()

  return (
    <ScrollHeaderLayout.Default backgroundColor={colors.background20}>
      <View style={mixins.container}>
        <HoliNoResults
          firstText={t('chat.empty.tagline')}
          media={
            <HoliLocalImage
              imageSource={require('@holi/ui/assets/img/illustrations/illustration_chat_emtpy.svg')}
              width={251}
              height={188}
              label=""
              isSvg
            />
          }
          secondText={t('chat.empty.headline')}
          style={[styles.noResultsMessage]}
        >
          <HoliButton label={t('chat.empty.button.text')} onPress={() => navigate('/chat/start')}>
            {t('chat.empty.button.text')}
          </HoliButton>
        </HoliNoResults>
      </View>
    </ScrollHeaderLayout.Default>
  )
}

const ChatHomeRoomList = ({
  loggedInUser,
  sortedRoomAtoms,
}: {
  loggedInUser: User
  sortedRoomAtoms: ChatRoomAtom[]
}) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { navigate } = useRouting()

  return (
    <SafeAreaView style={styles.wrapper}>
      <RoomList roomAtoms={sortedRoomAtoms} loggedInUser={loggedInUser} />

      <View style={[mixins.container, styles.overlayButtonWrapper]}>
        <HoliButton
          label={t('chat.start.title')}
          inline
          style={styles.overlayButton}
          onPress={() => navigate('/chat/start')}
          testID={'start-chat-button'}
        >
          <HoliIcon icon={Pencil} size={24} color={colors.foreground30} />
        </HoliButton>
      </View>
    </SafeAreaView>
  )
}

const ChatHomeContent = () => {
  const { isLoggedIn, isLoading, user: loggedInUser } = useLoggedInUser()
  const chatInitialized = useChatInitialized()
  const sortedRoomAtoms = useAtomValue(roomAtomsSortedByDateAtom)

  if (!isLoading && !isLoggedIn) {
    return <ChatHomeNeedToLogin />
  }

  if (isLoading || !chatInitialized || !loggedInUser) {
    return <HoliLoader style={{ backgroundColor: colors.background20 }} />
  }

  if (!sortedRoomAtoms.length) {
    return <ChatHomeNoExistingRooms />
  }

  return <ChatHomeRoomList loggedInUser={loggedInUser} sortedRoomAtoms={sortedRoomAtoms} />
}

export default memo(ChatHomeContent)

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background20,
    ...Platform.select({
      web: {
        minHeight: '100%',
      },
    }),
  },
  noResultsMessage: {
    marginTop: 24,
  },
  overlayButtonWrapper: {
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    bottom: 0,
  },
  overlayButton: {
    position: 'absolute',
    bottom: (Platform.OS === 'web' ? +vars.bottomBarHeight : 0) + 12,
    right: 12,
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
})

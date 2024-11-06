import { atom, useAtomValue } from 'jotai'
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'

import { useChatInitialized } from '@holi/chat/src/client/chatState'
import ChatTabBar, { DEFAULT_TAB_ID } from '@holi/chat/src/components/ChatTabsBar'
import RoomList from '@holi/chat/src/components/RoomList'
import {
  type ChatRoomAtom,
  loggedInMemberIdAtom,
  privateRoomAtomsAtom,
  roomAtomsAtom,
  roomAtomsSortedByDateAtom,
  sortRoomByTimestamp,
  spaceRoomIdToChildRoomsAtom,
} from '@holi/chat/src/store'
import { isWeb } from '@holi/chat/src/utils'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { User } from '@holi/core/domain/shared/types'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import { setPathToRedirect } from '@holi/core/navigation/hooks/useRedirect'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Pencil } from '@holi/icons/src/generated'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliNoResults from '@holi/ui/components/molecules/HoliNoResults'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const ChatHomeNeedToLogin = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { navigate } = useRouting()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <ScrollView style={{ backgroundColor: colors.background20 }}>
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
          testID="chat-login"
        >
          <HoliButton
            label={t('loginRedirect.btnConfirm')}
            onPress={() => {
              setPathToRedirect('/chat')
              navigate('/login')
            }}
          >
            {t('loginRedirect.btnConfirm')}
          </HoliButton>
        </HoliNoResults>
      </View>
    </ScrollView>
  )
}

const ChatHomeNoExistingRooms = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { navigate } = useRouting()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <ScrollView style={{ backgroundColor: colors.background20 }}>
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
          testID="chat-no-result"
        >
          <HoliButton label={t('chat.empty.button.text')} onPress={() => navigate('/chat/start')}>
            {t('chat.empty.button.text')}
          </HoliButton>
        </HoliNoResults>
      </View>
    </ScrollView>
  )
}

interface ChatHomeRoomListProps {
  loggedInUser: User
}

type ChatHomeContentParams = {
  activeTab: string
}

const { useParam } = createParamHooks<ChatHomeContentParams>()

const tabRoomAtomsRecordAtom = atom<Record<string, ChatRoomAtom[]>>((get) => {
  const roomAtoms = get(roomAtomsAtom)
  const privateRooms = get(privateRoomAtomsAtom)
  const spaceIdToChildRoomAtoms = get(spaceRoomIdToChildRoomsAtom)

  const loggedInMemberId = get(loggedInMemberIdAtom)
  const tabRooms: Record<string, ChatRoomAtom[]> = {}

  for (const id in spaceIdToChildRoomAtoms) {
    if (!privateRooms) continue

    const spaceChildRooms = spaceIdToChildRoomAtoms[id]

    const sharedPrivateRooms = spaceChildRooms.reduce((sharedRoomAtoms: ChatRoomAtom[], spaceChildRoomAtom) => {
      if (!spaceChildRoomAtom) return sharedRoomAtoms
      const spaceChildRoom = get(spaceChildRoomAtom)
      if (!spaceChildRoom) return sharedRoomAtoms

      const sharedPrivateRooms = privateRooms.filter((privateRoomAtom) => {
        const sharedMember = spaceChildRoom.members.find(({ id }) => {
          const privateRoom = get(privateRoomAtom)
          if (!privateRoom) return false

          return privateRoom.members.find((member) => loggedInMemberId !== id && member.id === id)
        })

        return Boolean(sharedMember)
      })

      return sharedRoomAtoms.concat(sharedPrivateRooms)
    }, [])

    tabRooms[id] = spaceChildRooms
      .concat(sharedPrivateRooms)
      .sort((roomAtomA, roomAtomB) => sortRoomByTimestamp(get(roomAtomA), get(roomAtomB)))
  }

  tabRooms.all = roomAtoms.sort((roomAtomA, roomAtomB) => sortRoomByTimestamp(get(roomAtomA), get(roomAtomB)))

  return tabRooms
})

const ChatHomeRoomList = ({ loggedInUser }: ChatHomeRoomListProps) => {
  const [selectedTabId = DEFAULT_TAB_ID] = useParam('activeTab')

  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { navigate } = useRouting()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const sortedRoomAtoms = useAtomValue(roomAtomsSortedByDateAtom)
  const tabRoomAtomsRecord = useAtomValue(tabRoomAtomsRecordAtom)

  if (!sortedRoomAtoms.length) {
    return <ChatHomeNoExistingRooms />
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <HoliContainer noPadding>
        <ChatTabBar selectedTabId={selectedTabId} />
      </HoliContainer>

      <RoomList roomAtoms={tabRoomAtomsRecord[selectedTabId]} loggedInUser={loggedInUser} />

      <View style={[mixins.container, styles.overlayButtonWrapper]}>
        <HoliButton
          label={t('chat.start.title')}
          inline
          style={styles.overlayButton}
          onPress={() => navigate('/chat/start')}
          testID="start-chat-button"
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
  const { theme } = useTheme()
  const { colors } = theme

  if (!isLoading && !isLoggedIn) return <ChatHomeNeedToLogin />

  if (isLoading || !chatInitialized || !loggedInUser) {
    return <HoliLoader style={{ backgroundColor: colors.background20 }} testID="chat-home-loader" />
  }

  return <ChatHomeRoomList loggedInUser={loggedInUser} />
}

export default memo(ChatHomeContent)

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: theme.colors.background20,
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
      position: isWeb ? 'fixed' : 'absolute',
      bottom: 0,
    },
    overlayButton: {
      position: 'absolute',
      bottom: (isWeb ? dimensions.bottomBarHeight : 0) + 12,
      right: 12,
      borderWidth: 1,
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
  })

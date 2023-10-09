import { useAtomValue } from 'jotai'
import React, { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native'

import { useChatInitialized } from '@holi/chat/src/client/chatSession'
import RoomList from '@holi/chat/src/components/RoomList'
import { ChatRoomAtom, roomAtomsSortedByDateAtom, spaceRoomAtomsRecordAtom } from '@holi/chat/src/store'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { useBreakpointMatcher } from '@holi/core/helpers'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { User } from '@holi/core/screens/userprofile/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Pencil } from '@holi/icons/src/generated'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliNoResults from '@holi/ui/components/molecules/HoliNoResults'
import HoliTabBar, { Tab } from '@holi/ui/components/organisms/HoliTabBar'
import { colors, vars } from '@holi/ui/styles/globalVars'
import variables from '@holi/ui/styles/globalVars/variables'
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

interface ChatHomeRoomListProps {
  loggedInUser: User
}

// TODO: remove after finishing the story: https://holi.atlassian.net/browse/HOLI-5130
const IS_CHAT_TAB_BAR_ENABLED = false

const ChatHomeRoomList = ({ loggedInUser }: ChatHomeRoomListProps) => {
  const { top: safeAreaInsetTop } = useSafeAreaInsets()
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { navigate } = useRouting()

  const sortedRoomAtoms = useAtomValue(roomAtomsSortedByDateAtom)
  const spaceRoomAtomsRecord = useAtomValue(spaceRoomAtomsRecordAtom)
  const [selectedTabId, setSelectedTabId] = useState('all')

  const tabBarStyle = useBreakpointMatcher([[+variables.breakpointS, mixins.container]])

  if (!sortedRoomAtoms.length) {
    return <ChatHomeNoExistingRooms />
  }

  const tabs: Tab[] = [
    {
      id: 'all',
      title: 'All',
    },
    // TODO: provide a way to have real space room name
    ...Object.keys(spaceRoomAtomsRecord).map((roomId) => ({
      id: roomId,
      title: roomId,
    })),
  ]

  const tabRoomAtoms: Record<string, ChatRoomAtom[]> = {
    ...spaceRoomAtomsRecord,
    all: sortedRoomAtoms,
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <HoliBox padding={[+vars.topBarHeight + (Platform.OS === 'android' ? safeAreaInsetTop : 0), 0, 0, 0]}>
        {IS_CHAT_TAB_BAR_ENABLED && (
          <HoliTabBar
            id="chat-bar"
            tabs={tabs}
            selectedTabId={selectedTabId}
            onPress={(tabId) => setSelectedTabId(tabId.toString())}
            tabBarStyle={Platform.OS === 'web' && tabBarStyle}
          />
        )}
      </HoliBox>

      <RoomList roomAtoms={tabRoomAtoms[selectedTabId]} loggedInUser={loggedInUser} />

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

  if (!isLoading && !isLoggedIn) {
    return <ChatHomeNeedToLogin />
  }

  if (isLoading || !chatInitialized || !loggedInUser) {
    return <HoliLoader style={{ backgroundColor: colors.background20 }} />
  }

  return <ChatHomeRoomList loggedInUser={loggedInUser} />
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

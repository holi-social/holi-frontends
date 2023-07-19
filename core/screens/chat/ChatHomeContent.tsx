import { useAtomValue, useSetAtom } from 'jotai'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native'

import { addToRoomAtoms, roomAtomsRecordAtom, useSubscribeToRoomAndMessageUpdates } from '@holi/chat/src/store'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import RoomList from '@holi/core/screens/chat/components/RoomList'
import { chatRoomListSeed } from '@holi/core/screens/chat/components/seed'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliNoResults from '@holi/ui/components/molecules/HoliNoResults'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const ChatHomeContent = () => {
  useSubscribeToRoomAndMessageUpdates()

  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { isLoggedIn } = useLoggedInUser()
  const { navigate } = useRouting()

  const roomAtomsRecord = useAtomValue(roomAtomsRecordAtom)
  const createRoomAtom = useSetAtom(addToRoomAtoms)

  const handleRoomCreation = async () => {
    // TODO: Get Matrix user ids dynamically
    const userIds: string[] = ['@rosd_ddd:local.chat.holi.social']
    createRoomAtom(userIds)
  }

  if (!isLoggedIn) {
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

  if (!chatRoomListSeed.length) {
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
            <HoliButton label={t('loginRedirect.btnConfirm')} onPress={handleRoomCreation}>
              {t('chat.empty.button.text')}
            </HoliButton>
          </HoliNoResults>
        </View>
      </ScrollHeaderLayout.Default>
    )
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      {/* <HoliBox padding={[100, 0]}>
        <HoliButton label={'Create a room'} onPress={handleRoomCreation}>
          Create a room
        </HoliButton>
      </HoliBox>

      <FlatList
        data={roomsAtoms}
        renderItem={({ item }) => <RoomListItem item={item} />}
        keyExtractor={(item) => item.toString()}
      /> */}
      <RoomList roomAtoms={roomAtomsRecord} />
    </SafeAreaView>
  )
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
  listHeaderSpacer: {
    height: vars.topBarHeight,
  },
  listItemSeparator: {
    borderColor: colors.background30,
    borderTopWidth: 1,
  },
  noResultsMessage: {
    marginTop: 24,
  },
})

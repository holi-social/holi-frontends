import { useLazyQuery } from '@apollo/client'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Platform, Pressable, SafeAreaView, StyleSheet, View } from 'react-native'

import { getOrCreateRoom } from '@holi/chat/src/store'
import { useAuth } from '@holi/core/auth/helpers/useAuth'
import KeyboardAvoidingViewWrapper from '@holi/core/components/KeyboardAvoidingViewWrapper'
import { logError } from '@holi/core/errors/helpers'
import { chatServerName } from '@holi/core/helpers/config'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { UserByNameResponse, userByNameQuery } from '@holi/core/screens/userprofile/queries'
import { User } from '@holi/core/screens/userprofile/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { SpinningIconContainer } from '@holi/icons/src/SpinningIconContainer'
import { Loader, Search } from '@holi/icons/src/generated'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import HoliCheckbox from '@holi/ui/components/molecules/HoliCheckbox'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { isWebTouchDevice, useDebounce } from '@holi/ui/helper'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const FIND_USER_BY_NAME_LIMIT = 30
const MIN_USER_NAME_CHARACTERS = 2

const USER_ITEM_HEIGHT = 48
const USER_ITEM_VERTICAL_PADDING = 8

const isWeb = Platform.OS === 'web'

const ChatStartConversationView = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { replaceRoute, navigate } = useRouting()

  const [searchUserInputValue, setSearchUserInputValue] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const initialInput = useRef(true)
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)

  // if user is not logged in, redirect to home
  const { userId } = useAuth()
  useEffect(() => {
    if (userId === null) navigate('/')
  }, [navigate, userId])

  const setScreenOptions = useSetScreenOptions()

  useEffect(() => {
    setScreenOptions({
      title: t('chat.start.title'),
      headerStyle: {
        backgroundColor: colors.background20,
      },
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [setScreenOptions, t])

  // BE API
  const [fetchUserByName, { loading }] = useLazyQuery<UserByNameResponse>(userByNameQuery)
  const getUsersByName = useCallback(
    async (userNameSubstr: string, offset = 0) => {
      const { data: { userByName: { data: users = [] } = {} } = {} } = await fetchUserByName({
        variables: {
          substring: userNameSubstr,
          offset,
          limit: FIND_USER_BY_NAME_LIMIT,
        },
      })

      setUsers(users)
    },
    [fetchUserByName]
  )
  const getUsersByNameDebounced = useDebounce(getUsersByName, 300)
  const isButtonLoading = loading || isCreatingRoom

  // Event handlers
  const onSearchUserInputChange = async (value: string) => {
    setSearchUserInputValue(value)
    // deselect user
    setSelectedUser(null)
    // fetch users only when input is greater equal 2 characters
    if (value.length >= MIN_USER_NAME_CHARACTERS) {
      getUsersByNameDebounced(value)
      if (initialInput.current) {
        initialInput.current = false
      }
    }
  }

  const onUserSelect = (user: User) => {
    setSelectedUser(user.id !== selectedUser?.id ? user : null)
  }

  const createChatRoom = async () => {
    if (!selectedUser) return

    const identity = selectedUser.identity
    if (!identity) {
      logError('Can not create a chat with out an user identity')
      return
    }

    try {
      setIsCreatingRoom(true)

      const { room_id } = await getOrCreateRoom(['@' + identity + ':' + chatServerName])
      if (!room_id) {
        logError('Can not open a room without a room id')
        return
      }

      replaceRoute('/chat/rooms/' + room_id)
    } catch (err) {
      logError(err)
    } finally {
      setIsCreatingRoom(false)
    }
  }

  const trailingComponent = useMemo(() => {
    const icon = loading ? Loader : Search
    return (
      <SpinningIconContainer spinning={loading}>
        <HoliIcon icon={icon} size={22} />
      </SpinningIconContainer>
    )
  }, [loading])

  return (
    <KeyboardAvoidingViewWrapper
      renderProp={() => (
        <SafeAreaView style={styles.wrapper}>
          <View style={styles.inner}>
            <HoliTextInput
              value={searchUserInputValue}
              placeholder={t('chat.start.input.label')}
              accessibilityLabel={t('chat.start.input.label')}
              trailingComponent={trailingComponent}
              onChange={onSearchUserInputChange}
              validationErrorText={
                !initialInput.current && searchUserInputValue.length < MIN_USER_NAME_CHARACTERS
                  ? t('chat.start.input.error', { count: MIN_USER_NAME_CHARACTERS })
                  : ''
              }
              style={mixins.container}
            />

            {users.length ? (
              <FlatList
                data={users}
                renderItem={({ item: user }) => {
                  return (
                    <Pressable style={[styles.flexRow, styles.userItem]} onPress={() => onUserSelect(user)}>
                      <View style={[styles.flexRow, styles.userItemContent]}>
                        <HoliBox padding={[0, 16, 0, 0]}>
                          <HoliAvatar
                            imageSrc={user.avatar}
                            imageBlurhash={user.avatarBlurhash}
                            label={user.avatarLabel}
                            initials={user.avatarLabel}
                            defaultColor={user.avatarDefaultColor}
                            size="medium"
                          />
                        </HoliBox>

                        <HoliText>{user.fullName}</HoliText>
                      </View>

                      <HoliBox padding={[0, 0, 0, 16]}>
                        <HoliCheckbox
                          shape="round"
                          checked={user.id === selectedUser?.id}
                          autofocus={false}
                          accessibilityLabel={t('chat.start.userItem.checkbox.label', { user: user.fullName })}
                          onSelect={() => onUserSelect(user)}
                        />
                      </HoliBox>
                    </Pressable>
                  )
                }}
                keyExtractor={(item) => item.id}
                ListFooterComponent={() => <View style={{ height: 98 }} />}
                getItemLayout={(_, index) => ({
                  length: USER_ITEM_HEIGHT,
                  offset: (USER_ITEM_HEIGHT + USER_ITEM_VERTICAL_PADDING * 2) * index,
                  index,
                })}
                style={[mixins.container, styles.list]}
              />
            ) : (
              <View style={[mixins.container, styles.listDesctiption]}>
                <HoliHeading level="3" style={styles.listDesctiptionText}>
                  {t('chat.start.description')}
                </HoliHeading>
              </View>
            )}

            <View style={[mixins.container, styles.overlayButtonWrapper]}>
              <HoliButtonLoading
                label={t('chat.start.button.label')}
                disabled={!selectedUser || isButtonLoading}
                icon={isButtonLoading ? Loader : undefined}
                iconSpinning={isButtonLoading}
                onPress={createChatRoom}
              />
            </View>
          </View>

          {isCreatingRoom && <HoliLoader />}
        </SafeAreaView>
      )}
    />
  )
}

export default ChatStartConversationView

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background20,
    flex: 1,
    ...Platform.select({
      web: {
        minHeight: '100%',
      },
    }),
  },
  inner: {
    flex: 1,
    marginTop: vars.topBarHeight,
    paddingTop: 16,
  },
  list: {
    flex: 1,
    paddingTop: 24,
  },
  listDesctiption: {
    flex: 1,
    justifyContent: 'center',
  },
  listDesctiptionText: {
    textAlign: 'center',
  },
  userItem: {
    justifyContent: 'space-between',
    padding: USER_ITEM_VERTICAL_PADDING,
  },
  userItemContent: {
    flexShrink: 1,
  },
  overlayButtonWrapper: {
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    bottom: (!isWebTouchDevice() && isWeb ? 20 : 0) + 8,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})

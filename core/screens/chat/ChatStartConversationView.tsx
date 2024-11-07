import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Platform, Pressable, StyleSheet, View } from 'react-native'

import { useLazyAbortableQuery } from '@holi/api/useLazyAbortableQuery'
import KeyboardAvoidingViewWrapper from '@holi/core/components/KeyboardAvoidingViewWrapper'
import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import { UserByNameResponse, userByNameQuery } from '@holi/core/domain/shared/queries'
import { User } from '@holi/core/domain/shared/types'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { StartChatButton } from '@holi/core/screens/userprofile/components/StartChatButton'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { SpinningIconContainer } from '@holi/icons/src/SpinningIconContainer'
import { Loader, Search } from '@holi/icons/src/generated'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliCheckbox from '@holi/ui/components/molecules/HoliCheckbox'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { isWebTouchDevice, useDebounce } from '@holi/ui/helper'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const FIND_USER_BY_NAME_LIMIT = 30
const MIN_USER_NAME_CHARACTERS = 2

const USER_ITEM_HEIGHT = 48
const USER_ITEM_GAP = 16

const isWeb = Platform.OS === 'web'

const ChatStartConversationView = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { top: safeAreaInsetTop } = useSafeAreaInsets()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const [searchUserInputValue, setSearchUserInputValue] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const initialInput = useRef(true)

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
  }, [setScreenOptions, t, colors.background20])

  // BE API
  const [fetchUserByName, { data: { userByName: { data: users = [] } = {} } = {}, loading }] =
    useLazyAbortableQuery<UserByNameResponse>(userByNameQuery)
  const getUsersByName = useCallback(
    async (userNameSubstr: string, offset = 0) => {
      await fetchUserByName({
        variables: {
          substring: userNameSubstr,
          offset,
          limit: FIND_USER_BY_NAME_LIMIT,
        },
      })
    },
    [fetchUserByName]
  )
  const getUsersByNameDebounced = useDebounce(getUsersByName, 300)

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

  const trailingComponent = useMemo(() => {
    const icon = loading ? Loader : Search
    return (
      <SpinningIconContainer spinning={loading}>
        <HoliIcon icon={icon} size={22} />
      </SpinningIconContainer>
    )
  }, [loading])

  return (
    <PermissionsGuard permissionType={PermissionsType.AUTH}>
      <KeyboardAvoidingViewWrapper
        renderProp={() => (
          <SafeArea style={styles.wrapper}>
            <View style={[styles.inner, { paddingTop: Platform.OS === 'android' ? safeAreaInsetTop : 0 }]}>
              <HoliTextInput
                value={searchUserInputValue}
                placeholder={t('chat.start.input.placeholder')}
                aria-label={t('chat.start.input.placeholder')}
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
                            aria-label={t('chat.start.userItem.checkbox.label', { user: user.fullName })}
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
                    offset: USER_ITEM_HEIGHT * index,
                    index,
                  })}
                  ItemSeparatorComponent={() => <View style={{ height: USER_ITEM_GAP }} />}
                  style={[mixins.container, styles.list]}
                  keyboardShouldPersistTaps="handled"
                  keyboardDismissMode="on-drag"
                />
              ) : (
                <View style={[mixins.container, styles.listDescription]}>
                  <HoliHeading level="3" align="center">
                    {t('chat.start.description')}
                  </HoliHeading>
                </View>
              )}

              <View style={[mixins.container, styles.overlayButtonWrapper]}>
                <StartChatButton user={selectedUser} label={t('chat.start.button.label')} doReplaceRoute={true} />
              </View>
            </View>
          </SafeArea>
        )}
      />
    </PermissionsGuard>
  )
}

export default ChatStartConversationView

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: theme.colors.background20,
      flex: 1,
      ...Platform.select({
        web: {
          minHeight: '100%',
        },
      }),
    },
    inner: {
      flex: 1,
      marginTop: 16,
    },
    list: {
      flex: 1,
      paddingTop: 24,
    },
    listDescription: {
      flex: 1,
      justifyContent: 'center',
    },
    userItem: {
      justifyContent: 'space-between',
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

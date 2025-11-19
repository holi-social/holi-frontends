import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Platform, Pressable, StyleSheet, View } from 'react-native'

import { useLazyAbortableQuery } from '@holi/api/useLazyAbortableQuery'
import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import { userByNameQuery, type UserByNameResponse } from '@holi/core/domain/shared/queries'
import type { User } from '@holi/core/domain/shared/types'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { StartChatButton } from '@holi/core/screens/userprofile/components/StartChatButton'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { SpinningIconContainer } from '@holi/icons/src/SpinningIconContainer'
import { Loader, Search } from '@holi/icons/src/generated'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliCheckbox from '@holi/ui/components/molecules/HoliCheckbox'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { useDebounce } from '@holi/ui/helper'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'
import { Avatar } from 'holi-bricks/components/avatar'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'
import { Spacing } from 'holi-bricks/foundations'
import { Text } from 'holi-bricks/components/text'
import { Button } from 'holi-bricks/components/button'

const FIND_USER_BY_NAME_LIMIT = 30
const MIN_USER_NAME_CHARACTERS = 2

const USER_ITEM_HEIGHT = 48
const USER_ITEM_GAP = 16

const ChatStartConversationView = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
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
      headerTitle: ({ children }) => (
        <Text headingLevel="1" size="lg">
          {children}
        </Text>
      ),
      headerStyle: {
        backgroundColor: colors.background20,
      },
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [setScreenOptions, t, colors.background20])

  // BE API
  const [
    fetchUserByName,
    {
      data: {
        userByName: { data: users = [] } = {},
      } = {},
      loading,
    },
  ] = useLazyAbortableQuery<UserByNameResponse>(userByNameQuery)
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
      <KeyboardAvoidingView behavior={'padding'} keyboardVerticalOffset={100} style={styles.content}>
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
                      <Avatar
                        source={user.avatar}
                        imgPlaceholder={user.avatarBlurhash}
                        label={user.avatarLabel}
                        initials={user.avatarLabel}
                        size="md"
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
          {selectedUser?.id ? (
            <StartChatButton
              chatPartnerIdentity={selectedUser.id}
              label={t('chat.start.button.label')}
              doReplaceRoute={true}
            />
          ) : (
            <Button disabled={true} label={t('chat.start.button.label')} testID="user-profile-open-chat" />
          )}
        </View>
      </KeyboardAvoidingView>
    </PermissionsGuard>
  )
}

export default ChatStartConversationView

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    content: {
      position: 'relative',
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
      position: Platform.OS === 'web' ? 'fixed' : 'relative',
      bottom: 0,
      paddingBottom: Spacing.sm,
      paddingTop: 1,
      backgroundColor: 'transparent',
    },
    flexRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  })

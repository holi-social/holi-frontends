import { useLazyQuery, useMutation } from '@apollo/client'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'
import { z } from 'zod'

import FormWrapper from '@holi/core/components/FormWrapper'
import { useErrorHandling } from '@holi/core/errors/hooks'
import SpaceInviteUserSearchResult from '@holi/core/screens/spaces/details/components/SpaceInviteUserSearchResult'
import { InviteToSpaceByEmailResponse, inviteToSpaceByEmailMutation } from '@holi/core/screens/spaces/details/mutations'
import { usersByNameWithSpaceConnectionQuery } from '@holi/core/screens/spaces/details/queries'
import { UserByNameResponse } from '@holi/core/screens/userprofile/queries'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { useLoader } from '@holi/ui/components/molecules/HoliLoader'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { useDebounce } from '@holi/ui/helper'
import { colors, vars } from '@holi/ui/styles/globalVars'

const USER_SEARCH_DEBOUNCE = 400

const isEmail = (input: string) => z.string().email().safeParse(input).success

type SpaveInviteViewProps = {
  spaceId: string
}

const SpaceInviteView: React.FC<SpaveInviteViewProps> = ({ spaceId }) => {
  const [searchValue, setSearchValue] = useState('')
  const { t } = useTranslation()
  const { openToast } = useToast()
  const { displayError } = useErrorHandling()
  const { isLoaderShown, showLoader, hideLoader } = useLoader()

  const clearInput = useCallback(() => setSearchValue(''), [])

  const [inviteToSpaceByEmail, { loading: loadingInvite }] = useMutation<InviteToSpaceByEmailResponse>(
    inviteToSpaceByEmailMutation,
    {
      onCompleted() {
        openToast(t('spaces.invite.success'), HoliToastType.SUCCESS)
        clearInput()
      },
      onError(error) {
        displayError(error, t('global.technicalError'))
      },
    }
  )

  const [findUsersByNameWithSpaceConnection, { data: userSearchResult }] = useLazyQuery<UserByNameResponse>(
    usersByNameWithSpaceConnectionQuery,
    {
      onError: (error) => {
        displayError(error, t('global.technicalError'))
        hideLoader()
      },
      onCompleted: () => {
        hideLoader()
      },
      fetchPolicy: 'cache-and-network',
    }
  )
  const debouncedUserSearch = useDebounce(findUsersByNameWithSpaceConnection, USER_SEARCH_DEBOUNCE)

  const searchValueIsEmail = isEmail(searchValue)

  const sendInvitationEmail = useCallback(
    () => inviteToSpaceByEmail({ variables: { email: searchValue, spaceId: spaceId } }),
    [inviteToSpaceByEmail, searchValue, spaceId]
  )
  const onSubmitEditing = useCallback(() => {
    if (searchValueIsEmail) {
      sendInvitationEmail()
    }
  }, [searchValueIsEmail, sendInvitationEmail])

  const onSearchInput = useCallback(
    (input: string) => {
      if (input && !isEmail(input)) {
        showLoader()
        // TODO(SF) pagination, const for limit
        debouncedUserSearch({
          variables: {
            substring: input,
            spaceId,
            offset: 0,
            limit: 10,
          },
        })
      }
      setSearchValue(input)
    },
    [debouncedUserSearch, showLoader, spaceId]
  )

  const users = userSearchResult?.userByName.data || []

  return (
    <FormWrapper
      onSave={sendInvitationEmail}
      loading={loadingInvite}
      saveButtonDisabled={!searchValue || !searchValueIsEmail || loadingInvite}
      style={styles.wrapper}
      testID="space-invite-form"
      buttonLabel={t('spaces.invite.btn.send')}
      scrollToInput={false}
      initialOffsetTop={0}
      showBottomBar
      renderProp={() => (
        <>
          <View style={styles.whom}>
            <HoliText size="large">{t('spaces.invite.hint.header')}</HoliText>
            <HoliText>{t('spaces.invite.hint.discussion')}</HoliText>
          </View>
          <View style={styles.email}>
            <HoliText size="large">{t('spaces.invite.search.title')}</HoliText>
            {/* This input field has no email validation, because it is also used for searching existing users by name */}
            <HoliTextInput
              placeholder={t('spaces.invite.search.input')}
              value={searchValue}
              onChange={onSearchInput}
              style={styles.input}
              accessibilityLabel={t('spaces.invite.search.input')}
              inputProps={{ onSubmitEditing }}
              testID="space-invite-user"
            />
            <HoliText size="extrasmall" style={styles.hint} skeletonOptions={{ numberOfLines: 2 }}>
              {t('spaces.invite.search.hint')}
            </HoliText>
          </View>
          {!!searchValue && !searchValueIsEmail && (
            <SpaceInviteUserSearchResult
              spaceId={spaceId}
              loading={isLoaderShown}
              users={users}
              onInviteHandled={clearInput}
            />
          )}
        </>
      )}
    />
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: Platform.OS === 'web' ? 40 : +vars.topBarHeight + 44,
    paddingTop: 12,
    backgroundColor: colors.background30,
  },
  whom: {
    display: 'flex',
    paddingVertical: 24,
    paddingBottom: 8,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 16,
    width: '100%',
  },
  email: {
    paddingVertical: 24,
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
  },
  input: {
    marginTop: 16,
  },
  hint: {
    marginTop: 6,
    color: colors.foreground20,
  },
})

export default SpaceInviteView

import { useMutation } from '@apollo/client'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'
import { z } from 'zod'

import FormWrapper from '@holi/core/components/FormWrapper'
import { useThrottledMobileScrollEvents } from '@holi/core/components/ScrollHeaderLayout/useMobileScrollHandler'
import { useErrorHandling } from '@holi/core/errors/hooks'
import SpaceInviteUserSearch from '@holi/core/screens/spaces/details/components/SpaceInviteUserSearch'
import { InviteToSpaceByEmailResponse, inviteToSpaceByEmailMutation } from '@holi/core/screens/spaces/details/mutations'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { colors, vars } from '@holi/ui/styles/globalVars'

const isEmail = (input: string) => z.string().email().safeParse(input).success

type SpaceInviteViewProps = {
  spaceId: string
}

const SpaceInviteView: React.FC<SpaceInviteViewProps> = ({ spaceId }) => {
  const [searchValue, setSearchValue] = useState('')
  const { t } = useTranslation()
  const { openToast } = useToast()
  const { displayError } = useErrorHandling()

  const clearInput = useCallback(() => setSearchValue(''), [])

  const [inviteToSpaceByEmail] = useMutation<InviteToSpaceByEmailResponse>(inviteToSpaceByEmailMutation, {
    onCompleted() {
      openToast(t('spaces.invite.success'), HoliToastType.SUCCESS)
      clearInput()
    },
    onError(error) {
      displayError(error, 'Failed to invite user to space by e-mail', {
        location: 'SpaceInviteView.inviteToSpaceByEmail',
        spaceId,
      })
    },
  })

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

  const throttledScrollEventProps = useThrottledMobileScrollEvents()

  return (
    <FormWrapper
      onSave={sendInvitationEmail}
      saveButtonDisabled={!searchValue || !searchValueIsEmail}
      style={styles.wrapper}
      testID="space-invite-form"
      buttonLabel={t('spaces.invite.btn.send')}
      scrollToInput={false}
      initialOffsetTop={0}
      keyboardShouldPersistTaps="handled"
      {...throttledScrollEventProps}
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
              onChange={setSearchValue}
              style={styles.input}
              aria-label={t('spaces.invite.search.input')}
              inputProps={{ onSubmitEditing }}
              testID="space-invite-user"
            />
            <HoliText size="extrasmall" style={styles.hint} skeletonOptions={{ numberOfLines: 2 }}>
              {t('spaces.invite.search.hint')}
            </HoliText>
          </View>
          {!!searchValue && !searchValueIsEmail && (
            <SpaceInviteUserSearch spaceId={spaceId} searchValue={searchValue} onInviteHandled={clearInput} />
          )}
        </>
      )}
    />
  )
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 12,
    backgroundColor: colors.background30,
  },
  whom: {
    display: 'flex',
    ...Platform.select({
      native: {
        paddingTop: +vars.topBarHeight + 52,
      },
      web: {
        paddingTop: +vars.topBarHeight + 24,
      },
    }),
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

import { useMutation } from '@apollo/client'
import type React from 'react'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { z } from 'zod'

import FormWrapper from '@holi/core/components/FormWrapper'
import { useThrottledMobileScrollEvents } from '@holi/core/components/ScrollHeaderLayout/useMobileScrollHandler'
import { useErrorHandling } from '@holi/core/errors/hooks'
import SpaceInviteUserSearch from '@holi/core/screens/spaces/details/components/SpaceInviteUserSearch'
import SpaceInviteUserConnectionsList from '@holi/core/screens/spaces/details/components/UserConnectionsList'
import {
  type InviteToSpaceByEmailResponse,
  inviteToSpaceByEmailMutation,
} from '@holi/core/screens/spaces/details/mutations'
import { spaceInvitesQuery } from '@holi/core/screens/spaces/details/queries'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { TrackingEvent } from '@holi/core/tracking'

const isEmail = (input: string) => z.string().email().safeParse(input).success

type SpaceInviteViewProps = {
  spaceId: string
  idOrName: string
}

const SpaceInviteView: React.FC<SpaceInviteViewProps> = ({ spaceId, idOrName }) => {
  const [searchValue, setSearchValue] = useState('')
  const { t } = useTranslation()
  const { openToast } = useToast()
  const { displayError } = useErrorHandling()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { track } = useTracking()

  const clearInput = useCallback(() => setSearchValue(''), [])

  const [inviteToSpaceByEmail] = useMutation<InviteToSpaceByEmailResponse>(inviteToSpaceByEmailMutation, {
    onCompleted() {
      openToast(t('spaces.invite.success'), HoliToastType.SUCCESS)
      clearInput()
      track(TrackingEvent.Spaces.Invitation.sent(spaceId))
    },
    onError(error) {
      displayError(error, 'Failed to invite user to space by e-mail', {
        location: 'SpaceInviteView.inviteToSpaceByEmail',
        spaceId,
      })
    },
    refetchQueries: [{ query: spaceInvitesQuery, variables: { idOrName } }],
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
          {!searchValue && <SpaceInviteUserConnectionsList spaceId={spaceId} onInviteHandled={clearInput} />}
        </>
      )}
    />
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      paddingTop: 12,
      backgroundColor: theme.colors.background30,
    },
    whom: {
      display: 'flex',
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
      color: theme.colors.foreground20,
    },
  })

export default SpaceInviteView

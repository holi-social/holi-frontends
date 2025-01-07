import { useMutation } from '@apollo/client'
import type React from 'react'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import SpacePermissions from '@holi/core/screens/spaces/details/components/SpacePermissions'
import {
  type UpdateSpaceUserConnectionResponse,
  updateSpaceUserConnectionMutation,
} from '@holi/core/screens/spaces/details/mutations'
import { spaceMembersQuery } from '@holi/core/screens/spaces/details/queries'
import { type Space, SpaceConnectionAction, type SpaceInvite } from '@holi/core/screens/spaces/types'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { Close } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Avatar } from 'holi-bricks/components/avatar'
import { ButtonIcon } from 'holi-bricks/components/button'

const PAGE_SIZE = 10

type SpaceInviteProps = {
  space: Space
  invite: SpaceInvite
  style?: StyleProp<ViewStyle>
}

const SpaceInviteItem: React.FC<SpaceInviteProps> = ({ space, invite }) => {
  const { t } = useTranslation()
  const { openToast } = useToast()
  const [withdrawn, setWithdrawn] = useState(false)
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const { navigate } = useRouting()
  const { displayError } = useErrorHandling()
  const { visible: permissionsVisible, show: showPermissions, hide: hidePermissions } = useModalState()
  const handleNavigation = useCallback(
    (id: string) => {
      hidePermissions()
      setTimeout(() => {
        navigate('/profile/' + id)
      })
    },
    [navigate, hidePermissions]
  )

  const invitedName = useMemo(() => invite.invitedUser.fullName || t('user.profileView.anonymous'), [invite, t])

  const [updateSpaceUserConnection, { loading }] = useMutation<UpdateSpaceUserConnectionResponse>(
    updateSpaceUserConnectionMutation,
    {
      variables: {
        spaceId: space.id,
        userId: invite.invitedUser.id,
      },
      onCompleted() {
        openToast(t('spaces.invite.user.witdrawn', { user: invitedName }), HoliToastType.SUCCESS)
      },
      onError(error) {
        setWithdrawn(false)

        const context = {
          location: 'SpaceInviteItem',
          spaceId: space.id,
        }

        if (
          error.graphQLErrors.length > 0 &&
          error.graphQLErrors[0].extensions?.errors?.includes('No invite to withdraw.')
        ) {
          displayError(error, 'Failed to remove space invite - No invite to withdraw.', {
            displayMessage: t('spaces.invite.update.not-invited'),
            ...context,
          })
        } else {
          displayError(error, 'Failed to remove space invite', {
            displayMessage: t('spaces.invite.update.error'),
            ...context,
          })
        }
      },
      refetchQueries: [{ query: spaceMembersQuery, variables: { idOrName: space.name, pageSize: PAGE_SIZE } }],
    }
  )

  const withdrawInvite = useCallback(() => {
    setWithdrawn(true)
    updateSpaceUserConnection({
      variables: {
        connectAction: SpaceConnectionAction.DISCONNECT,
        connectionType: SpaceConnectionType.MEMBERSHIP_INVITEE,
      },
    })
  }, [updateSpaceUserConnection, setWithdrawn])

  const handleWithdrawInvite = useCallback(() => {
    withdrawInvite()
    hidePermissions()
  }, [hidePermissions, withdrawInvite])

  return (
    <View key={invite.invitedUser.id} testID={'space-invite-item'} style={styles.wrapper}>
      <HoliButton
        transparent
        inline
        label={invitedName}
        style={styles.userButton}
        contentStyle={styles.userButtonContent}
        onPress={showPermissions}
      >
        <Avatar
          imgSrc={invite.invitedUser.avatar}
          imgPlaceholder={invite.invitedUser.avatarBlurhash}
          label={invitedName}
          initials={invite.invitedUser.avatarLabel}
          size="sm"
        />
        <View style={styles.name}>
          <HoliText ellipsizeMode="tail" numberOfLines={1}>
            {invitedName}
          </HoliText>
        </View>
      </HoliButton>
      {!loading && withdrawn && (
        <HoliText style={styles.muted}>{t('spaces.collaborators.pending.invites.withdrawn')}</HoliText>
      )}
      {(loading || !withdrawn) && (
        <ButtonIcon
          key="decline"
          variant="secondary"
          label={t('notifications.connection.ignore')}
          onPress={withdrawInvite}
          disabled={loading}
          testID="withdraw-invite-button"
          icon={Close}
        />
      )}
      <SpacePermissions
        space={space}
        user={invite.invitedUser}
        handleNavigation={handleNavigation}
        handleWithdrawInvite={withdrawn ? undefined : handleWithdrawInvite}
        hidePermissions={hidePermissions}
        permissionsVisible={permissionsVisible}
        isMember={false}
        isAdministrator={false}
        displayMemberActions={false}
      />
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
    },
    userButton: {
      flex: 1,
    },
    userButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    name: {
      marginLeft: 16,
      flex: 1,
    },
    muted: {
      color: theme.colors.foreground20,
      paddingLeft: 8,
    },
  })

export default SpaceInviteItem

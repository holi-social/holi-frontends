import { useMutation } from '@apollo/client'
import type React from 'react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'

import type { User } from '@holi/core/domain/shared/types'
import { useErrorHandling } from '@holi/core/errors/hooks'
import useAuthRequiredNavigation from '@holi/core/navigation/hooks/useAuthRequiredNavigation'
import { ContentType, ContentType3K } from '@holi/core/queries'
import {
  type UpdateSpaceUserConnectionResponse,
  updateSpaceUserConnectionMutation,
} from '@holi/core/screens/spaces/details/mutations'
import { spaceMembersQuery } from '@holi/core/screens/spaces/details/queries'
import { type Space, SpaceConnectionAction, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Check, Close, Flag, ShieldMinus, ShieldPlus, User as UserIcon, UserUnfollow } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'
import { Avatar } from 'holi-bricks/components/avatar'
import { Spacing } from 'holi-bricks/foundations'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { TrackingEvent } from '@holi/core/tracking'

type SpacePermissionsProps = {
  space: Space
  user: User
  handleNavigation: (id: string) => void
  permissionsVisible: boolean
  hidePermissions: () => void
  handleJoinRequest?: (accept: boolean) => void
  handleWithdrawInvite?: () => void
  isAdministrator?: boolean
  isMember?: boolean
  extraDescription?: string
  displayMemberActions?: boolean // set to false if no "Set as Admin" or "Remove from space" actions should be present
}

const SpacePermissions: React.FC<SpacePermissionsProps> = ({
  space,
  user,
  handleNavigation,
  permissionsVisible,
  hidePermissions,
  handleJoinRequest,
  handleWithdrawInvite,
  isAdministrator,
  isMember,
  extraDescription,
  displayMemberActions = true,
}) => {
  const { t } = useTranslation()
  const { track } = useTracking()
  const mixins = useStyleMixins()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { navigateWithAuth } = useAuthRequiredNavigation()

  const { displayError } = useErrorHandling()
  const [showGrantAdminConfirmationModal, setShowGrantAdminConfirmationModal] = useState(false)
  const [showRevokeAdminConfirmationModal, setshowRevokeAdminConfirmationModal] = useState(false)
  const [showRemoveMemberConfirmationModal, setShowRemoveMemberConfirmationModal] = useState(false)
  const [showReportMemberConfirmationModal, setShowReportMemberConfirmationModal] = useState(false)
  const { openToast } = useToast()

  const spaceId = space.id
  const userId = user.id

  const [updateSpaceUserConnection, { loading }] = useMutation<UpdateSpaceUserConnectionResponse>(
    updateSpaceUserConnectionMutation,
    {
      variables: {
        spaceId,
        userId,
      },
      onError(error) {
        displayError(error, 'Failed to update space user connection', {
          location: 'SpacePermissions.updateSpaceUserConnection',
          spaceId,
        })
      },
      onCompleted() {
        hidePermissions()
        if (showRemoveMemberConfirmationModal) {
          openToast(
            t('spaces.collaborators.permissions.remove.user.success', {
              user: user.fullName || t('user.profileView.anonymous'),
            }),
            HoliToastType.SUCCESS
          )
        } else if (showRevokeAdminConfirmationModal) {
          openToast(
            t('spaces.collaborators.permissions.revokeAdmin.success', {
              user: user.fullName || t('user.profileView.anonymous'),
            }),
            HoliToastType.SUCCESS
          )
        } else {
          openToast(
            t('spaces.collaborators.permissions.grantAdmin.success', {
              user: user.fullName || t('user.profileView.anonymous'),
            }),
            HoliToastType.SUCCESS
          )
        }
      },
      refetchQueries: [{ query: spaceMembersQuery, variables: { idOrName: space.name } }],
    }
  )

  const grantAdminRights = () => {
    updateSpaceUserConnection({
      variables: {
        connectAction: SpaceConnectionAction.GRANT_ADMIN_ACCESS,
        connectionType: SpaceConnectionType.ADMINISTRATOR,
      },
      onCompleted: () => track(TrackingEvent.Spaces.User.gotAdminRights(spaceId)),
    }).then(() => setShowGrantAdminConfirmationModal(false))
  }

  const revokeAdminRights = () => {
    updateSpaceUserConnection({
      variables: {
        connectAction: SpaceConnectionAction.REVOKE_ADMIN_ACCESS,
        connectionType: SpaceConnectionType.ADMINISTRATOR,
      },
      onCompleted: () => track(TrackingEvent.Spaces.User.lostAdminRights(spaceId)),
    }).then(() => setshowRevokeAdminConfirmationModal(false))
  }

  const removeMember = () => {
    updateSpaceUserConnection({
      variables: {
        connectAction: SpaceConnectionAction.REMOVE_MEMBER,
        connectionType: SpaceConnectionType.ADMINISTRATOR,
      },
      onCompleted: () => track(TrackingEvent.Spaces.User.wasRemoved(spaceId)),
    }).then(() => setShowRemoveMemberConfirmationModal(false))
  }

  return (
    <>
      <HoliModal
        label={t('spaces.collaborators.permissions.label')}
        shown={permissionsVisible}
        onDismiss={hidePermissions}
        style={styles.wrapper}
        testID="space-collaborators-permissions-modal"
      >
        <ScrollView>
          <View style={[styles.modalContent, mixins.container]}>
            <View style={styles.infoContainer}>
              <Avatar
                source={user.avatar}
                imgPlaceholder={user.avatarBlurhash}
                label={user.fullName || t('user.profileView.anonymous')}
                initials={user.avatarLabel}
              />
              <View>
                <HoliText>{user.fullName || t('user.profileView.anonymous')}</HoliText>
                <HoliText size="small" style={styles.details}>
                  {user.pronouns || ''}
                  {user.pronouns && (isAdministrator || isMember) && <> &#183; </>}
                  {isAdministrator && t('spaces.collaborators.permissions.role.admin')}
                  {!isAdministrator && isMember && t('spaces.collaborators.permissions.role.member')}
                </HoliText>
              </View>
            </View>

            {isMember && !!user.aboutMe && <HoliText style={styles.description}>{user.aboutMe}</HoliText>}
            {!isMember && !!extraDescription && <HoliText style={styles.description}>{extraDescription}</HoliText>}

            <View style={styles.actions}>
              {!isMember && !!handleJoinRequest && (
                <HoliButton
                  contentStyle={styles.actionsItem}
                  inline
                  transparent
                  disabled={loading}
                  label={t('spaces.collaborators.pending.requests.accept.detailed')}
                  onPress={() => handleJoinRequest(true)}
                >
                  <HoliIcon icon={Check} colorOverride={styles.acceptRequestIcon.color} />
                  <HoliText style={styles.actionsItemText}>
                    {t('spaces.collaborators.pending.requests.accept.detailed')}{' '}
                  </HoliText>
                </HoliButton>
              )}

              {!isMember && !!handleJoinRequest && (
                <HoliButton
                  contentStyle={styles.actionsItem}
                  inline
                  transparent
                  disabled={loading}
                  label={t('spaces.collaborators.pending.requests.decline.detailed')}
                  onPress={() => handleJoinRequest(false)}
                >
                  <HoliIcon icon={Close} colorOverride={styles.declineIcon.color} />
                  <HoliText style={styles.actionsItemText}>
                    {t('spaces.collaborators.pending.requests.decline.detailed')}{' '}
                  </HoliText>
                </HoliButton>
              )}

              {!isMember && !!handleWithdrawInvite && (
                <HoliButton
                  contentStyle={styles.actionsItem}
                  inline
                  transparent
                  disabled={loading}
                  label={t('spaces.collaborators.pending.invites.withdraw')}
                  onPress={() => handleWithdrawInvite()}
                >
                  <HoliIcon icon={Close} colorOverride={styles.declineIcon.color} />
                  <HoliText style={styles.actionsItemText}>
                    {t('spaces.collaborators.pending.invites.withdraw')}{' '}
                  </HoliText>
                </HoliButton>
              )}

              {displayMemberActions && isAdministrator && (
                <HoliButton
                  contentStyle={styles.actionsItem}
                  inline
                  transparent
                  disabled={loading}
                  label={t('spaces.collaborators.permissions.revokeAdmin.label')}
                  onPress={() => setshowRevokeAdminConfirmationModal(true)}
                  testID={'spaces-collaborators-revoke-admin-btn'}
                >
                  <HoliIcon icon={ShieldMinus} colorOverride={styles.actionsItemIcon.color} />
                  <HoliText style={styles.actionsItemText}>
                    {t('spaces.collaborators.permissions.revokeAdmin.label')}{' '}
                  </HoliText>
                </HoliButton>
              )}

              {displayMemberActions && !isAdministrator && isMember && (
                <HoliButton
                  contentStyle={styles.actionsItem}
                  inline
                  transparent
                  disabled={loading}
                  label={t('spaces.collaborators.permissions.grantAdmin.label')}
                  onPress={() => setShowGrantAdminConfirmationModal(true)}
                  testID={'spaces-collaborators-grant-admin-btn'}
                >
                  <HoliIcon icon={ShieldPlus} colorOverride={styles.actionsItemIcon.color} />
                  <HoliText style={styles.actionsItemText}>
                    {t('spaces.collaborators.permissions.grantAdmin.label')}
                  </HoliText>
                </HoliButton>
              )}

              <HoliButton
                contentStyle={styles.actionsItem}
                inline
                transparent
                disabled={loading}
                label={t('spaces.collaborators.permissions.viewProfile')}
                onPress={() => handleNavigation(userId)}
                testID={'spaces-collaborators-view-profile-btn'}
              >
                <HoliIcon icon={UserIcon} colorOverride={styles.actionsItemIcon.color} />
                <HoliText style={styles.actionsItemText}>{t('spaces.collaborators.permissions.viewProfile')}</HoliText>
              </HoliButton>

              {displayMemberActions && isMember && (
                <HoliButton
                  contentStyle={styles.actionsItem}
                  inline
                  transparent
                  disabled={loading}
                  label={t('spaces.collaborators.permissions.remove.user.label')}
                  onPress={() => setShowRemoveMemberConfirmationModal(true)}
                  testID={'spaces-collaborators-remove-user-btn'}
                >
                  <HoliIcon icon={UserUnfollow} colorOverride={styles.actionsItemIcon.color} />
                  <HoliText style={styles.actionsItemText}>
                    {t('spaces.collaborators.permissions.remove.user.label')}
                  </HoliText>
                </HoliButton>
              )}

              <HoliButton
                contentStyle={styles.actionsItem}
                inline
                transparent
                label={t('global.report')}
                onPress={() => setShowReportMemberConfirmationModal(true)}
                testID="report-user-button"
              >
                <HoliIcon icon={Flag} colorOverride={styles.actionsItemIcon.color} />
                <HoliText style={styles.actionsItemText}>{t('global.report')}</HoliText>
              </HoliButton>
            </View>

            <HoliConfirmation
              show={showGrantAdminConfirmationModal}
              label={t('spaces.collaborators.permissions.grantAdmin.label')}
              title={t('spaces.collaborators.permissions.grantAdmin.label')}
              description={t('spaces.collaborators.permissions.grantAdmin.confirm', {
                user: user.fullName || t('user.profileView.anonymous'),
              })}
              onDismiss={() => setShowGrantAdminConfirmationModal(false)}
              secondaryText={t('spaces.collaborators.permissions.confirm.no')}
              primaryText={t('spaces.collaborators.permissions.confirm.yes')}
              testID="spaces-collaborators-grant-admin-confirmation"
              onPrimary={grantAdminRights}
            />

            <HoliConfirmation
              show={showRevokeAdminConfirmationModal}
              label={t('spaces.collaborators.permissions.revokeAdmin.label')}
              title={t('spaces.collaborators.permissions.revokeAdmin.label')}
              description={t('spaces.collaborators.permissions.revokeAdmin.confirm', {
                user: user.fullName || t('user.profileView.anonymous'),
              })}
              onDismiss={() => setshowRevokeAdminConfirmationModal(false)}
              secondaryText={t('spaces.collaborators.permissions.confirm.no')}
              primaryText={t('spaces.collaborators.permissions.confirm.yes')}
              testID="spaces-collaborators-revoke-admin-confirmation"
              onPrimary={revokeAdminRights}
            />

            <HoliConfirmation
              show={showRemoveMemberConfirmationModal}
              label={t('spaces.collaborators.permissions.remove.user.label')}
              title={t('spaces.collaborators.permissions.remove.user.label')}
              description={t('spaces.collaborators.permissions.remove.user.confirm', {
                user: user.fullName || t('user.profileView.anonymous'),
              })}
              onDismiss={() => setShowRemoveMemberConfirmationModal(false)}
              secondaryText={t('spaces.collaborators.permissions.confirm.no')}
              primaryText={t('spaces.collaborators.permissions.confirm.yes')}
              testID="spaces-collaborators-remove-user-confirmation"
              onPrimary={removeMember}
            />

            <HoliConfirmation
              show={showReportMemberConfirmationModal}
              label={t('user.profileView.report.confirmation.title', { name: user.fullName })}
              title={t('user.profileView.report.confirmation.title', { name: user.fullName })}
              description={t('user.profileView.report.confirmation.description', {
                name: user.fullName || t('user.profileView.anonymous'),
              })}
              onDismiss={() => setShowReportMemberConfirmationModal(false)}
              testID="spaces-collaborators-report-user-confirmation"
              onPrimary={() => navigateWithAuth(`/report/${userId}/${ContentType.USER}/${ContentType3K.USER}`)}
            />
          </View>
        </ScrollView>
      </HoliModal>
    </>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      padding: 24,
    },
    infoContainer: {
      flexDirection: 'column',
      gap: Spacing.xs,
    },
    modalContent: {
      paddingHorizontal: 10,
    },
    details: {
      marginTop: 6,
      color: theme.colors.foreground20,
    },
    description: {
      marginTop: 12,
    },
    actions: {
      marginTop: 8,
      paddingTop: 24,
      borderTopColor: theme.colors.background30,
      borderTopWidth: 1,
    },
    actionsItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
    },
    actionsItemText: {
      color: theme.colors.foreground30,
      paddingLeft: 10,
    },
    actionsItemIcon: {
      color: theme.colors.foreground30,
    },
    acceptRequestIcon: {
      color: theme.colors.brandColorC30,
    },
    declineIcon: {
      color: theme.colors.error30,
    },
  })

export default SpacePermissions

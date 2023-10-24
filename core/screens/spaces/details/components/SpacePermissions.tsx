import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import useReportContent from '@holi/core/hooks/useReportContent'
import { ContentType } from '@holi/core/queries'
import {
  UpdateSpaceUserConnectionResponse,
  updateSpaceUserConnectionMutation,
} from '@holi/core/screens/spaces/details/mutations'
import { spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { Space, SpaceConnectionAction, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { User } from '@holi/core/screens/userprofile/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Check, Close, Flag, ShieldMinus, ShieldPlus, User as UserIcon, UserUnfollow } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import HoliReadMore from '@holi/ui/components/molecules/HoliReadMore'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type SpacePermissionsProps = {
  space: Space
  user: User
  handleNavigation: (id: string) => void
  permissionsVisible: boolean
  hidePermissions: () => void
  handleJoinRequest?: (accept: boolean) => void
  isAdministrator?: boolean
  isMember?: boolean
  extraDescription?: string
}

const SpacePermissions: React.VFC<SpacePermissionsProps> = ({
  space,
  user,
  handleNavigation,
  permissionsVisible,
  hidePermissions,
  handleJoinRequest,
  isAdministrator,
  isMember,
  extraDescription,
}) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { displayError } = useErrorHandling()
  const [showGrantAdminConfirmationModal, setShowGrantAdminConfirmationModal] = useState(false)
  const [showRevokeAdminConfirmationModal, setshowRevokeAdminConfirmationModal] = useState(false)
  const [showRemoveMemberConfirmationModal, setShowRemoveMemberConfirmationModal] = useState(false)
  const [showReportMemberConfirmationModal, setShowReportMemberConfirmationModal] = useState(false)
  const { openToast } = useToast()

  const [isLoadingReport, reportContent] = useReportContent({
    id: user.id,
    contentType: ContentType.USER,
    successMsg: t('global.report.successMessage'),
  })

  const [updateSpaceUserConnection, { loading }] = useMutation<UpdateSpaceUserConnectionResponse>(
    updateSpaceUserConnectionMutation,
    {
      variables: {
        spaceId: space.id,
        userId: user.id,
      },
      onError(error) {
        displayError(error, 'Failed to update space user connection', {
          location: 'SpacePermissions.updateSpaceUserConnection',
          spaceId: space.id,
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
      refetchQueries: [{ query: spaceByIdQuery, variables: { idOrName: space.name } }],
    }
  )

  const grantAdminRights = () => {
    updateSpaceUserConnection({
      variables: {
        connectAction: SpaceConnectionAction.GRANT_ADMIN_ACCESS,
        connectionType: SpaceConnectionType.ADMINISTRATOR,
      },
    }).then(() => setShowGrantAdminConfirmationModal(false))
  }

  const revokeAdminRights = () => {
    updateSpaceUserConnection({
      variables: {
        connectAction: SpaceConnectionAction.REVOKE_ADMIN_ACCESS,
        connectionType: SpaceConnectionType.ADMINISTRATOR,
      },
    }).then(() => setshowRevokeAdminConfirmationModal(false))
  }

  const removeMember = () => {
    updateSpaceUserConnection({
      variables: {
        connectAction: SpaceConnectionAction.REMOVE_MEMBER,
        connectionType: SpaceConnectionType.ADMINISTRATOR,
      },
    }).then(() => setShowRemoveMemberConfirmationModal(false))
  }

  const reportMember = () => {
    reportContent().then(() => {
      hidePermissions()
      setShowReportMemberConfirmationModal(false)
    })
  }

  return (
    <>
      <HoliModal
        label={t('spaces.collaborators.permissions.label')}
        show={permissionsVisible}
        onDismiss={hidePermissions}
        style={styles.wrapper}
        testID="space-collaborators-permissions-modal"
      >
        <ScrollView style={[styles.modalContent, mixins.container]}>
          <HoliAvatar
            imageSrc={user.avatar}
            imageBlurhash={user.avatarBlurhash}
            label={user.fullName || t('user.profileView.anonymous')}
            initials={user.avatarLabel}
            defaultColor={user.avatarDefaultColor}
            style={[styles.avatar, styles.avatar]}
          />
          <HoliText>{user.fullName || t('user.profileView.anonymous')}</HoliText>
          <HoliText size="small" style={styles.details}>
            {user.pronouns || ''}
            {user.pronouns && (isAdministrator || isMember) && <> &#183; </>}
            {isAdministrator && t('spaces.collaborators.permissions.role.admin')}
            {!isAdministrator && isMember && t('spaces.collaborators.permissions.role.member')}
          </HoliText>

          {isMember && !!user.aboutMe && (
            <HoliReadMore numberOfLines={5} style={styles.description}>
              {user.aboutMe}
            </HoliReadMore>
          )}
          {!isMember && !!extraDescription && (
            <HoliReadMore numberOfLines={4} style={styles.description}>
              {extraDescription}
            </HoliReadMore>
          )}

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
                <HoliIcon icon={Check} color={styles.acceptRequestIcon.color} />
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
                <HoliIcon icon={Close} color={styles.declineRequestIcon.color} />
                <HoliText style={styles.actionsItemText}>
                  {t('spaces.collaborators.pending.requests.decline.detailed')}{' '}
                </HoliText>
              </HoliButton>
            )}

            {isAdministrator && (
              <HoliButton
                contentStyle={styles.actionsItem}
                inline
                transparent
                disabled={loading}
                label={t('spaces.collaborators.permissions.revokeAdmin.label')}
                onPress={() => setshowRevokeAdminConfirmationModal(true)}
                testID={'spaces-collaborators-revoke-admin-btn'}
              >
                <HoliIcon icon={ShieldMinus} color={styles.actionsItemIcon.color} />
                <HoliText style={styles.actionsItemText}>
                  {t('spaces.collaborators.permissions.revokeAdmin.label')}{' '}
                </HoliText>
              </HoliButton>
            )}

            {!isAdministrator && isMember && (
              <HoliButton
                contentStyle={styles.actionsItem}
                inline
                transparent
                disabled={loading}
                label={t('spaces.collaborators.permissions.grantAdmin.label')}
                onPress={() => setShowGrantAdminConfirmationModal(true)}
                testID={'spaces-collaborators-grant-admin-btn'}
              >
                <HoliIcon icon={ShieldPlus} color={styles.actionsItemIcon.color} />
                <HoliText style={styles.actionsItemText}>
                  {t('spaces.collaborators.permissions.grantAdmin.label')}
                </HoliText>
              </HoliButton>
            )}

            {isMember && (
              <HoliButton
                contentStyle={styles.actionsItem}
                inline
                transparent
                disabled={loading}
                label={t('spaces.collaborators.permissions.remove.user.label')}
                onPress={() => setShowRemoveMemberConfirmationModal(true)}
                testID={'spaces-collaborators-remove-user-btn'}
              >
                <HoliIcon icon={UserUnfollow} color={styles.actionsItemIcon.color} />
                <HoliText style={styles.actionsItemText}>
                  {t('spaces.collaborators.permissions.remove.user.label')}
                </HoliText>
              </HoliButton>
            )}

            <HoliButton
              contentStyle={styles.actionsItem}
              inline
              transparent
              disabled={loading}
              label={t('spaces.collaborators.permissions.viewProfile')}
              onPress={() => handleNavigation(user.id)}
              testID={'spaces-collaborators-view-profile-btn'}
            >
              <HoliIcon icon={UserIcon} color={styles.actionsItemIcon.color} />
              <HoliText style={styles.actionsItemText}>{t('spaces.collaborators.permissions.viewProfile')}</HoliText>
            </HoliButton>

            <HoliButton
              contentStyle={styles.actionsItem}
              inline
              transparent
              disabled={isLoadingReport}
              label={t('global.report')}
              onPress={() => setShowReportMemberConfirmationModal(true)}
              testID="report-user-button"
            >
              <HoliIcon icon={Flag} color={styles.actionsItemIcon.color} />
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
            dismissText={t('spaces.collaborators.permissions.confirm.no')}
            confirmText={t('spaces.collaborators.permissions.confirm.yes')}
            testID="spaces-collaborators-grant-admin-confirmation"
            onConfirm={grantAdminRights}
          />

          <HoliConfirmation
            show={showRevokeAdminConfirmationModal}
            label={t('spaces.collaborators.permissions.revokeAdmin.label')}
            title={t('spaces.collaborators.permissions.revokeAdmin.label')}
            description={t('spaces.collaborators.permissions.revokeAdmin.confirm', {
              user: user.fullName || t('user.profileView.anonymous'),
            })}
            onDismiss={() => setshowRevokeAdminConfirmationModal(false)}
            dismissText={t('spaces.collaborators.permissions.confirm.no')}
            confirmText={t('spaces.collaborators.permissions.confirm.yes')}
            testID="spaces-collaborators-revoke-admin-confirmation"
            onConfirm={revokeAdminRights}
          />

          <HoliConfirmation
            show={showRemoveMemberConfirmationModal}
            label={t('spaces.collaborators.permissions.remove.user.label')}
            title={t('spaces.collaborators.permissions.remove.user.label')}
            description={t('spaces.collaborators.permissions.remove.user.confirm', {
              user: user.fullName || t('user.profileView.anonymous'),
            })}
            onDismiss={() => setShowRemoveMemberConfirmationModal(false)}
            dismissText={t('spaces.collaborators.permissions.confirm.no')}
            confirmText={t('spaces.collaborators.permissions.confirm.yes')}
            testID="spaces-collaborators-remove-user-confirmation"
            onConfirm={removeMember}
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
            onConfirm={reportMember}
          />
        </ScrollView>
      </HoliModal>
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 24,
  },
  modalContent: {
    paddingHorizontal: 10,
  },
  avatar: {
    marginBottom: 16,
  },
  details: {
    marginTop: 6,
    color: colors.foreground20,
  },
  description: {
    marginTop: 12,
  },
  actions: {
    marginTop: 8,
    paddingTop: 24,
    borderTopColor: colors.background30,
    borderTopWidth: 1,
  },
  actionsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  actionsItemText: {
    color: colors.foreground30,
    paddingLeft: 10,
  },
  actionsItemIcon: {
    color: colors.foreground30,
  },
  acceptRequestIcon: {
    color: colors.brandColorC30,
  },
  declineRequestIcon: {
    color: colors.error30,
  },
})

export default SpacePermissions

import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import useReportContent from '@holi/core/hooks/useReportContent'
import { ContentType } from '@holi/core/queries'
import { UpdateSpaceUserConnectionResponse } from '@holi/core/screens/spaces/details/mutations'
import { updateSpaceUserConnectionMutation } from '@holi/core/screens/spaces/details/mutations'
import { spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { SpaceConnectionAction, SpaceConnectionType, SpaceMember } from '@holi/core/screens/spaces/types'
import { Space } from '@holi/core/screens/spaces/types'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type SpacePermissionsProps = {
  space: Space
  member: SpaceMember
  handleNavigation: (id: string) => void
  permissionsVisible: boolean
  hidePermissions: () => void
}

const SpacePermissions: React.VFC<SpacePermissionsProps> = ({
  space,
  member,
  handleNavigation,
  permissionsVisible,
  hidePermissions,
}) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { displayError } = useErrorHandling()
  const [showGrantAdminConfirmationModal, setShowGrantAdminConfirmationModal] = useState(false)
  const [showRevokeAdminConfirmationModal, setshowRevokeAdminConfirmationModal] = useState(false)
  const [showRemoveMemberConfirmationModal, setShowRemoveMemberConfirmationModal] = useState(false)
  const [showReportMemberConfirmationModal, setShowReportMemberConfirmationModal] = useState(false)
  const { openToast } = useToast()

  const { user } = member
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
        displayError(error)
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
        <View style={[styles.modalContent, mixins.container]}>
          <HoliAvatar
            imageSrc={user.avatar}
            imageBlurhash={user.avatarBlurhash}
            label={user.fullName || t('user.profileView.anonymous')}
            initials={user.avatarLabel}
            defaultColor={user.avatarDefaultColor}
            style={[styles.avatar, styles.avatar]}
          />
          <HoliText style={{ marginBottom: 4 }}>{user.fullName || t('user.profileView.anonymous')}</HoliText>
          <HoliText size="small" style={{ color: colors.foreground20 }}>
            {user.pronouns || ''}
            {user.pronouns && <> &#183; </>}
            {member.isAdministrator
              ? t('spaces.collaborators.permissions.role.admin')
              : t('spaces.collaborators.permissions.role.member')}
          </HoliText>

          <View style={styles.actions}>
            {member.isAdministrator ? (
              <HoliButton
                contentStyle={styles.actionsItem}
                inline
                transparent
                disabled={loading}
                label={t('spaces.collaborators.permissions.revokeAdmin.label')}
                onPress={() => setshowRevokeAdminConfirmationModal(true)}
                testID={'spaces-collaborators-revoke-admin-btn'}
              >
                <HoliIcon icon="shield-minus" style={styles.actionsItemIcon} />
                <HoliText style={styles.actionsItemText}>
                  {t('spaces.collaborators.permissions.revokeAdmin.label')}{' '}
                </HoliText>
              </HoliButton>
            ) : (
              <HoliButton
                contentStyle={styles.actionsItem}
                inline
                transparent
                disabled={loading}
                label={t('spaces.collaborators.permissions.grantAdmin.label')}
                onPress={() => setShowGrantAdminConfirmationModal(true)}
                testID={'spaces-collaborators-grant-admin-btn'}
              >
                <HoliIcon icon="shield-plus" style={styles.actionsItemIcon} />
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
              label={t('spaces.collaborators.permissions.remove.user.label')}
              onPress={() => setShowRemoveMemberConfirmationModal(true)}
              testID={'spaces-collaborators-remove-user-btn'}
            >
              <HoliIcon icon="user-unfollow" style={styles.actionsItemIcon} />
              <HoliText style={styles.actionsItemText}>
                {t('spaces.collaborators.permissions.remove.user.label')}
              </HoliText>
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
              <HoliIcon icon="flag" style={styles.actionsItemIcon} />
              <HoliText style={styles.actionsItemText}>{t('global.report')}</HoliText>
            </HoliButton>

            <HoliButton
              contentStyle={styles.actionsItem}
              inline
              transparent
              disabled={loading}
              label={t('spaces.collaborators.permissions.viewProfile')}
              onPress={() => handleNavigation(user.id)}
              testID={'spaces-collaborators-view-profile-btn'}
            >
              <HoliIcon icon="user" style={styles.actionsItemIcon} />
              <HoliText style={styles.actionsItemText}>{t('spaces.collaborators.permissions.viewProfile')}</HoliText>
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
        </View>
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
})

export default SpacePermissions

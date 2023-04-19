import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import ReportBlockOptionButton from '@holi/core/components/ReportBlockOptionButton'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { ContentType } from '@holi/core/queries'
import {
  UpdateSpaceUserConnectionResponse,
  spaceByIdQuery,
  updateSpaceUserConnectionMutation,
} from '@holi/core/screens/spaces/queries'
import { SpaceConnectionAction, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { Space } from '@holi/core/screens/spaces/types'
import { User } from '@holi/core/screens/userprofile/types'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type SpacePermissionsProps = {
  space: Space
  user: User
  isAdmin: (user: User) => boolean | undefined
  handleNavigation: (id: string) => void
  permissionsVisible: boolean
  hidePermissions: () => void
}

const SpacePermissions: React.VFC<SpacePermissionsProps> = ({
  space,
  user,
  isAdmin,
  handleNavigation,
  permissionsVisible,
  hidePermissions,
}) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { displayError } = useErrorHandling()
  // const [showRemoveFromSpaceConfirmationModal, setShowRemoveFromSpaceConfirmationModal] = useState(false)
  const [showGrantAdminConfirmationModal, setShowGrantAdminConfirmationModal] = useState(false)
  const [showRevokeAdminConfirmationModal, setshowRevokeAdminConfirmationModal] = useState(false)

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
      },
      refetchQueries: [{ query: spaceByIdQuery, variables: { idOrName: space.id } }],
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
            label={user.fullName || t('navigation.headerRight.avatarFallbackLabel')}
            initials={user.avatarLabel}
            defaultColor={user.avatarDefaultColor}
            style={[styles.avatar, styles.avatar]}
          />
          <HoliText style={{ marginBottom: 4 }}>
            {user.fullName || t('navigation.headerRight.avatarFallbackLabel')}
          </HoliText>
          <HoliText size="small" style={{ color: colors.foreground20 }}>
            {user.pronouns || ''}
            {user.pronouns && <> &#183; </>}
            {isAdmin(user) ? 'Admin' : 'Member'}
          </HoliText>

          <View style={styles.actions}>
            {isAdmin(user) ? (
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

            {/* <HoliButton
              contentStyle={styles.actionsItem}
              inline
              transparent
              disabled={loading}
              label={t('spaces.collaborators.permissions.removeFromSpace.label')}
              onPress={() => setShowRemoveFromSpaceConfirmationModal(true)}
              testID={'spaces-collaborators-remove-from-space-btn'}
            >
              <HoliIcon icon="user-unfollow" style={styles.actionsItemIcon} />
              <HoliText style={styles.actionsItemText}>
                {t('spaces.collaborators.permissions.removeFromSpace.label')}
              </HoliText>
            </HoliButton> */}

            <ReportBlockOptionButton
              action="report"
              label={'Report user'}
              objectId={user.id}
              contentType={ContentType.USER}
              style={styles.reportUser}
              tintColor={colors.foreground20}
              bold={false}
              confirmationModalProps={{
                title: t('user.profileView.report.confirmation.title', { name: user.fullName }),
                description: t('user.profileView.report.confirmation.description', { name: user.fullName }),
              }}
              successMessage={t('global.report.successMessage')}
              onConfirm={hidePermissions}
            />

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
              user: user.fullName,
            })}
            onDismiss={() => setShowGrantAdminConfirmationModal(false)}
            dismissText={t('spaces.collaborators.permissions.confirm.no')}
            confirmText={t('spaces.collaborators.permissions.confirm.yes')}
            testID="spaces-collaborators-grant-admin-confirmation"
            onConfirm={() => {
              grantAdminRights()
            }}
          />

          <HoliConfirmation
            show={showRevokeAdminConfirmationModal}
            label={t('spaces.collaborators.permissions.revokeAdmin.label')}
            title={t('spaces.collaborators.permissions.revokeAdmin.label')}
            description={t('spaces.collaborators.permissions.revokeAdmin.confirm', {
              user: user.fullName,
            })}
            onDismiss={() => setshowRevokeAdminConfirmationModal(false)}
            dismissText={t('spaces.collaborators.permissions.confirm.no')}
            confirmText={t('spaces.collaborators.permissions.confirm.yes')}
            testID="spaces-collaborators-revoke-admin-confirmation"
            onConfirm={() => {
              revokeAdminRights()
            }}
          />

          {/* <HoliConfirmation
            show={showRemoveFromSpaceConfirmationModal}
            label={t('spaces.collaborators.permissions.removeFromSpace.label')}
            title={t('spaces.collaborators.permissions.removeFromSpace.label')}
            description={t('spaces.collaborators.permissions.removeFromSpace.confirm', {
              user: user.fullName,
            })}
            onDismiss={() => setShowRemoveFromSpaceConfirmationModal(false)}
            dismissText={t('spaces.collaborators.permissions.confirm.no')}
            confirmText={t('spaces.collaborators.permissions.confirm.yes')}
            testID="spaces-collaborators-remove-from-space-confirmation"
            onConfirm={() => {
              // ToDo: removeUserFromSpace(user)
              console.warn('removeUserFromSpace')
              setShowRemoveFromSpaceConfirmationModal(false)
            }}
          /> */}
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
    borderTopColor: colors.background20,
    borderTopWidth: 1,
  },
  actionsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  actionsItemText: {
    color: colors.foreground20,
    paddingLeft: 10,
  },
  actionsItemIcon: {
    color: colors.foreground20,
  },
  reportUser: {
    marginBottom: 24,
  },
})

export default SpacePermissions

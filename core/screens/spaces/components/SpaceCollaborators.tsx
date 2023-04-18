import partition from 'lodash.partition'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import SpacePermissions from '@holi/core/screens/spaces/components/SpacePermissions'
import { Space } from '@holi/core/screens/spaces/types'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { User } from '@holi/core/screens/userprofile/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type SpaceCollaboratorsProps = {
  space: Space
  show: boolean
  onDismiss: () => void
  style?: StyleProp<ViewStyle>
}

const sortUsersByFirstName = (users: User[]) =>
  users.sort((userA, userB) => (userA.fullName || '').localeCompare(userB.fullName || ''))

const SpaceCollaborators: React.VFC<SpaceCollaboratorsProps> = ({ space, onDismiss, show = false }) => {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(show)
  const { visible: permissionsVisible, show: showPermissions, hide: hidePermissions } = useModalState()
  const [selectedUser, setSelectedUser] = useState<User>()
  const { navigate } = useRouting()
  const mixins = useStyleMixins()

  const [adminMemberships, regularMemberships] = useMemo(
    () => partition(space.members.data, 'isAdministrator'),
    [space]
  )

  const admins = adminMemberships.map((membership) => membership.user)
  const members = regularMemberships.map((membership) => membership.user)

  const sortedMembersList = [...sortUsersByFirstName(admins), ...sortUsersByFirstName(members)]

  const isAdmin = (collaborator: User) => {
    const membership = space.members.data.find((membership) => membership.user.id === collaborator.id)
    return membership?.isAdministrator
  }

  const isSpaceAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)

  useEffect(() => {
    if (show) {
      setVisible(show)
    } else {
      setVisible(false)
    }
  }, [show, setVisible])

  const handleNavigation = (id: string) => {
    onDismiss()
    setTimeout(() => {
      navigate('/profile/' + id)
    })
  }

  return (
    <>
      <HoliModal
        show={visible}
        label={t('spaces.collaborators')}
        heading={t('spaces.collaborators')}
        testID={'space-collaborators'}
        onDismiss={onDismiss}
        relativeHeight={1}
        autoHeight={false}
      >
        <View style={[mixins.container, styles.wrapper]}>
          <ScrollView>
            {
              /** FIXME convert to VirtualizedList, FlatList or SectionList */
              sortedMembersList.map((collaborator, index) => (
                <HoliButton
                  contentStyle={styles.collaborators}
                  inline
                  transparent
                  label={
                    isSpaceAdmin
                      ? t('spaces.collaborators.permissions.label')
                      : t('user.visitProfile', { name: collaborator.fullName })
                  }
                  onPress={
                    isSpaceAdmin
                      ? () => {
                          showPermissions()
                          setSelectedUser(collaborator)
                        }
                      : () => handleNavigation(collaborator.id)
                  }
                  key={index}
                  testID={'spaces-collaborators-item'}
                >
                  <HoliAvatar
                    imageSrc={collaborator.avatar}
                    label={collaborator.fullName || t('navigation.headerRight.avatarFallbackLabel')}
                    initials={collaborator.avatarLabel}
                    defaultColor={collaborator.avatarDefaultColor}
                    size="small"
                    style={styles.avatar}
                  />
                  <View style={styles.titleContainer}>
                    <HoliText ellipsizeMode="tail" numberOfLines={1}>
                      {collaborator.fullName || 'Anonymous'}
                    </HoliText>
                  </View>
                  {isAdmin(collaborator) && (
                    <HoliText size="extrasmall" style={styles.admin}>
                      {t('spaces.collaborators.isAdmin')}
                    </HoliText>
                  )}
                </HoliButton>
              ))
            }
          </ScrollView>
        </View>

        {selectedUser && (
          <SpacePermissions
            user={selectedUser}
            isAdmin={isAdmin}
            handleNavigation={handleNavigation}
            permissionsVisible={permissionsVisible}
            hidePermissions={hidePermissions}
          />
        )}
      </HoliModal>
    </>
  )
}

const styles = StyleSheet.create({
  admin: {
    color: colors.foreground20,
    paddingLeft: 8,
  },
  avatar: {
    borderWidth: 1,
  },
  collaborators: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  titleContainer: {
    marginLeft: 16,
    flex: 1,
  },
  wrapper: {
    justifyContent: 'center',
    height: '100%',
    paddingTop: 24,
  },
})

export default SpaceCollaborators

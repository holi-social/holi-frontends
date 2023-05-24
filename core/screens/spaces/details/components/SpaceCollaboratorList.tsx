import partition from 'lodash.partition'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { usePaginationContext } from '@holi/core/pagination/Pagination'
import { Space, SpaceMember } from '@holi/core/screens/spaces/types'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { User } from '@holi/core/screens/userprofile/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

type SpaceCollaboratorsProps = {
  space: Space
  onSelectUser: (user: User) => void
  style?: StyleProp<ViewStyle>
}

const sortUsersByFirstName = (users: User[]) =>
  users.sort((userA, userB) => (userA.fullName || '').localeCompare(userB.fullName || ''))

const SpaceCollaborators: React.FC<SpaceCollaboratorsProps> = ({ space, onSelectUser }) => {
  const { t } = useTranslation()
  const { user: loggedInUser } = useLoggedInUser()

  const { data: spaceMembers } = usePaginationContext<SpaceMember>()

  const [adminMemberships, regularMemberships] = useMemo(
    () => partition(spaceMembers, 'isAdministrator'),
    [spaceMembers]
  )

  const admins = adminMemberships.map((membership) => membership.user)
  const members = regularMemberships.map((membership) => membership.user)

  const sortedMembersList = [...sortUsersByFirstName(admins), ...sortUsersByFirstName(members)]

  const isAdmin = (collaborator: User) => {
    const membership = space.members.data.find((membership) => membership.user.id === collaborator.id)
    return membership?.isAdministrator
  }

  const isSpaceAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)

  return (
    <ScrollView>
      {
        /** FIXME convert to VirtualizedList, FlatList or SectionList */
        sortedMembersList.map((collaborator, index) => (
          <HoliButton
            contentStyle={styles.collaborators}
            inline
            transparent
            label={
              isSpaceAdmin && loggedInUser?.id !== collaborator.id
                ? t('spaces.collaborators.permissions.label')
                : t('user.visitProfile', { name: collaborator.fullName })
            }
            onPress={() => onSelectUser(collaborator)}
            key={index}
            testID={'spaces-collaborators-item'}
          >
            <HoliAvatar
              imageSrc={collaborator.avatar}
              label=""
              accessibilityLabel={collaborator.fullName || t('user.profileView.anonymous')}
              initials={collaborator.avatarLabel}
              defaultColor={collaborator.avatarDefaultColor}
              size="small"
              style={styles.avatar}
            />
            <View style={styles.titleContainer}>
              <HoliText ellipsizeMode="tail" numberOfLines={1}>
                {collaborator.fullName || t('user.profileView.anonymous')}
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

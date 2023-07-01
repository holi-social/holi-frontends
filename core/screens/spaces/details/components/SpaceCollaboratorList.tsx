import React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { usePaginationContext } from '@holi/core/pagination/Pagination'
import { Space, SpaceMember } from '@holi/core/screens/spaces/types'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

type SpaceCollaboratorsProps = {
  space: Space
  onSelectMember: (member: SpaceMember) => void
  filter?: string
  style?: StyleProp<ViewStyle>
}

const SpaceCollaborators: React.FC<SpaceCollaboratorsProps> = ({ space, onSelectMember, filter }) => {
  const { t } = useTranslation()
  const { user: loggedInUser } = useLoggedInUser()

  let { data: spaceMembers } = usePaginationContext<SpaceMember>()
  if (filter) {
    spaceMembers = spaceMembers.filter((member) => {
      const firstName = member.user.fullName.split(' ').at(0)?.toLowerCase()
      const lastName = member.user.fullName.split(' ').at(1)?.toLowerCase()
      return member.user.fullName.startsWith(filter) || firstName?.startsWith(filter) || lastName?.startsWith(filter)
    })
  }

  const isSpaceAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)

  return (
    <ScrollView>
      {
        /** FIXME convert to VirtualizedList, FlatList or SectionList */
        spaceMembers.map((member) => {
          const collaborator = member.user
          return (
            <HoliButton
              contentStyle={styles.collaborators}
              inline
              transparent
              label={
                isSpaceAdmin && loggedInUser?.id !== collaborator.id
                  ? t('spaces.collaborators.permissions.label')
                  : t('user.visitProfile', { name: collaborator.fullName })
              }
              onPress={() => onSelectMember(member)}
              key={collaborator.id}
              testID={'spaces-collaborators-item'}
            >
              <HoliAvatar
                imageSrc={collaborator.avatar}
                imageBlurhash={collaborator.avatarBlurhash}
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
              {member.isAdministrator && (
                <HoliText size="extrasmall" style={styles.admin}>
                  {t('spaces.collaborators.isAdmin')}
                </HoliText>
              )}
            </HoliButton>
          )
        })
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

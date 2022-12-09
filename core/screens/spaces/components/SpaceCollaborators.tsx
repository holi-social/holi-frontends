import partition from 'lodash.partition'
import React, { useEffect, useMemo, useState } from 'react'
import { Platform, ScrollView, StatusBar, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import { Space } from '@holi/core/screens/spaces/types'
import { User } from '@holi/core/screens/userprofile/types'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliUserAvatar from '@holi/ui/components/molecules/HoliUserAvatar'
import ModalBasic from '@holi/ui/components/molecules/ModalBasic'
import { colors } from '@holi/ui/styles/globalVars'

type SpaceCollaboratorsProps = {
  space: Space
  show: boolean
  onDismiss: () => void
  style?: StyleProp<ViewStyle>
}

const sortUsersByFirstName = (users: User[]) =>
  users.sort((userA, userB) => (userA.fullName || '').localeCompare(userB.fullName || ''))

const SpaceCollaborators: React.VFC<SpaceCollaboratorsProps> = ({ space, onDismiss, show = false, style }) => {
  const [visible, setVisible] = useState(show)
  const { navigate } = useRouting()

  const [adminMemberships, regularMemberships] = useMemo(() => partition(space.memberships, 'isAdministrator'), [space])

  const admins = adminMemberships.map((membership) => membership.user)
  const members = regularMemberships.map((membership) => membership.user)

  const sortedMembersList = [...sortUsersByFirstName(admins), ...sortUsersByFirstName(members)]

  const isAdmin = (collaborator: User) => {
    const membership = space.memberships.find((membership) => membership.user.id === collaborator.id)
    return membership?.isAdministrator
  }

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
      <ModalBasic
        style={[styles.defaultLayout, style]}
        show={visible}
        animationType="slide"
        label={'spaces.collaborators.modal'}
        testID={'spaces-collaborators-modal'}
        onDismiss={onDismiss}
      >
        <View style={styles.wrapper}>
          <View style={styles.header}>
            {Platform.OS === 'web' ? (
              <HoliButton
                style={{ flex: 1 }}
                label={'notifications.title'}
                inline
                transparent
                onPress={onDismiss}
                testID="nav-button-down"
              >
                <HoliIcon icon="arrow-left-s" />
              </HoliButton>
            ) : (
              <HoliButton
                style={{ flex: 1, marginLeft: -6, marginRight: 6 }}
                label={'notifications.title'}
                transparent
                inline
                onPress={onDismiss}
                testID="nav-button-back"
              >
                <HoliIcon icon="arrow-down-s" />
              </HoliButton>
            )}
            <HoliText style={{ flex: 2 }}>Collaborators</HoliText>
          </View>
          <ScrollView>
            {sortedMembersList.map((collaborator, index) => (
              <View style={styles.collaborators} key={index}>
                <HoliUserAvatar
                  imageSrc={collaborator.avatar}
                  label={'Space'}
                  initials={''}
                  defaultColor={'#000'}
                  size="small"
                  style={styles.avatar}
                />
                <View style={styles.titleContainer}>
                  <HoliButton transparent label={''} onPress={() => handleNavigation(collaborator.id)}>
                    <HoliText>{collaborator.fullName || 'Anonymous'}</HoliText>
                  </HoliButton>
                </View>
                {isAdmin(collaborator) && (
                  <HoliText size="extrasmall" style={styles.admin}>
                    ADMIN
                  </HoliText>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      </ModalBasic>
    </>
  )
}

const styles = StyleSheet.create({
  admin: {
    color: colors.fontColorGrey,
  },
  avatar: {
    borderWidth: 1,
  },
  collaborators: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  date: {
    marginTop: 4,
    color: colors.fontColorGrey,
  },
  defaultLayout: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 8,
    paddingBottom: 0,
    ...Platform.select({
      web: {
        minHeight: '100vh',
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 21,
  },
  titleContainer: {
    marginLeft: 16,
    flex: 1,
  },
  wrapper: {
    justifyContent: 'center',
    paddingTop: 66,
    marginHorizontal: 24,
    height: '100%',
  },
})

export default SpaceCollaborators

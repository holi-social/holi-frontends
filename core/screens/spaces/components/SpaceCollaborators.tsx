import partition from 'lodash.partition'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type SpaceCollaboratorsProps = {
  space: Space
  show: boolean
  onDismiss: () => void
  style?: StyleProp<ViewStyle>
}

const sortUsersByFirstName = (users: User[]) =>
  users.sort((userA, userB) => (userA.fullName || '').localeCompare(userB.fullName || ''))

const SpaceCollaborators: React.VFC<SpaceCollaboratorsProps> = ({ space, onDismiss, show = false, style }) => {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(show)
  const { navigate } = useRouting()

  const mixins = useStyleMixins()

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
        label={t('spaces.collaborators')}
        testID={'spaces-collaborators-modal'}
        onDismiss={onDismiss}
      >
        <View style={[mixins.container, styles.wrapper]}>
          <View style={styles.header}>
            <HoliButton
              style={styles.closeModal}
              label={t('modal.backdrop')}
              inline
              transparent
              onPress={onDismiss}
              testID={Platform.OS === 'web' ? 'nav-button-down' : 'nav-button-back'}
            >
              <HoliIcon icon={Platform.OS === 'web' ? 'arrow-left-s' : 'arrow-down-s'} />
            </HoliButton>
            <HoliText style={styles.title}>{t('spaces.collaborators')}</HoliText>
          </View>
          <ScrollView>
            {sortedMembersList.map((collaborator, index) => (
              <HoliButton
                contentStyle={styles.collaborators}
                inline
                transparent
                label={t('user.visitProfile', { name: collaborator.fullName })}
                onPress={() => handleNavigation(collaborator.id)}
                key={index}
                testID="spaces-collaborators-item"
              >
                <HoliUserAvatar
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
    paddingLeft: 8,
  },
  avatar: {
    borderWidth: 1,
  },
  closeModal: {
    position: 'absolute',
    zIndex: 1,
  },
  collaborators: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  defaultLayout: {
    paddingTop: 8,
    paddingBottom: 0,
    ...Platform.select({
      web: {
        minHeight: '100vh',
      },
      android: {
        paddingTop: StatusBar.currentHeight || 0,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 21,
  },
  title: {
    flex: 1,
    textAlign: 'center',
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

import React, { useEffect, useState } from 'react'
import { Platform, ScrollView, StatusBar, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import { Space } from '@holi/core/screens/spaces/types'
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

const SpaceCollaborators: React.VFC<SpaceCollaboratorsProps> = ({ space, onDismiss, show = false, style }) => {
  const [visible, setVisible] = useState(show)
  const { navigate } = useRouting()

  const { memberships } = space

  const members = memberships.map((membership) => membership.user)

  useEffect(() => {
    if (show) {
      setVisible(show)
    } else {
      setVisible(false)
    }
  }, [show, setVisible])

  return (
    <>
      <ModalBasic
        style={[styles.defaultLayout, style]}
        show={visible}
        animationType="slide"
        label={'props.label'}
        testID={'props.testID'}
        onDismiss={onDismiss}
      >
        <View style={styles.wrapper}>
          <View style={styles.header}>
            {Platform.OS === 'web' ? (
              <HoliButton
                style={{ margin: -8 }}
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
                style={{ marginLeft: -8 }}
                label={'notifications.title'}
                transparent
                inline
                onPress={onDismiss}
                testID="nav-button-back"
              >
                <HoliIcon icon="arrow-down-s" />
              </HoliButton>
            )}
            <HoliText style={{ marginLeft: -16 }}>Collaborators</HoliText>
            <HoliText>{''}</HoliText>
          </View>
          <ScrollView>
            {members.map((collaborator, index) => (
              <View style={styles.itemHeader} key={index}>
                <HoliUserAvatar
                  imageSrc={collaborator.avatar}
                  label={'Space'}
                  initials={''}
                  defaultColor={'#000'}
                  size="small"
                  style={styles.avatar}
                />
                <View style={styles.titleContainer}>
                  <HoliButton transparent label={''} onPress={() => navigate('/profile/' + collaborator.id)}>
                    <HoliText>{collaborator.fullName}</HoliText>
                    {/*                     {date && (
                      <HoliText size="small" style={styles.date}>
                        {collaborator.date}
                      </HoliText>
                    )} */}
                  </HoliButton>
                </View>
                {collaborator.engagementLevel === 'ADMIN' && (
                  <HoliText size="extrasmall" style={styles.admin}>
                    {collaborator.engagementLevel}
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
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 21,
  },
  titleContainer: {
    marginHorizontal: 16,
    flex: 1,
  },
  date: {
    marginTop: 4,
    color: colors.fontColorGrey,
  },
  wrapper: {
    justifyContent: 'center',
    paddingTop: 66,
    marginHorizontal: 24,
    height: '100%',
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
})

export default SpaceCollaborators

import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import HoliButton from '@holi/ui/components/HoliButton'
import HoliIcon from '@holi/ui/components/HoliIcon'
import Holicon from '@holi/ui/components/holicon'
import useRouting from '@holi/ui/components/navigation/useRouting'
import { useTheme } from '@holi/ui/styles/theme'

export type HomeTopBarProps = {
  activePath?: string
}

const HomeTopBar: React.VoidFunctionComponent<HomeTopBarProps> = (props) => {
  // const { theme } = useTheme()
  const { navigate, pathname } = useRouting()

  const isNotifications = pathname.startsWith('/notifications')
  const isProfile = pathname.startsWith('/profile')

  return (
    <View
      style={styles.fullWidthContainer}
      accessible={true}
      accessibilityRole="navigation"
      accessibilityLabel="Top Navigation"
    >
      <View style={styles.buttonContainer}>
        <HoliButton label="Notifications" inline transparent onPress={() => navigate('/notifications')}>
          <Holicon icon="notification" size={35} color={isNotifications ? 'black' : 'grey'} />
          {/* <HoliIcon icon="home" size={20} filled={isNotifications} /> */}
        </HoliButton>
        <Text>Good Morning</Text>
        <HoliButton
          label="Profile"
          inline
          transparent
          onPress={() => navigate('/profile/danbim')}
          testID="profile-button"
        >
          <HoliIcon icon="user-circled" size={20} filled={isProfile} />
        </HoliButton>
      </View>
    </View>
  )
}

export default HomeTopBar

const styles = StyleSheet.create({
  fullWidthContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: 'red',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 1200,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

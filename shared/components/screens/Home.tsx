import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { NavigationStackScreensList } from 'shared/components/navigation/NavigationDrawer'
import { styleVars } from 'shared/styles/globalVars'
import Button from 'shared/components/ui/Button'
import Holicon from 'shared/components/ui/holicon'
import { useTheme } from 'shared/styles/theme'

export type HomeScreenProps = NativeStackScreenProps<NavigationStackScreensList, 'Home'>

const HomeScreen: React.VoidFunctionComponent<HomeScreenProps> = ({ navigation }) => {
  const { toggleDarkMode } = useTheme()
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Home</Text>

      <View style={{ flexDirection: 'column' }}>
        <Button style={styles.mt} onPress={() => navigation.navigate('Components')}>
          Components
        </Button>
        <Button style={styles.mt} onPress={() => navigation.navigate('Feed')}>
          <Text>Feed</Text>
          <Holicon icon="arrowtip-next" size={20} color={styleVars.primaryColor} />
        </Button>
        <Button style={styles.mt} onPress={toggleDarkMode}>
          Toggle Darkmode
        </Button>
      </View>
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mt: {
    marginTop: 10,
  },
  header: {
    fontSize: 24,
  },
})

export default HomeScreen

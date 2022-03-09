import { StyleSheet, View, Text } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { NavigationStackScreensList } from "shared/components/navigation/NavigationDrawer"
import { styleVars } from 'shared/styles/globalVars'
import Button from 'shared/components/ui/Button'
import Holicon from 'shared/components/ui/holicon'
import { useTheme } from 'shared/styles/theme'


export type HomeScreenProps = NativeStackScreenProps<NavigationStackScreensList, "Home">

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { toggleDarkMode } = useTheme()
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Home <Holicon icon="person" size={20} color={styleVars.primaryColor} /></Text>
      <Button text="Components" onPress={() => navigation.navigate('Components')} />
      <Button text="Users" onPress={() => navigation.navigate('Users')} />
      <Button text="Feed" onPress={() => navigation.navigate('Feed')} />
      <Button text="Toggle Darkmode" onPress={toggleDarkMode} />
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
  header: {
    fontSize: 24,
  },
})

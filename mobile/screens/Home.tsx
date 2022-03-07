import { StyleSheet, View, Text } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootStackParamList } from './_navigationStack'
import Button from 'shared/components/ui/button'
import Holicon from 'shared/components/ui/holicon'
import { useTheme } from 'shared/styles/theme'
import NewButton from 'shared/components/ui/NewButton'

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { toggleDarkMode } = useTheme()
  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Home <Holicon icon="person" size={20} color="#0f0" />
      </Text>
      <Button
        text="Components"
        onPress={() => navigation.navigate('Components')}
      />
      <Button text="Users" onPress={() => navigation.navigate('Users')} />
      <Button text="Feed" onPress={() => navigation.navigate('Feed')} />
      <NewButton text="Toggle Darkmode" onPress={toggleDarkMode} />
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
  },
})

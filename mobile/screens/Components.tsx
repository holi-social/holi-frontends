import { StyleSheet, View, Text } from 'react-native'
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from "./_navigationStack"
import Button from 'shared/components/ui/button'
import SharedImage from "shared/components/ui/sharedImage";
import Counter from "shared/components/counter"

import ImportedSvg from 'shared/assets/img/logo/logo.svg'


export type ComponentsScreenProps = NativeStackScreenProps<RootStackParamList, "Components">;

export default function ComponentsScreen({ navigation }: ComponentsScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Components</Text>

      <Counter />

      <SharedImage imageFile={require('shared/assets/img/logo/Logo_img.png')} style={{ width: 30, height: 30 }} />
      <SharedImage imageFile={ImportedSvg} isSvg={true} style={{ width: 50, height: 50 }} />

      <Button text="hello" onPress={() => console.log('hello')} />
      <Button text="hello with margin" style={{marginTop: 20}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
  },
});


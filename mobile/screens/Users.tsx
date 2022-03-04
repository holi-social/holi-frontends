import { StyleSheet, View, Text } from 'react-native'
import { useEffect, useState } from "react"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { NavigationStackScreensList } from "./_navigationStack"

import { getUsers, UserData } from "shared/api"
import Users from "shared/components/Users"



export type UsersScreenProps = NativeStackScreenProps<NavigationStackScreensList, "Users">

export default function UsersScreen({ navigation }: UsersScreenProps) {
  const [users, setUsers] = useState<Array<UserData>>([])
  useEffect(() => {
    getUsers().then(setUsers);
    return () => {}
  }, [])
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Users</Text>
      <Users users={users} />
    </View>
  )
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
})

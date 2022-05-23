import { useQuery } from '@apollo/client'
import React, { createContext } from 'react'
import { Text } from 'react-native'

import { AllUsersQueryResult, allUsersQuery } from '@holi/core/user/queries'
import { User } from '@holi/core/user/types'

interface Context {
  user: User | undefined
}

export const UserContext = createContext<Context>({
  user: undefined,
})

export const UserContextProvider: React.FC = ({ children }) => {
  // Later: Possibly retrieve user id from auth context and load user by id here
  const { loading, error, data } = useQuery<AllUsersQueryResult>(allUsersQuery, {
    variables: {
      offset: 0,
      limit: 1,
    },
  })

  if (loading) {
    children
  }

  if (error) {
    // Necessary to display error to user?
    console.error('Error fetching users', error)
  }

  const user = data?.allUsers && data?.allUsers[0]
  //const user = undefined // TODO implement fetching user context for logged-in user

  return (
    <UserContext.Provider
      value={{
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

import { useQuery } from '@apollo/client'
import React, { createContext } from 'react'

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
    return <UserContext.Provider value={{ user: undefined }}>{children}</UserContext.Provider>
  }

  if (error) {
    // Necessary to display error to user?
    console.error('Error fetching users', error)
  }

  const user = data?.allUsers && data?.allUsers[0]

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

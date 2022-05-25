import React, { createContext, useState } from 'react'

import { client } from '@holi/api/graphql/client'
import { allUsersQuery } from '@holi/core/user/queries'
import { User } from '@holi/core/user/types'

interface Context {
  user: User | undefined
}

export const UserContext = createContext<Context>({
  user: undefined,
})

export const UserContextProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | undefined>(undefined)

  client.query({ query: allUsersQuery }).then((data) => {
    setUser(data.data?.allUsers ? data.data?.allUsers[0] : undefined)
  })

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

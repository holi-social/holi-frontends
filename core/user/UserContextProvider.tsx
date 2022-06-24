import { useQuery } from '@apollo/client'
import React, { createContext } from 'react'

import useErrorHandling from '@holi/core/errors/useErrorHandling'
import { AllUsersQueryResult, allUsersQuery } from '@holi/core/user/queries'
import { User } from '@holi/core/user/types'
import HoliText from '@holi/ui/components/HoliText'

interface Context {
  user: User | undefined
}

export const UserContext = createContext<Context>({
  user: undefined,
})

export const UserContextProvider: React.FC = ({ children }) => {
  const { displayError } = useErrorHandling()
  // TODO implement fetching user context for logged-in user
  // Later: Possibly retrieve user id from auth context and load user by id here
  const { loading, error, data } = useQuery<AllUsersQueryResult>(allUsersQuery, {
    variables: {
      offset: 0,
      limit: 1,
    },
  })

  if (loading) {
    return <HoliText>Loading...</HoliText>
  }

  if (error) {
    displayError(error, 'Error fetching users')
  }

  const user = data?.allUsers && data?.allUsers[0]

  return <UserContext.Provider value={{ user: user }}>{children}</UserContext.Provider>
}

import { DocumentNode, useQuery } from '@apollo/client'
import React from 'react'

import { logError } from '@holi/core/errors/helpers'
import UserChipForm from '@holi/core/screens/userprofile/components/UserChipForm'
import type { User } from '@holi/core/screens/userprofile/types'

type UserChipLoaderProps = {
  user: User
  onCancel?: () => void
  onSubmit?: (user: User) => void
  keyInUserObject: string
  sortByTranslation?: boolean
  queryToUse: DocumentNode
  queryTypeName?: string
}

const UserChipLoader: React.VoidFunctionComponent<UserChipLoaderProps> = ({
  user,
  onCancel,
  onSubmit,
  keyInUserObject,
  queryToUse,
  queryTypeName,
}: UserChipLoaderProps) => {
  const { loading, data, error } = useQuery(queryToUse)

  if (error) {
    logError(error, `[UserChipLoader.tsx] ${error.message}`)
  }

  // Error and loading states are handled the same way and just hide the component
  if (loading || error) {
    return <></>
  }

  return (
    <UserChipForm
      user={user}
      onCancel={onCancel}
      onSubmit={onSubmit}
      keyInUserObject={keyInUserObject}
      availableTerms={data[queryTypeName ?? keyInUserObject].data}
    />
  )
}

export default UserChipLoader

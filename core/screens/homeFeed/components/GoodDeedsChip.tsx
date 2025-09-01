import React from 'react'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { GoodDeedsChipGuest } from '@holi/core/screens/homeFeed/components/GoodDeedsChipGuest'
import { GoodDeedsChipUser } from '@holi/core/screens/homeFeed/components/GoodDeedsChipUser'

export const GoodDeedsChip: React.FC = () => {
  const { isLoggedIn } = useLoggedInUser()
  return isLoggedIn ? <GoodDeedsChipUser /> : <GoodDeedsChipGuest />
}

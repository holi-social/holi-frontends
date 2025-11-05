import {
  useCompleteReadyToGoTaskMutation,
  useGetRewardsCounterQuery,
  useGlobalRewardsCounterQuery,
} from '@holi/api/graphql/graphql-codegen'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { useCallback } from 'react'

export const useCompleteTask = () => {
  const { isLoggedIn } = useLoggedInUser()
  const [completeTask, { loading, error, data }] = useCompleteReadyToGoTaskMutation()
  const { refetch: refetchRewardsCounter } = useGetRewardsCounterQuery({
    fetchPolicy: 'no-cache',
    skip: !isLoggedIn,
  })
  const { refetch: refetchGlobalRewardsCounter } = useGlobalRewardsCounterQuery({
    skip: !isLoggedIn,
  })

  const completeTaskById = useCallback(
    async (taskId: string) => {
      await completeTask({
        variables: { id: taskId },
      })

      if (isLoggedIn) {
        await refetchRewardsCounter()
        await refetchGlobalRewardsCounter()
      }
    },
    [completeTask, isLoggedIn, refetchRewardsCounter, refetchGlobalRewardsCounter]
  )

  return {
    completeTask: completeTaskById,
    loading,
    error,
    data,
  }
}

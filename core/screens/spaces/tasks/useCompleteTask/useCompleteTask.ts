import {
  useCompleteReadyToGoTaskMutation,
  useGetRewardsCounterQuery,
  useGlobalRewardsCounterQuery,
} from '@holi/api/graphql/graphql-codegen'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'

export const useCompleteTask = () => {
  const { isLoggedIn } = useLoggedInUser()
  const [completeTask, { loading, error, data }] = useCompleteReadyToGoTaskMutation()
  const { refetch: refetchRewardsCounter } = useGetRewardsCounterQuery({
    skip: !isLoggedIn,
  })
  const { refetch: refetchGlobalRewardsCounter } = useGlobalRewardsCounterQuery({
    skip: !isLoggedIn,
  })

  const completeTaskById = async (taskId: string) => {
    await completeTask({
      variables: { id: taskId },
    })
    if (isLoggedIn) {
      await refetchRewardsCounter()
      await refetchGlobalRewardsCounter()
    }
  }

  return {
    completeTask: completeTaskById,
    loading,
    error,
    data,
  }
}

import { useCompleteReadyToGoTaskMutation, useGetRewardsCounterQuery } from '@holi/api/graphql/graphql-codegen'

export const useCompleteTask = () => {
  const [completeTask, { loading, error, data }] = useCompleteReadyToGoTaskMutation()
  const { refetch: refetchRewardsCounter } = useGetRewardsCounterQuery()

  const completeTaskById = async (taskId: string) => {
    await completeTask({
      variables: { id: taskId },
    })
    await refetchRewardsCounter()
  }

  return {
    completeTask: completeTaskById,
    loading,
    error,
    data,
  }
}

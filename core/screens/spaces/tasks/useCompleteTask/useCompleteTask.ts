import {
  useCompleteReadyToGoTaskMutation,
  useGetRewardsCounterQuery,
  useGlobalRewardsCounterQuery,
} from '@holi/api/graphql/graphql-codegen'

export const useCompleteTask = () => {
  const [completeTask, { loading, error, data }] = useCompleteReadyToGoTaskMutation()
  const { refetch: refetchRewardsCounter } = useGetRewardsCounterQuery()
  const { refetch: refetchGlobalRewardsCounter } = useGlobalRewardsCounterQuery()

  const completeTaskById = async (taskId: string) => {
    await completeTask({
      variables: { id: taskId },
    })
    await refetchRewardsCounter()
    await refetchGlobalRewardsCounter()
  }

  return {
    completeTask: completeTaskById,
    loading,
    error,
    data,
  }
}

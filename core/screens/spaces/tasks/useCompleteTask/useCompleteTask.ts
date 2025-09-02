import { useCompleteReadyToGoTaskMutation } from '@holi/api/graphql/graphql-codegen'

export const useCompleteTask = () => {
  const [completeTask, { loading, error, data }] = useCompleteReadyToGoTaskMutation()

  const completeTaskById = async (taskId: string) => {
    return await completeTask({
      variables: { id: taskId },
    })
  }

  return {
    completeTask: completeTaskById,
    loading,
    error,
    data,
  }
}

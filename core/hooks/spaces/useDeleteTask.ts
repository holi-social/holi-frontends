import { useTranslation } from 'react-i18next'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { useDeleteTaskMutation } from '@holi/api/graphql/graphql-codegen'

const useDeleteTask = () => {
  const { t } = useTranslation()
  const { openToast } = useToast()

  return useDeleteTaskMutation({
    onCompleted: () => {
      openToast(t('spaces.tasks.delete.success'), HoliToastType.SUCCESS)
    },
  })
}

export default useDeleteTask

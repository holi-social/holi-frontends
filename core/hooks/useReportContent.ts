import { useMutation } from '@apollo/client'
import type { FetchResult, MutationFunctionOptions } from '@apollo/client'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { ContentType, ReportContentMutation } from '@holi/core/queries'
import type { ReportContentResponse } from '@holi/core/queries'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

export type UseReportContent = [boolean, (options?: MutationFunctionOptions) => Promise<FetchResult>]

export interface UseReportContentProps {
  id: string
  contentType: ContentType
  successMsg: string
}

const useReportContent = ({ id, contentType, successMsg }: UseReportContentProps): UseReportContent => {
  const { openToast } = useToast()
  const { displayError } = useErrorHandling()

  const [reportContent, { loading: isLoading }] = useMutation<ReportContentResponse>(ReportContentMutation, {
    variables: {
      contentType,
      objectId: id,
    },
    onCompleted: () => {
      openToast(successMsg, HoliToastType.SUCCESS)
    },
    onError: (e) => {
      displayError(e, 'Failed to report content', {
        location: 'useReportContent',
        id,
        contentType,
      })
    },
  })

  return [isLoading, reportContent]
}

export default useReportContent

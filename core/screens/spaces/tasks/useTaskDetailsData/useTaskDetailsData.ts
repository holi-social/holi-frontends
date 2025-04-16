import { isForbiddenError, isNotFoundError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { isSSR } from '@holi/core/helpers/isSSR'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { SpaceUserConnectionType, VisibilityType, useTaskByIdQuery } from '@holi/api/graphql/graphql-codegen'
import { CalendarEventLine, MapPinLine, Time, UserFilled } from '@holi/icons/src/generated'
import { useTranslation } from 'react-i18next'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { getFormattedDate, getFormattedTaskDetailsDates } from '@holi/core/i18n/helpers/dateHelper'
import { useRateLimit } from '@holi/ui/helper'
import type { DetailsScreenChips, DetailsScreenData, DetailsScreenInfoList } from '@holi/core/layout/DetailsScreen'

export type TaskDetailsParams = {
  spaceIdOrName: string
  taskId: string
}

export type UseTaskDetailsData = {
  data: DetailsScreenData
  id?: string
  spaceName?: string
  isOwner?: boolean
  refetch(): Promise<void>
  spaceId?: string
  spaceTitle?: string
}

const { useParam, useUUIDParam } = createParamHooks<TaskDetailsParams>()

export const useTaskDetailsData = (): UseTaskDetailsData => {
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const { displayError } = useErrorHandling()
  const { replaceRoute, navigate } = useRouting()
  const { t, i18n } = useTranslation()
  const [taskId] = useUUIDParam('taskId')
  const loginState = useLoggedInUser()
  const { data, loading, refetch } = useTaskByIdQuery({
    variables: {
      id: taskId as string,
    },
    skip: !taskId,
    fetchPolicy: isSSR ? 'cache-first' : 'cache-and-network',

    onError: (error) => {
      if (isNotFoundError(error) || isForbiddenError(error)) {
        return replaceRoute('/404')
      }
      displayError(error, 'Failed to load task', {
        location: 'TaskDetails.taskByIdQuery',
        spaceIdOrName,
      })
    },
  })
  const refetchData = useRateLimit(() => refetch({ id: taskId }))
  const isAdmin = !!data?.taskById?.space?.connectionStatusToMyself?.includes(SpaceUserConnectionType.Administrator)
  const isOwner = loginState.isLoggedIn && isAdmin

  const skills =
    data?.taskById?.skillsV2?.map<DetailsScreenChips>((skill) => {
      return {
        title: t(`skill.${skill}`),
        color: 'blue',
      }
    }) || []

  const topics =
    data?.taskById?.space?.topicsV2?.map<DetailsScreenChips>((topic) => {
      return {
        title: t(`topic.${topic}`),
        color: 'green',
      }
    }) || []

  const locationType = data?.taskById?.locationType
    ? {
        subtitle: data?.taskById?.location ? data?.taskById?.location : undefined,
        title:
          data?.taskById?.locationType && t(`task.locationType.${data?.taskById?.locationType}`)
            ? t(`task.locationType.${data?.taskById?.locationType}`)
            : t('task.locationType.NOT_DECLARED'),
        icon: MapPinLine,
      }
    : undefined

  const slots =
    data?.taskById?.slotsAvailable && data?.taskById?.slotsTaken
      ? {
          title: `${data?.taskById?.slotsTaken}/${data?.taskById?.slotsAvailable}`,
          icon: UserFilled,
        }
      : undefined

  const regularity = data?.taskById?.regularity
    ? {
        icon: Time,
        title:
          data?.taskById?.regularity && t(`task.commitment.${data?.taskById?.regularity}`)
            ? t(`task.commitment.${data?.taskById?.regularity}`)
            : t('task.commitment.NOT_DECLARED'),
      }
    : undefined

  // TODO TASK TIMING START ---------------------------------------------------------------------------
  // for testing purposes only, delete the following when real data is provided
  const normalizeDate = (date: Date): Date => {
    const newDate = new Date(date)
    newDate.setHours(23, 59, 59, 0)
    return newDate
  }
  const getOneDayLaterDate = (date: Date) => {
    const newDate = new Date(date)
    newDate.setDate(newDate.getDate() + 1)
    return newDate
  }
  const mockTimeFrame = {
    anytime: false,
    startDate: normalizeDate(new Date()),
    endDate: getOneDayLaterDate(normalizeDate(new Date())),
  }
  // when backend is implemented: data?.taskById?.timeFrame
  const dataContainsTimeFrame = false
  const timeFrame = dataContainsTimeFrame
    ? {
        icon: CalendarEventLine,
        title: mockTimeFrame.anytime
          ? t('task.timeframe.anytime')
          : getFormattedTaskDetailsDates(mockTimeFrame.startDate, mockTimeFrame.endDate, i18n.language),
      }
    : undefined
  // TODO TASK TIMING END -----------------------------------------------------------------------------

  const infoList = [locationType, slots, timeFrame, regularity].filter(
    (detail) => detail !== undefined
  ) as DetailsScreenInfoList[]

  const formattedDate = getFormattedDate(data?.taskById?.created, i18n.language)

  return {
    spaceName: data?.taskById?.space?.name,
    refetch: async () => {
      await refetchData()
    },
    id: data?.taskById?.id,
    isOwner,
    data: {
      loading,
      title: data?.taskById?.name || '',
      description: data?.taskById?.description,
      chips: [...topics, ...skills],
      visibility:
        data?.taskById?.visibility === VisibilityType.Members ? 'private' : ('public' as 'private' | 'public'),
      infoList,
      coverImage: {
        uri: data?.taskById?.thumbnail,
      },
      author: {
        topTitle: `${formattedDate} ∙ ${t('postedOnHoli')}`,
        title: data?.taskById?.space?.name || data?.taskById?.name || '??',
        subtitle: data?.taskById?.creator?.fullName,
        onPress: () => navigate('/spaces/' + data?.taskById?.space?.id),
        mainAvatar: {
          source: data?.taskById?.space?.avatar,
          initials: data?.taskById?.space?.name || data?.taskById?.name || '??',
        },
        secondaryAvatar: data?.taskById?.creator?.avatar
          ? {
              source: data?.taskById?.creator?.avatar,
              initials: data?.taskById?.creator?.fullName || data?.taskById?.name || '??',
            }
          : undefined,
      },
    },
    spaceId: data?.taskById?.space?.id,
    spaceTitle: data?.taskById?.space?.title,
  }
}

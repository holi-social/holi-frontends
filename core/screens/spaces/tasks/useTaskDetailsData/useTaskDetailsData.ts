import { isForbiddenError, isNotFoundError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { isSSR } from '@holi/core/helpers/isSSR'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import {
  type InteractionType,
  SpaceUserConnectionType,
  VisibilityType,
  useTaskByIdQuery,
  type Duration,
  type Regularity,
} from '@holi/api/graphql/graphql-codegen'
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
  interactionType?: InteractionType
  interactionSignupLink?: string
  taskDuration?: Duration
  taskRegularity?: Regularity
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
  const isMember = !!data?.taskById?.space?.connectionStatusToMyself?.includes(SpaceUserConnectionType.Member)
  const isOwner = loginState.isLoggedIn && (isAdmin || isMember) && loginState.user.id === data?.taskById?.creator.id

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

  const duration = data?.taskById?.duration
    ? t(`spaces.input.task.section.timing.duration.value.${data?.taskById?.duration}`)
    : t('spaces.input.task.section.timing.duration.value.INDETERMINATE')

  const regularity = data?.taskById?.regularity
    ? t(`spaces.input.task.section.timing.regularity.value.${data?.taskById?.regularity}`)
    : t('spaces.input.task.section.timing.regularity.value.NEGOTIABLE')

  const regularityAndDuration = {
    icon: Time,
    title: (() => {
      if (regularity && duration) {
        return `${regularity} ${t('spaces.input.task.section.timing.duration.forHowLong')} ${duration}`
      }
      return regularity || duration || ''
    })(),
  }

  const hasTimeFrame = !!(data?.taskById?.timeframeEndDate && data?.taskById?.timeframeStartDate)
  const timeFrameStartDate = data?.taskById?.timeframeStartDate
  const timeFrameEndDate = data?.taskById?.timeframeEndDate

  const timeFrame = hasTimeFrame
    ? {
        icon: CalendarEventLine,
        title: hasTimeFrame
          ? getFormattedTaskDetailsDates(new Date(timeFrameStartDate), new Date(timeFrameEndDate), i18n.language)
          : t('task.timeframe.anytime'),
      }
    : undefined

  const infoList = [locationType, slots, timeFrame, regularityAndDuration].filter(
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
          label: data?.taskById?.space?.name || data?.taskById?.name || '??',
        },
        secondaryAvatar: data?.taskById?.creator?.avatar
          ? {
              source: data?.taskById?.creator?.avatar,
              label: data?.taskById?.creator?.fullName || data?.taskById?.name || '??',
            }
          : undefined,
      },
    },
    spaceId: data?.taskById?.space?.id,
    spaceTitle: data?.taskById?.space?.title,
    interactionType: data?.taskById?.interactionType,
    interactionSignupLink: data?.taskById?.interactionSignupLink,
    taskDuration: data?.taskById?.duration,
    taskRegularity: data?.taskById?.regularity,
  }
}

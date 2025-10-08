import {
  type Duration,
  InteractionType,
  type Regularity,
  SpaceUserConnectionType,
  VisibilityType,
  useTaskByIdQuery,
} from '@holi/api/graphql/graphql-codegen'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { isForbiddenError, isNotFoundError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { isSSR } from '@holi/core/helpers/isSSR'
import { getFormattedDate, getFormattedTaskDetailsDates } from '@holi/core/i18n/helpers/dateHelper'
import type { DetailsScreenChips, DetailsScreenData, DetailsScreenInfoList } from '@holi/core/layout/DetailsScreen'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { CalendarEventLine, Global, HeartHandshake, MapPinLine, Time, UserFilled } from '@holi/icons/src/generated'
import { useRateLimit } from '@holi/ui/helper'
import { useTranslation } from 'react-i18next'
import { getLocationTypeInfo } from '@holi/core/helpers/getLocationTypeInfo'

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
  totalCompletions?: number
  isGoodDeed: boolean
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
  const isOwner = loginState.isLoggedIn && (isAdmin || loginState.user.id === data?.taskById?.creator.id)

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

  const { isRemote, isHybrid } = getLocationTypeInfo(data?.taskById?.locationType, data?.taskById?.location)

  const locationType =
    data?.taskById?.location || isRemote || isHybrid
      ? {
          subtitle: data?.taskById?.location && !isRemote ? data?.taskById?.location : undefined,
          title: isRemote
            ? t('task.locationType.REMOTE')
            : isHybrid
              ? t('task.locationType.HYBRID')
              : t('task.locationType.ONSITE'),
          icon: isRemote || isHybrid ? Global : MapPinLine,
        }
      : undefined

  const slots =
    data?.taskById?.slotsAvailable && data?.taskById?.slotsTaken
      ? {
          title: `${data?.taskById?.slotsTaken}/${data?.taskById?.slotsAvailable}`,
          icon: UserFilled,
        }
      : undefined

  const duration =
    data?.taskById?.duration && data?.taskById?.duration !== 'INDETERMINATE'
      ? t(`spaces.input.task.section.timing.duration.value.${data?.taskById?.duration}`)
      : undefined

  const regularity = data?.taskById?.regularity
    ? t(`spaces.input.task.section.timing.regularity.value.${data?.taskById?.regularity}`)
    : undefined

  const regularityAndDuration = {
    icon: Time,
    title: (() => {
      if (regularity && duration) {
        return t('spaces.input.task.section.timing.duration.forHowLong', { regularity, duration })
      }
      return regularity || duration || t('spaces.input.task.section.timing.duration.value.INDETERMINATE')
    })(),
  }

  const totalCompletions = data?.taskById?.totalCompletions
    ? {
        title: t('task.card.completionCounter', { count: data?.taskById?.totalCompletions }),
        icon: HeartHandshake,
      }
    : undefined
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

  const coverImage = data?.taskById?.thumbnail
    ? {
        uri: data.taskById.thumbnail,
      }
    : undefined

  const infoList = [totalCompletions, locationType, slots, timeFrame, regularityAndDuration].filter(
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
      bodyContent: [
        { title: t('spaces.tasks.impact.title'), content: data?.taskById?.impact ?? '' },
        { title: t('spaces.tasks.description.title'), content: data?.taskById?.description ?? '' },
      ].filter((item) => item.content),
      chips: [...topics, ...skills],
      visibility: data?.taskById?.visibility === VisibilityType.Members ? 'private' : undefined,
      infoList,
      coverImage,
      isFavorite: data?.taskById?.isFavorite,
      location: data?.taskById?.location,
      locationType: data?.taskById?.locationType,
      author: {
        topTitle: `${formattedDate} ∙ ${t('postedOnHoli')}`,
        title: data?.taskById?.space?.title || data?.taskById?.name || '??',
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
    totalCompletions: data?.taskById?.totalCompletions,
    interactionType: data?.taskById?.interactionType,
    interactionSignupLink: data?.taskById?.interactionSignupLink,
    taskDuration: data?.taskById?.duration,
    taskRegularity: data?.taskById?.regularity,
    isGoodDeed: data?.taskById?.interactionType === InteractionType.Ready,
  }
}

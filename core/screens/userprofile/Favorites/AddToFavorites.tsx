import React, { useEffect } from 'react'
import { Screen } from '@holi/core/components/Screen'
import { useTranslation } from 'react-i18next'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { Stack } from 'holi-bricks/components/stack'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useFavoriting } from '@holi/core/components/FavoritingButton/helpers/useFavoriting'
import { FavoritableType } from '@holi/api/graphql/graphql-codegen'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import { useErrorHandling } from '@holi/core/errors/hooks'

export type TaskDetailsParams = {
  taskId: string
}

const { useUUIDParam } = createParamHooks<TaskDetailsParams>()

const AddToFavoritesWithParams = () => {
  const [taskId] = useUUIDParam('taskId')
  if (taskId) {
    return <AddToFavorites taskId={taskId} />
  } else {
    return null
  }
}

const AddToFavorites = ({ taskId }: TaskDetailsParams) => {
  const { t } = useTranslation()
  const { isLoggedIn } = useLoggedInUser()
  const { navigate } = useRouting()
  const { displayError } = useErrorHandling()

  if (!isLoggedIn) {
    navigate('/')
  }

  const { favorite } = useFavoriting(taskId, FavoritableType.Task, {
    __typename: 'Task',
    onError: (error: Error) => {
      displayError(error, 'Failed to add the task to favorites', {
        location: 'TaskDetails.saveForLaterTask',
        favoritableId: taskId,
      })
    },
    onCompleted: () => {
      navigate('/profile/settings/favorites')
    },
  })

  useEffect(() => {
    favorite()
  }, [favorite])

  return (
    <Screen
      headerOptions={{
        headerBackVisible: false,
        headerLeft: () => <></>,
        title: t('profile.settings.favorites.title'),
      }}
    >
      <Stack margin={{ top: 'xxl' }}>
        <HoliLoader />
      </Stack>
    </Screen>
  )
}

export default AddToFavoritesWithParams

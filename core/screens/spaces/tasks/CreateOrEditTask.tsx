import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import { isMaliciousUrlError } from '@holi/core/errors/helpers'
import { type TranslatedFieldErrors, useErrorHandling } from '@holi/core/errors/hooks'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import SpaceFormScreenLayout from '@holi/core/screens/spaces/components/SpaceFormScreenLayout'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { Text } from 'holi-bricks/components/text'
import {
  type CreateTaskInput,
  SpaceByIdDocument,
  SpaceUserConnectionType,
  useCreateTaskMutation,
  useSpaceConnectionStatusToMyselfByIdQuery,
  useTaskByIdQuery,
  useUpdateTaskMutation,
} from '@holi/api/graphql/graphql-codegen'

import TaskInputForm from './components/TaskInputForm'
import type { TaskFormInput } from './components/TaskInputForm/types'
import { CreateOrEditTaskSchema, createOrEditTaskSchemaRefinedInteractionSignupLink } from './taskSchema'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { z } from 'zod'
import type { ApolloError } from '@apollo/client'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'

export type CreateTaskParams = {
  spaceIdOrName: string
}

export type EditTaskParams = CreateTaskParams & {
  taskId: string
}

const { useParam, useUUIDParam } = createParamHooks<EditTaskParams>()

const DEFAULT_SLOTS_AVAILABLE = 1

const TASK_ORIGIN: TaskFormInput = {
  name: '',
  description: '',
  impact: '',
  visibility: undefined,
  locationType: undefined,
  interactionType: undefined,
  contactEmail: '',
  interactionSignupLink: undefined,
  slotsAvailable: DEFAULT_SLOTS_AVAILABLE,
  thumbnail: '',
  skillsV2: undefined,
  location: '',
  geolocation: undefined,
  contactPhone: '',
  duration: undefined,
  regularity: undefined,
  timeframeStartDate: undefined,
  timeframeEndDate: undefined,
}

const CreateOrEditTask = () => {
  const [spaceIdOrNameParam] = useParam('spaceIdOrName')
  const { navigateBack, replaceRoute } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const { t } = useTranslation()
  const [taskIdParam] = useUUIDParam('taskId')
  const { openToast } = useToast()
  const { displayError } = useErrorHandling()

  const isEditing = !!taskIdParam

  const [taskInput, setTaskInput] = useState<TaskFormInput>({ ...TASK_ORIGIN })

  // Queries
  const {
    data: { spaceById: space } = {},
    loading: loadingSpace,
    error: errorSpace,
  } = useSpaceConnectionStatusToMyselfByIdQuery({
    variables: {
      idOrName: spaceIdOrNameParam ?? '',
    },
    skip: !spaceIdOrNameParam,
  })
  const {
    data: { taskById: taskToEdit } = {},
    loading: loadingTask,
    error: errorTask,
  } = useTaskByIdQuery({
    variables: { id: taskIdParam ?? '' },
    skip: !taskIdParam,
    onCompleted: ({ taskById }) => {
      if (taskById) {
        setTaskInput((prevTaskInput) => ({
          ...prevTaskInput,
          ...taskById,
          geolocation: taskById.geolocation
            ? {
                latitude: taskById.geolocation.latitude,
                longitude: taskById.geolocation.longitude,
              }
            : undefined,
          thumbnail: taskById.thumbnail || undefined,
        }))
      }
    },
  })

  // Mutations
  const mutationOptions = {
    onCompleted: () => navigateBack(),
    onError: (error: ApolloError) => {
      if (isMaliciousUrlError(error)) {
        openToast(t('global.maliciousUrl.error'), HoliToastType.ERROR)
      } else {
        displayError(error, 'Failed to create task', {
          location: isEditing ? 'EditTask.updateTask' : 'CreateTask.createTask',
          spaceIdOrNameParam,
        })
      }
    },
    refetchQueries: [{ query: SpaceByIdDocument, variables: { idOrName: spaceIdOrNameParam } }],
  }

  const [createTask] = useCreateTaskMutation(mutationOptions)
  const [updateTask] = useUpdateTaskMutation(mutationOptions)

  const {
    visible: confirmationModalVisible,
    show: showConfirmationModal,
    hide: hideConfirmationModal,
  } = useModalState()

  const loginState = useLoggedInUser()
  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceUserConnectionType.Administrator)
  const isMember = space?.connectionStatusToMyself?.includes(SpaceUserConnectionType.Member)
  const isTaskOwner = loginState.isLoggedIn && taskToEdit?.creator.id === loginState.user.id

  // Validation
  const [fieldErrors, setFieldErrors] = useState<TranslatedFieldErrors>({})

  const validateField = (field: keyof TaskFormInput) => {
    const tempSchema = z.object({
      [field]: CreateOrEditTaskSchema.shape[field],
    })
    const { error } = tempSchema.safeParse(taskInput)
    setFieldErrors((prevErrors) => ({ ...prevErrors, [field]: error?.flatten().fieldErrors[field] }))
  }

  const validateForm = () => {
    const { error, success } = createOrEditTaskSchemaRefinedInteractionSignupLink.safeParse(taskInput)
    const fromErrors = error?.flatten().fieldErrors
    setFieldErrors(fromErrors ?? {})

    return success
  }

  // Handlers
  const onTaskInputChange = (update: Partial<TaskFormInput>) => {
    setTaskInput((prevTaskInput) => ({ ...prevTaskInput, ...update }))
  }

  const onSave = async () => {
    if (!validateForm() || !space?.id || (isEditing && !taskToEdit?.id)) {
      return
    }

    const mutationInput = {
      spaceId: space.id,
      ...Object.keys(TASK_ORIGIN).reduce(
        (acc, key) => ({
          ...acc,
          // BE specific: when we load a task for editing from the backend, it includes extra "noise" fields,
          // which we merge into the `taskToEdit` state variable.
          // Before running the mutation, we need to strip out those noise fields.
          // To do that, we extract only the necessary fields based on the `TASK_ORIGIN`.
          [key]: taskInput[key as keyof TaskFormInput] ?? undefined,
          // BE specific: the `string` type is returned from the backend only when a task is loaded for editing.
          // If the user does *not* update the image, we must send `undefined` to the backend to indicate the image hasn't changed.
          // If the user *does* update the image, it will be an object — in this case, we need to send its blob to update it.
          thumbnail: typeof taskInput.thumbnail === 'string' ? undefined : taskInput.thumbnail?.blob,
          geolocation: taskInput.geolocation
            ? {
                latitude: taskInput.geolocation.latitude,
                longitude: taskInput.geolocation.longitude,
              }
            : undefined,
        }),
        {} as TaskFormInput
      ),
    } as CreateTaskInput

    if (isEditing) {
      return (
        taskToEdit?.id &&
        updateTask({
          variables: {
            input: {
              taskId: taskToEdit.id,
              ...mutationInput,
            },
          },
        })
      )
    } else {
      return createTask({
        variables: {
          input: { ...mutationInput },
        },
      })
    }
  }

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      animation: 'slide_from_bottom',
      headerTitle: () => (
        <Text headingLevel="1" size="lg">
          {isEditing ? t('spaces.tasks.edit.title') : t('spaces.tasks.add.title')}
        </Text>
      ),
      headerTitleAlign: 'center',
      headerBackVisible: isMember ? false : true,
      headerLeft: isMember ? () => <HeaderBackButton onPress={showConfirmationModal} /> : undefined,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [t, isMember, setScreenOptions, showConfirmationModal, isEditing])

  if (isEditing && errorTask) {
    replaceRoute('/404')
    return null
  }

  if (loadingSpace || loadingTask || errorSpace || !space) {
    return <HoliLoader />
  }

  return (
    <PermissionsGuard
      permissionType={PermissionsType.SPACES}
      space={space}
      spaceConnectionType={SpaceUserConnectionType.Member}
      forceRestrict={isEditing ? !isAdmin && !isTaskOwner : false}
      redirectRoute={`/spaces/${spaceIdOrNameParam}`}
    >
      <SpaceFormScreenLayout
        saveButtonDisabled={false}
        showConfirmationModal={confirmationModalVisible}
        toggleConfirmationModal={hideConfirmationModal}
        onSave={onSave}
      >
        <TaskInputForm
          taskInput={taskInput}
          onTaskInputChange={onTaskInputChange}
          validateField={validateField}
          fieldErrors={fieldErrors}
          isEdit
          isAdmin={isAdmin}
        />
      </SpaceFormScreenLayout>
    </PermissionsGuard>
  )
}

export default CreateOrEditTask

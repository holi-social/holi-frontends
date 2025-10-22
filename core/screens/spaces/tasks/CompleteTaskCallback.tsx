import React, { memo, useCallback, useEffect } from 'react'
import { Screen } from '@holi/core/components/Screen'
import { useTaskDetailsData } from '@holi/core/screens/spaces/tasks/useTaskDetailsData/useTaskDetailsData'
import { useLoginState } from '@holi/core/auth/loginState'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { storeWelcomeGoodDeedsCounterModal } from '@holi/core/screens/act/useDisplayWelcomeGoodDeedsCounterModal'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { View, StyleSheet } from 'react-native'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useTranslation } from 'react-i18next'
import { Spacing } from 'holi-bricks/foundations'
import { getLogger } from '@holi/core/helpers/logging'
import { useCompleteReadyToGoTaskMutation } from '@holi/api/graphql/graphql-codegen'

const logger = getLogger('CompleteTaskCallback')

export type CompleteTaskCallbackParams = {
  taskId: string
}

const CompleteTaskCallback = () => {
  const { theme } = useTheme()
  const styles = getStyles(theme)
  const { isLoggedIn } = useLoginState()
  const { navigate } = useRouting()
  const { id, spaceId } = useTaskDetailsData()
  const [completeTask] = useCompleteReadyToGoTaskMutation()
  const { t } = useTranslation()

  const handleCompleteTask = useCallback(async () => {
    if (!id) return

    try {
      await completeTask({ variables: { id } })
      storeWelcomeGoodDeedsCounterModal(true)
    } catch (error) {
      logger.debug('CompleteTaskCallback', 'Failed to complete task', { error })
    } finally {
      // Navigate anyway to the completed task screen to avoid the user being stuck on the callback screen
      // This is a "forced" success scenario only done because an error in this flow is worse than not registering the task completion
      navigate(`/spaces/${spaceId}/tasks/${id}/completed`)
    }
  }, [id, spaceId, completeTask, navigate])

  useEffect(() => {
    if (!isLoggedIn) {
      // go back to the complete task screen with the authentication flow
      navigate(`/spaces/${spaceId}/tasks/${id}/complete`)
    } else if (id) {
      handleCompleteTask()
    }
  }, [isLoggedIn, spaceId, id, navigate, handleCompleteTask])

  return (
    <Screen
      preset="fixed"
      style={styles.container}
      headerOptions={{
        headerBackVisible: false,
        headerTitleAlign: 'center',
        title: t('tasks.register.unlogged.header'),
      }}
    >
      <View style={styles.loaderContainer}>
        <HoliLoader testID="loader" />
      </View>
    </Screen>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background20,
    },
    loaderContainer: {
      paddingTop: Spacing['4xl'],
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  })

export default memo(CompleteTaskCallback)

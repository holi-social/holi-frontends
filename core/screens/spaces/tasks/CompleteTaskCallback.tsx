import React, { memo, useCallback, useEffect, useState } from 'react'
import { Screen } from '@holi/core/components/Screen'
import { useTaskDetailsData } from '@holi/core/screens/spaces/tasks/useTaskDetailsData/useTaskDetailsData'
import { useLoginState } from '@holi/core/auth/loginState'
import { useCompleteTask } from '@holi/core/screens/spaces/tasks/useCompleteTask'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { storeWelcomeGoodDeedsCounterModalVisibility } from '@holi/core/screens/act/useDisplayWelcomeGoodDeedsCounterModalVisibility'
import HoliLoader, { useLoader } from '@holi/ui/components/molecules/HoliLoader'
import { View, StyleSheet } from 'react-native'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useTranslation } from 'react-i18next'
import { Spacing } from 'holi-bricks/foundations'
import { getLogger } from '@holi/core/helpers/logging'

const logger = getLogger('CompleteTaskCallback')

export type CompleteTaskCallbackParams = {
  taskId: string
}

const CompleteTaskCallback = () => {
  const { theme } = useTheme()
  const styles = getStyles(theme)
  const { isLoggedOut } = useLoginState()
  const { showLoader, hideLoader } = useLoader()
  const { navigate } = useRouting()
  const { data, id, spaceId } = useTaskDetailsData()
  const { completeTask } = useCompleteTask()
  const { t } = useTranslation()
  const [completed, setCompleted] = useState(false)

  const handleCompleteTask = useCallback(async () => {
    if (!id) return

    try {
      showLoader()
      await completeTask(id)
      storeWelcomeGoodDeedsCounterModalVisibility(true)
      navigate(`/spaces/${spaceId}/tasks/${id}/completed`)
    } catch (error) {
      logger.debug('CompleteTaskCallback', 'Failed to complete task', { error })
      // Handle error if needed
    } finally {
      hideLoader()
    }
  }, [id, spaceId, completeTask, navigate, showLoader, hideLoader])

  useEffect(() => {
    // Only run when user is logged in and we have the task ID
    if (!isLoggedOut && id && data && !completed) {
      handleCompleteTask()
      setCompleted(true)
    }
  }, [isLoggedOut, id, data, handleCompleteTask, completed])

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

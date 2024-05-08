import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useLoginModal } from '@holi/core/providers/LoginModalProvider'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Pencil } from '@holi/icons/src/generated'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'

const CreatePostButton: React.FC = () => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const styles = useMemo(() => getStyles(), [])
  const { openLoginModal } = useLoginModal()

  const { isLoggedIn } = useAuth()

  const navigateToCreatePost = useCallback(() => {
    if (!isLoggedIn) {
      openLoginModal({
        title: t('individuals.post.login.title'),
        description: t('individuals.post.login.text'),
      })
    } else {
      navigate('/createPost')
    }
  }, [navigate, openLoginModal, t, isLoggedIn])

  return (
    <View style={styles.floatingContainer}>
      <HoliContainer flexDirection="row" justifyContent="flex-end">
        <View>
          <HoliButton
            label={t('individuals.post.create.title')}
            testID="create-post-button"
            inline
            style={styles.button}
            onPress={() => {
              navigateToCreatePost()
            }}
          >
            <HoliIcon icon={Pencil} size={24} />
          </HoliButton>
        </View>
      </HoliContainer>
    </View>
  )
}

export default CreatePostButton

const getStyles = () =>
  StyleSheet.create({
    floatingContainer: {
      ...Platform.select({
        web: {
          position: 'fixed',
          bottom: dimensions.bottomBarHeight,
        },
        native: {
          position: 'absolute',
          bottom: 0,
        },
      }),
      left: 0,
      right: 0,
    },
    button: {
      position: 'absolute',
      bottom: Spacing.xxs,
      right: 0,
      marginRight: -4,
      borderRadius: 28,
      borderWidth: 1,
      paddingHorizontal: 14,
      paddingVertical: 14,
    },
  })

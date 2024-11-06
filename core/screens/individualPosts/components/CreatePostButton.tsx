import React, { PropsWithChildren, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSignupModal } from '@holi/core/providers/SignupModalProvider'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Pencil } from '@holi/icons/src/generated'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'

export const ButtonFloatingWrapper = (props: PropsWithChildren) => (
  <View {...props} style={styles.floatingButtonWrapper} />
)

const CreatePostButton: React.FC = () => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { openSignupModal } = useSignupModal()

  const { isLoggedIn } = useLoggedInUser()

  const navigateToCreatePost = useCallback(() => {
    if (!isLoggedIn) {
      openSignupModal({
        title: t('individuals.post.login.title'),
        description: t('individuals.post.login.text'),
        trackTrigger: 'CREATE_POST',
      })
    } else {
      navigate('/feed-posts/create')
    }
  }, [navigate, openSignupModal, t, isLoggedIn])

  return (
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
  )
}

export default CreatePostButton

const styles = StyleSheet.create({
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
  floatingButtonWrapper: {
    ...Platform.select({
      web: {
        position: 'fixed',
        bottom: dimensions.bottomBarHeight,
        zIndex: 9999,
      },
      native: {
        position: 'absolute',
        bottom: 0,
      },
    }),
    left: 0,
    right: 0,
  },
})

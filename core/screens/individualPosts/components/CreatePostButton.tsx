import type React from 'react'
import type { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import { Pencil } from '@holi/icons/src/generated'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'
import { ButtonIcon } from 'holi-bricks/components/button'
import useAuthRequiredNavigation from '@holi/core/navigation/hooks/useAuthRequiredNavigation'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { TrackingEvent } from '@holi/core/tracking'

export const ButtonFloatingWrapper = (props: PropsWithChildren) => (
  <View {...props} style={styles.floatingButtonWrapper} />
)

const CreatePostButton: React.FC = () => {
  const { t } = useTranslation()
  const { navigateWithAuth } = useAuthRequiredNavigation()
  const { track } = useTracking()

  return (
    <HoliContainer flexDirection="row" justifyContent="flex-end">
      <View style={styles.button}>
        <ButtonIcon
          label={t('individuals.post.create.title')}
          testID="create-post-button"
          onPress={() => {
            track(TrackingEvent.FeedPosts.feedPostCreateStart)
            navigateWithAuth('/feed-posts/create', {
              title: t('individuals.post.login.title'),
              description: t('individuals.post.login.text'),
              trackTrigger: 'CREATE_POST',
            })
          }}
          icon={Pencil}
          size="lg"
        />
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
    paddingHorizontal: 14,
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

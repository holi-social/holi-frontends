import type React from 'react'
import type { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Pencil } from '@holi/icons/src/generated'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'
import useAuthRequiredNavigation from '@holi/core/navigation/hooks/useAuthRequiredNavigation'

export const ButtonFloatingWrapper = (props: PropsWithChildren) => (
  <View {...props} style={styles.floatingButtonWrapper} />
)

const CreatePostButton: React.FC = () => {
  const { t } = useTranslation()
  const { navigateWithAuth } = useAuthRequiredNavigation()

  return (
    <HoliContainer flexDirection="row" justifyContent="flex-end">
      <View>
        <HoliButton
          label={t('individuals.post.create.title')}
          testID="create-post-button"
          inline
          style={styles.button}
          onPress={() => {
            navigateWithAuth('/feed-posts/create', {
              title: t('individuals.post.login.title'),
              description: t('individuals.post.login.text'),
              trackTrigger: 'CREATE_POST',
            })
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

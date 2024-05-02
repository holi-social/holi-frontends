import React, { useMemo } from 'react'
import { Platform, StyleSheet, View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ImageAdd } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export const PostCreationBar = ({
  onCreatePost,
  submitting,
  isSubmittable,
}: {
  onCreatePost: () => void
  submitting: boolean
  isSubmittable: boolean
}) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getPostCreationBarStyles(theme), [theme])

  return (
    <View style={styles.menuContainer}>
      <View style={styles.items}>
        <HoliButton transparent label={'Add Image'} inline onPress={() => alert('image comes here')}>
          <HoliIcon icon={ImageAdd} style={styles.addImageIcon} />
        </HoliButton>
        <HoliButtonLoading
          label={'Post'}
          inline
          variant="small"
          onPress={onCreatePost}
          style={styles.roundSubmitButton}
          loading={submitting}
          disabled={!isSubmittable}
        >
          <HoliText bold>Post</HoliText>
        </HoliButtonLoading>
      </View>
    </View>
  )
}
const getPostCreationBarStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    menuContainer: {
      padding: 12,
      borderTopWidth: 1,
      borderTopColor: theme.colors.gray100,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      ...Platform.select({
        web: {
          position: 'absolute',
          bottom: 0,
          width: '100%',
        },
        android: {
          position: 'absolute',
          bottom: 0,
          width: '100%',
        },
      }),
      backgroundColor: theme.colors.background10,
    },
    roundSubmitButton: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 500,
      borderWidth: 1,
    },
    addImageIcon: {
      paddingLeft: 2,
    },
    items: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: dimensions.breakpointM,
    },
  })

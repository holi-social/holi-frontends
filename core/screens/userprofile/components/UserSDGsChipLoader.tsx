import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { UserSDGsChipForm } from '@holi/core/screens/userprofile/components/UserSDGsChipForm'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import type { User } from '@holi/core/domain/shared/types'
import { useUserSDGs } from '@holi/core/screens/userprofile/components/hooks/useUserSDGs'

interface UserSDGsChipLoaderProps {
  user?: User | null
  onSubmit?: (user: User) => void
}

export const UserSDGsChipLoader = ({ user, onSubmit }: UserSDGsChipLoaderProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const {
    filterString,
    onFilterStringChange,
    sdgs,
    onSDGSelect,
    onSubmit: submitHandler,
    loading,
  } = useUserSDGs({ user, onSubmit })

  const notificationComponent = user ? null : (
    <View style={styles.notification}>
      <HoliText>{t('user.profileView.noUser')}</HoliText>
    </View>
  )

  return (
    <HoliModalContentWrapper
      actionButtonText={t('user.profileForm.save')}
      onActionButtonPress={submitHandler}
      headlineText={t('user.sdgs.form.headline')}
      prependChildren={notificationComponent}
      hideFooterWhenKeyboardIsOpen={true}
      style={styles.modalWrapper}
      loading={loading}
      testID="user-profile-chipform"
    >
      <HoliBox padding={[0, 24]}>
        <UserSDGsChipForm
          filterString={filterString}
          onFilterStringChange={onFilterStringChange}
          terms={sdgs}
          onTermSelect={onSDGSelect}
        />
      </HoliBox>
    </HoliModalContentWrapper>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    modalWrapper: {
      flex: 1,
    },
    notification: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 16,
      zIndex: 10,
      backgroundColor: theme.colors.background10,
    },
  })

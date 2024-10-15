import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { UseUserChipsOptions, useUserChips } from '@holi/core/helpers/useUserChips'
import UserChipForm from '@holi/core/screens/userprofile/components/UserChipForm'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

type UserChipLoaderProps = UseUserChipsOptions

const UserChipLoader = ({ user, queryToUse, onSubmit, keyInUserObject, color }: UserChipLoaderProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const {
    filterString,
    onFilterStringChange,
    terms,
    onTermSelect,
    onSubmit: submitHandler,
    loading,
  } = useUserChips({ user, queryToUse, onSubmit, keyInUserObject })

  const notificationComponent = user ? null : (
    <View style={styles.notification}>
      <HoliText>{t('user.profileView.noUser')}</HoliText>
    </View>
  )

  return (
    <HoliModalContentWrapper
      actionButtonText={t('user.profileForm.save')}
      onActionButtonPress={submitHandler}
      headlineText={t(`user.${keyInUserObject}.form.headline`)}
      prependChildren={notificationComponent}
      hideFooterWhenKeyboardIsOpen={true}
      style={styles.modalWrapper}
      loading={loading}
      testID="user-profile-chipform"
    >
      <HoliBox padding={[0, 24]}>
        <UserChipForm
          filterString={filterString}
          onFilterStringChange={onFilterStringChange}
          terms={terms}
          onTermSelect={onTermSelect}
          keyInUserObject={keyInUserObject}
          color={color}
        />
      </HoliBox>
    </HoliModalContentWrapper>
  )
}

export default UserChipLoader

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

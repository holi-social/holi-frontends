import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Platform, ScrollView, StyleSheet, View } from 'react-native'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import { HoliTextLink } from '@holi/core/navigation/components/HoliTextLink'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Emotion, Service, ShieldStar, UserHeart } from '@holi/icons/src/generated'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { useOnboardingFinishModalState } from '@holi/core/screens/onboarding/hooks/useOnboardingFinishModalState'
import { DocumentModal, useDocumentModal } from '@holi/core/screens/onboarding/components/DocumentModal'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Button } from 'holi-bricks/components/button'
import { Text } from 'holi-bricks/components/text'
import { Spacing } from 'holi-bricks/foundations'

const isWeb = Platform.OS === 'web'

const icons = [UserHeart, Emotion, Service, ShieldStar]

interface Props {
  testID?: string
}

export const OnboardingFinishModal = ({ testID = 'community-guidelines-modal' }: Props) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = getStyles(theme)
  const { bottom } = useSafeAreaInsets()
  const { user } = useLoggedInUser()

  const { visible, hide } = useOnboardingFinishModalState()
  const { show: showDocModal, modalProps } = useDocumentModal()

  const legalDocPath = isWeb ? '/profile/settings/legalDocuments/document' : 'onboarding/legalDocuments'

  return (
    <HoliModal label="" shown={visible} style={styles.modal} testID={testID}>
      <ScrollView>
        <HoliContainer>
          <HoliGap size="m" />
          <View style={{ alignItems: 'center' }}>
            <HoliLocalImage
              imageSource={require('@holi/ui/assets/img/icons/give-five-big.svg')}
              width={165}
              height={127}
              label={''}
              isSvg
            />
          </View>

          <HoliGap size="s" />
          <Text size="xxl" textAlign="center">
            {t('onboarding.communityGuidelines.heading', { userName: user?.firstName })}
          </Text>

          <HoliBox padding={[Spacing.md, 0]}>
            <Text size="md" color="support">
              {t('onboarding.communityGuidelines.description')}
            </Text>

            <HoliGap size="s" />
            <View style={styles.descriptionList}>
              {icons.map((icon, index) => (
                <View key={index} style={styles.descriptionListItem}>
                  <HoliIcon icon={icon} colorOverride={theme.colors.black300} />
                  <Text size="md">{t(`onboarding.communityGuidelines.description.point_${index}`)}</Text>
                </View>
              ))}
            </View>
          </HoliBox>

          <Text size="md" color="support">
            <Trans t={t} i18nKey={'onboarding.communityGuidelines.readDocument'}>
              <HoliTextLink
                label={t('onboarding.communityGuidelines.term')}
                href={`${legalDocPath}?type=communityGuidelines`}
                onPress={() => {
                  showDocModal('communityGuidelines')
                  return false
                }}
                size="sm"
                external={isWeb}
              />
            </Trans>
          </Text>

          <HoliBox padding={[Spacing.lg, 0, Spacing.xs + bottom, 0]}>
            <Button
              label={t('onboarding.communityGuidelines.acceptButton')}
              onPress={hide}
              testID={`${testID}-btn-submit`}
            />
          </HoliBox>
        </HoliContainer>
      </ScrollView>

      <DocumentModal {...modalProps} />
    </HoliModal>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    modal: {
      backgroundColor: theme.colors.white200,
    },
    descriptionList: {
      flexDirection: 'column',
      gap: Spacing.xxs,
    },
    descriptionListItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing['3xs'],
    },
  })

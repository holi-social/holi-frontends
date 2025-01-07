import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Platform, ScrollView, StyleSheet, View } from 'react-native'

import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import GiveFiveBigPng from '@holi/ui/assets/img/icons/give-five-big.png'
import GiveFiveBig from '@holi/ui/assets/img/icons/give-five-big.svg'
import { Text } from 'holi-bricks/components/text'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { Emotion, Service, ShieldStar, UserHeart } from '@holi/icons/src/generated'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Spacing } from 'holi-bricks/tokens'
import { HoliTextLink } from '@holi/core/navigation/components/HoliTextLink'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
// eslint-disable-next-line no-restricted-imports
import { useOnboardingFinishModalState } from '../hooks/useOnboardingFinishModalState'
// eslint-disable-next-line no-restricted-imports
import { DocumentModal, useDocumentModal } from '../components/DocumentModal'

const isWeb = Platform.OS === 'web'
const isAndroid = Platform.OS === 'android'

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
    <HoliModal label="" show={visible} style={styles.modal} testID={testID}>
      <ScrollView>
        <HoliContainer>
          <HoliGap size="m" />
          <View style={{ alignItems: 'center' }}>
            <HoliLocalImage
              imageSource={isAndroid ? GiveFiveBigPng : GiveFiveBig}
              width={165}
              height={127}
              label={''}
              isSvg={!isAndroid}
            />
          </View>

          <HoliGap size="s" />
          <Text size="xxl" textAlign="center">
            {t('onboarding.communityGuidelines.heading', { userName: user?.firstName })}
          </Text>

          <HoliBox padding={[Spacing.md, 0]}>
            <Text size="md" variant="secondary">
              {t('onboarding.communityGuidelines.description')}
            </Text>

            <HoliGap size="s" />
            <View style={styles.descriptionList}>
              {icons.map((icon, index) => (
                <View key={index} style={styles.descriptionListItem}>
                  <HoliIcon icon={icon} color={theme.colors.black300} />
                  <Text size="md">{t(`onboarding.communityGuidelines.description.point_${index}`)}</Text>
                </View>
              ))}
            </View>
          </HoliBox>

          <Text size="md" variant="secondary">
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
            <HoliButton
              label={t('onboarding.communityGuidelines.acceptButton')}
              onPress={hide}
              testID={`${testID}-btn-submit`}
            >
              {t('onboarding.communityGuidelines.acceptButton')}
            </HoliButton>
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

import type React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import type { User } from '@holi/core/domain/shared/types'
import { useClientWindowDimensions } from '@holi/core/helpers/useClientWindowDimensions'
import useAuthRequiredNavigation from '@holi/core/navigation/hooks/useAuthRequiredNavigation'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import Spacing from '@holi/ui/foundations/Spacing'
import { Button } from 'holi-bricks/components/button'
import { Text } from 'holi-bricks/components/text'
import { BorderRadius } from 'holi-bricks/foundations'
import { breakpoints } from 'holi-bricks/foundations'

interface GetStartedViewProps {
  user?: User
}

const GetStartedView: React.FC<GetStartedViewProps> = () => {
  const { t } = useTranslation()
  const { width: screenWidth } = useClientWindowDimensions()
  const { navigateWithAuth } = useAuthRequiredNavigation()
  const { navigate } = useRouting()

  const aspectRatioSecondImage = 303 / 343
  const aspectRatioThirdImage = 300 / 343

  const imageWidth = (defaultWidth: number) => {
    if (screenWidth < breakpoints.md) return Math.min(screenWidth - 2 * Spacing.md, defaultWidth)
    return defaultWidth
  }

  return (
    <HoliContainer testID="spaces-container" gap={Spacing.md} noPaddingOnSmallViewports noPadding>
      <View style={styles.description(screenWidth)}>
        <View style={styles.text} testID="get-started-view-header">
          <Text headingLevel="2" size="3xl">
            {t('spaces.discover.welcome')}
          </Text>
          <Text size="md">{t('spaces.discover.description')}</Text>
        </View>
        <View style={styles.createSpaceButtonContainer}>
          <Button
            inline
            label={t('spaces.discover.create.button')}
            onPress={() =>
              navigateWithAuth('/spaces/create', {
                description: t('spaces.create.loginRedirect.text'),
                trackTrigger: 'CREATE_SPACE',
              })
            }
            testID="get-started-view-create-button"
          />
          <Button
            inline
            variant="secondary"
            label={t('spaces.discover.explore')}
            onPress={() => navigate('/spaces/explore/')}
            testID="get-started-view-explore-button"
          />
        </View>
      </View>
      {screenWidth < breakpoints.md && (
        <View style={styles.imageContainer}>
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/spaces/discover_spaces_composition.png')}
            resizeMode="contain"
            width={343}
            height={202}
            style={styles.image}
            label=""
          />
        </View>
      )}

      <View style={styles.firstCard(screenWidth)}>
        <View style={styles.cardText(screenWidth)}>
          <Text headingLevel="2" size="3xl">
            {t('spaces.discover.firstcard')}
          </Text>
          <Text size="md">{t('spaces.discover.firstcard.description')}</Text>
        </View>
        <View>
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/spaces/about/third_composition.png')}
            resizeMode="contain"
            width={imageWidth(343)}
            height={imageWidth(343) * aspectRatioSecondImage}
            style={styles.image}
            label=""
          />
        </View>
      </View>

      <View style={styles.secondCard(screenWidth)}>
        <View style={styles.cardText(screenWidth)}>
          <Text headingLevel="2" size="3xl">
            {t('spaces.discover.secondcard')}
          </Text>
          <Text size="md">{t('spaces.discover.secondcard.description')}</Text>
        </View>
        <View>
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/spaces/about/second_composition.png')}
            resizeMode="contain"
            width={imageWidth(343)}
            height={imageWidth(343) * aspectRatioThirdImage}
            style={styles.image}
            label=""
          />
        </View>
      </View>

      <View style={styles.thirdCard}>
        <View style={styles.thirdCardText}>
          <Text headingLevel="2" size="3xl" textAlign="center">
            {t('spaces.discover.thirdcard')}
          </Text>
        </View>
        <View style={styles.thirdCardButtons(screenWidth)}>
          <Button
            label={t('spaces.discover.create.button')}
            inline={screenWidth >= breakpoints.md}
            onPress={() =>
              navigateWithAuth('/spaces/create', {
                description: t('spaces.create.loginRedirect.text'),
                trackTrigger: 'CREATE_SPACE',
              })
            }
            testID="get-started-view-create-button"
            size="lg"
          />
          <Button
            label={t('spaces.discover.explore')}
            inline={screenWidth >= breakpoints.md}
            onPress={() => navigate('/spaces/explore/')}
            testID="get-started-view-explore-button"
            variant="secondary"
            size="lg"
          />
        </View>
      </View>
    </HoliContainer>
  )
}

const styles = StyleSheet.create((theme) => ({
  description: (screenWidth: number) => {
    return {
      gap: Spacing.xs,
      paddingHorizontal: screenWidth < breakpoints.sm ? Spacing.xs : 0,
      paddingTop: Spacing.md,
    }
  },
  text: {
    gap: Spacing['4xs'],
  },
  thirdCardText: {
    paddingHorizontal: Spacing.xs,
  },
  cardText: (screenWidth: number) => {
    return {
      paddingHorizontal: screenWidth < breakpoints.md ? Spacing.md : 0,
      gap: Spacing['4xs'],
      flex: screenWidth < breakpoints.md ? 1 : 1,
    }
  },
  firstCard: (screenWidth: number) => {
    return {
      paddingVertical: Spacing.md,
      paddingHorizontal: screenWidth < breakpoints.md ? 0 : Spacing.md,
      gap: Spacing.lg,
      borderRadius: BorderRadius.xl,
      backgroundColor: theme.colors.decorative.blueDefault,
      flexDirection: screenWidth < breakpoints.md ? 'column' : 'row',
    }
  },
  secondCard: (screenWidth: number) => {
    return {
      paddingVertical: Spacing.md,
      paddingHorizontal: screenWidth < breakpoints.md ? 0 : Spacing.md,
      gap: Spacing.lg,
      borderRadius: BorderRadius.xl,
      backgroundColor: theme.colors.decorative.greenDefault,
      flexDirection: screenWidth < breakpoints.md ? 'column' : 'row-reverse',
    }
  },
  thirdCard: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xl,
    gap: Spacing.lg,
  },
  thirdCardButtons: (screenWidth: number) => {
    return {
      gap: Spacing.xxs,
      paddingHorizontal: Spacing.xs,
      flexDirection: screenWidth < breakpoints.md ? 'column' : 'row',
      alignSelf: screenWidth < breakpoints.md ? 'stretch' : 'center',
    }
  },
  createSpaceButtonContainer: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: Spacing.xxs,
  },
  imageContainer: {
    paddingHorizontal: Spacing.xs,
  },
  image: {
    alignSelf: 'center',
  },
}))

export default GetStartedView

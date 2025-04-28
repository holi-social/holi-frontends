import type React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import type { User } from '@holi/core/domain/shared/types'
import useAuthRequiredNavigation from '@holi/core/navigation/hooks/useAuthRequiredNavigation'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import Spacing from '@holi/ui/foundations/Spacing'
import { Button } from 'holi-bricks/components/button'
import { Text } from 'holi-bricks/components/text'
import { useStyles } from 'holi-bricks/styles'
import { BorderRadius } from 'holi-bricks/foundations'
import { createStyleSheet } from 'holi-bricks/styles'

interface GetStartedViewProps {
  user?: User
}

const GetStartedView: React.FC<GetStartedViewProps> = () => {
  const { t } = useTranslation()
  const { navigateWithAuth } = useAuthRequiredNavigation()
  const { navigate } = useRouting()
  const { styles } = useStyles(stylesheet)

  return (
    <HoliContainer testID="spaces-container" gap={Spacing.md} noPadding>
      <View style={styles.description}>
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

      <View style={styles.firstCard}>
        <View style={styles.cardText}>
          <Text headingLevel="2" size="3xl">
            {t('spaces.discover.firstcard')}
          </Text>
          <Text size="md">{t('spaces.discover.firstcard.description')}</Text>
        </View>
        <View>
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/spaces/about/third_composition.png')}
            resizeMode="contain"
            width={343}
            height={303}
            style={styles.image}
            label=""
          />
        </View>
      </View>

      <View style={styles.secondCard}>
        <View style={styles.cardText}>
          <Text headingLevel="2" size="3xl">
            {t('spaces.discover.secondcard')}
          </Text>
          <Text size="md">{t('spaces.discover.secondcard.description')}</Text>
        </View>
        <View>
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/spaces/about/second_composition.png')}
            resizeMode="contain"
            width={343}
            height={300}
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
        <View style={styles.thirdCardButtons}>
          <Button
            label={t('spaces.discover.create.button')}
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

const stylesheet = createStyleSheet((theme) => ({
  description: {
    gap: Spacing.xs,
    paddingHorizontal: Spacing.xs,
    paddingTop: Spacing.md,
  },
  text: {
    gap: Spacing['4xs'],
  },
  thirdCardText: {
    paddingHorizontal: Spacing.xs,
  },
  cardText: {
    paddingHorizontal: Spacing.md,
    gap: Spacing['4xs'],
  },
  firstCard: {
    paddingVertical: Spacing.md,
    gap: Spacing.lg,
    borderRadius: BorderRadius.xl,
    backgroundColor: theme.colors.decorative.blueDefault,
  },
  secondCard: {
    paddingVertical: Spacing.md,
    gap: Spacing.lg,
    borderRadius: BorderRadius.xl,
    backgroundColor: theme.colors.decorative.greenDefault,
  },
  thirdCard: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xl,
    gap: Spacing.lg,
  },
  thirdCardButtons: {
    gap: Spacing.xxs,
    paddingHorizontal: Spacing.xs,
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
    flex: 1,
    alignSelf: 'center',
  },
}))

export default GetStartedView

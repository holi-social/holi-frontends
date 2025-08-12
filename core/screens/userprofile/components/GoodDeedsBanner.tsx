import { Question } from '@holi/icons/src/generated'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ChipLabel } from 'holi-bricks/components/chips'
import { Image } from 'holi-bricks/components/image'
import { Stack } from 'holi-bricks/components/stack'
import { Text, TextLink } from 'holi-bricks/components/text'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, View } from 'react-native'

export const GoodDeedsBanner = ({ goodDeedsCounter }: { goodDeedsCounter: number }) => {
  const { t } = useTranslation()
  const { styles } = useStyles(stylesheet)

  return (
    <Stack onPress={() => Linking.openURL('https://holi.social/1million')}>
      <Stack
        borderRadius={{ topLeft: 'md', topRight: 'md' }}
        backgroundColor="redDefault"
        overflow="hidden"
        height={205}
        alignSelf="stretch"
      >
        <View style={styles.container}>
          {/* Background image */}
          <Image
            source={require('@holi/ui/assets/img/goodDeeds/campaignGradient.jpg')}
            height={0}
            width={0}
            stretch
            alt={t('oneMioGoodDeeds.hashtag')}
          />

          {/* Overlay */}
          <View style={styles.overlay}>
            <Stack>
              {/* Middle element */}
              <Stack
                backgroundColor="white"
                borderRadius="md"
                borderColor="main"
                borderStyle="solid"
                borderWidth="sm"
                width={250}
                height={100}
                alignItems="center"
                justifyContent="center"
                padding={{ top: '3xs', bottom: '3xs', left: 'xs', right: 'xs' }}
              >
                <Text size="4xl" color="main">
                  {goodDeedsCounter.toLocaleString('de-DE')}
                </Text>
                <Text size="xs" color="support">
                  {t('oneMioGoodDeeds.banner.globalCounter.label')}
                </Text>
              </Stack>

              {/* Top-left chip */}
              <View style={{ position: 'absolute', top: -15, left: -40, zIndex: 1 }}>
                <ChipLabel color="yellow" blackBorder>
                  {t('oneMioGoodDeeds.banner.globalCounter.pill.top')}
                </ChipLabel>
              </View>

              {/* Bottom-right chip */}
              <View style={{ position: 'absolute', bottom: -25, right: -22, zIndex: 1 }}>
                <ChipLabel color="yellow" blackBorder>
                  {t('oneMioGoodDeeds.banner.globalCounter.pill.bottom')}
                </ChipLabel>
              </View>
            </Stack>
          </View>
        </View>
      </Stack>

      <Stack
        borderRadius={{ bottomLeft: 'md', bottomRight: 'md' }}
        backgroundColor="yellowDefault"
        alignContent="center"
        justifyContent="center"
        padding={{ top: '5xs', bottom: '5xs', left: '3xs', right: '3xs' }}
      >
        <Stack direction="row" justifyContent="center" gap="4xs">
          <Stack justifyContent="center" alignItems="center">
            <TextLink size="sm" textAlign="center">
              {t('oneMioGoodDeeds.hashtag')}
            </TextLink>
          </Stack>

          <HoliIcon icon={Question} />
        </Stack>
      </Stack>
      {/* </Stack> */}
    </Stack>
  )
}

const stylesheet = createStyleSheet(() => ({
  container: {
    flex: 1,
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
}))

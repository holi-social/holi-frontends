import type React from 'react'
import type { PropsWithChildren } from 'react'
import { type GestureResponderEvent, Pressable, type Role, View } from 'react-native'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { Stack } from 'holi-bricks/components/stack'
import { Image } from 'holi-bricks/components/image'
import { BorderRadius } from 'holi-bricks/foundations'
import { Text } from 'holi-bricks/components/text'
import { useTranslation } from 'react-i18next'

export interface HoliMoreCardSmallProps {
  onPress: (event: React.SyntheticEvent | GestureResponderEvent) => void
  label?: string
  role: Role
  testID?: string
  hasButton?: boolean
  bgImageSrc?: string
  fixedWidth?: number
}

const HoliMoreCard = ({
  children,
  onPress,
  role,
  testID,
  label = '',
  hasButton = false,
  bgImageSrc,
  fixedWidth,
}: PropsWithChildren<HoliMoreCardSmallProps>) => {
  const { styles } = useStyles(stylesheet)
  const { t } = useTranslation()

  return (
    <Pressable role={role} aria-label={label} accessible onPress={onPress} testID={testID} style={{ flex: 1 }}>
      <Stack
        justifyContent="space-around"
        alignItems="stretch"
        backgroundColor="support"
        borderColor="support"
        borderStyle="solid"
        borderWidth="sm"
        borderRadius="sm"
        padding="3xs"
        flex={1}
        gap="3xs"
      >
        <View style={styles.imageContainer(!!bgImageSrc, fixedWidth)}>
          {bgImageSrc && (
            <Image
              alt={t('global.seeMore.plusIcon.label')}
              source={bgImageSrc}
              width={0}
              height={0}
              resizeMode="cover"
              stretch
            />
          )}
          <View style={styles.image}>
            <Image
              alt={t('global.seeMore.plusIcon.label')}
              source={require('@holi/ui/assets/img/illustrations/plus-circle.svg')}
              width={96}
              height={96}
            />
          </View>
        </View>
        {hasButton ? (
          children
        ) : (
          <Stack padding={{ left: '3xs' }}>
            <Text size="md">{children}</Text>
          </Stack>
        )}
      </Stack>
    </Pressable>
  )
}

export default HoliMoreCard

const stylesheet = createStyleSheet((theme) => ({
  image: {
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  imageContainer: (hasBgImage?: boolean, fixedWidth?: number) => ({
    backgroundColor: !hasBgImage ? theme.colors.decorative.purpleLight : undefined,
    borderRadius: BorderRadius.sm,
    flex: 1,
    width: fixedWidth || '100%',
    overflow: 'hidden',
  }),
}))

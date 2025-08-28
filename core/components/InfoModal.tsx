import type React from 'react'
import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { ShareBox } from '@holi/icons/src/generated'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import type { StaticImageData } from '@holi/ui/components/atoms/HoliLocalImage.shared'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Button } from 'holi-bricks/components/button'

export interface InfoModalProps {
  headline?: string
  items: { [name: string]: InfoModalItemProps }
  shown: boolean
  onDismiss: () => void
  i18nPrefix: string
  testID?: string
}

export type InfoModalItemProps = {
  logo?: InfoModalAssetProps
  wordmark?: InfoModalAssetProps
  url?: string
  headline?: string
  text?: string
  buttonText?: string
}

export type InfoModalAssetProps = {
  src?: StaticImageData
  height?: number
  width?: number
  isSvg?: boolean
}

const InfoModal = ({
  headline,
  items,
  shown = false,
  onDismiss,
  testID = 'info-modal',
  i18nPrefix = '',
}: InfoModalProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const isMultipleItems = Object.keys(items).length > 1

  const itemCard = (itemKey: string) => {
    const item = items[itemKey]
    return (
      <View style={isMultipleItems ? styles.card : null} key={itemKey}>
        <HoliBox padding={isMultipleItems ? 24 : 0} layout={{ alignItems: 'flex-start' }}>
          {!!item.wordmark && !!item.wordmark?.src && (
            <HoliLocalImage
              imageSource={item.wordmark.src}
              isSvg={!!item.wordmark.isSvg}
              label={''}
              width={item.wordmark.width || 100}
              height={item.wordmark.height || 100}
              resizeMode={'contain'}
            />
          )}
          <HoliBox padding={[32, 0, 0, 0]}>
            <HoliHeading level="2" size="l">
              {/*TODO: how to not render for optional props (headline, text, buttonText)? */}
              {t(`${i18nPrefix}.${itemKey}.headline`)}
            </HoliHeading>
          </HoliBox>
          <HoliGap size="s" />
          <HoliText>{t(`${i18nPrefix}.${itemKey}.text`)}</HoliText>
          <HoliBox padding={[32, 0, 0, 0]} layout={{ alignSelf: 'stretch' }}>
            <View style={styles.outlink}>
              <Button
                transparent
                onPress={() => (item.url ? Linking.openURL(item.url) : null)}
                label={t(`${i18nPrefix}.${itemKey}.buttonText`)}
                icon={ShareBox}
              />
            </View>
          </HoliBox>
        </HoliBox>
      </View>
    )
  }

  return (
    <HoliModal
      label={headline ?? ''}
      style={[isMultipleItems ? styles.flexWrapper : null, isMultipleItems ? styles.modal : null]}
      autoHeight={isMultipleItems ? false : undefined}
      relativeHeight={isMultipleItems ? 1 : undefined}
      shown={shown}
      onDismiss={onDismiss}
      testID={testID}
    >
      <HoliModalContentWrapper
        actionButtonText={t('global.gotIt')}
        onActionButtonPress={onDismiss}
        style={isMultipleItems ? styles.flexWrapper : null}
      >
        <HoliBox padding={[24, 24, 32, 24]}>
          <View style={isMultipleItems ? styles.cardContainer : null}>
            {Object.keys(items).map((itemKey) => {
              return itemCard(itemKey)
            })}
          </View>
        </HoliBox>
      </HoliModalContentWrapper>
    </HoliModal>
  )
}

export default memo(InfoModal)

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    flexWrapper: {
      flex: 1,
      flexGrow: 1,
    },
    modal: {
      backgroundColor: theme.colors.background20,
    },
    partnerImage: {
      ...(theme.dark && {
        padding: 7,
        backgroundColor: theme.colors.light,
        borderRadius: 4,
      }),
    },
    cardContainer: {
      gap: 16,
    },
    card: {
      backgroundColor: theme.colors.white100,
      borderRadius: 8,
      borderColor: theme.colors.background30,
      borderWidth: 1,
    },
    outlink: {
      padding: 16,
      borderRadius: 8,
      backgroundColor: theme.colors.background20,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  })

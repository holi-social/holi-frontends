import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StyleSheet, View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ShareBox } from '@holi/icons/src/generated'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import { StaticImageData } from '@holi/ui/components/atoms/HoliLocalImage.shared'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export interface InfoModalProps {
  headline?: string
  items: { [name: string]: InfoModalItemProps }
  shown: boolean
  onDismiss: () => void
  i18nPrefix: string
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

const InfoModal: React.FC<InfoModalProps> = ({
  headline,
  items,
  shown = false,
  onDismiss,
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
            <HoliBox padding={[18, 0]}>
              <HoliLocalImage
                imageSource={item.wordmark.src}
                isSvg={!!item.wordmark.isSvg}
                label={''}
                width={item.wordmark.width || 100}
                height={item.wordmark.height || 100}
                resizeMode={'contain'}
              />
            </HoliBox>
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
            <HoliButton transparent onPress={() => (item.url ? Linking.openURL(item.url) : null)} label={''}>
              <View style={styles.outlink}>
                <HoliText>{t(`${i18nPrefix}.${itemKey}.buttonText`)}</HoliText>
                <HoliIcon icon={ShareBox} />
              </View>
            </HoliButton>
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
      testID={'goodnews-partner-modal'}
    >
      <HoliModalContentWrapper
        actionButtonText={t('volunteering:shared.partner.modal.close')}
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

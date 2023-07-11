/* TODO: Move this component to shared folder to use across all apps
   It would be nice to have a folder @holi-app/shared/components to use
   them across different apps to leverage reusability.
   However, JanOle and Max couldn't get it running on shorthand so we simply use
   it in other apps from volunteering app now
 */
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StyleSheet, View } from 'react-native'

import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import colors from '@holi/ui/styles/globalVars/colors'

import { PartnerProps } from '@holi-apps/volunteering/types'

type PartnerModalProps = {
  headline?: string
  partners: { [name: string]: PartnerProps }
  show: boolean
  onDismiss: () => void
  i18nNamespace: string
}

const PartnerModal: React.VFC<PartnerModalProps> = ({
  headline,
  partners,
  show = false,
  onDismiss,
  i18nNamespace = '',
}: PartnerModalProps) => {
  const { t } = useTranslation()
  const i18nPrefix = (i18nNamespace ? i18nNamespace + ':' : '') + 'listing.partnerModal'
  const isMultiplePartners = Object.keys(partners).length > 1

  const partnerCard = (partnerKey: string) => {
    const partner = partners[partnerKey]
    return (
      <View style={isMultiplePartners ? styles.card : null} key={partnerKey}>
        <HoliBox padding={isMultiplePartners ? 24 : 0} layout={{ alignItems: 'flex-start' }}>
          {!!partner.wordmark && !!partner.wordmark?.src && (
            <HoliBox padding={[18, 0]}>
              <HoliLocalImage
                imageSource={partner.wordmark.src}
                isSvg={partner.wordmark.isSvg}
                label={''}
                width={partner.wordmark.width || 100}
                height={partner.wordmark.height || 100}
                resizeMode={'contain'}
              />
            </HoliBox>
          )}
          <HoliBox padding={[32, 0, 0, 0]}>
            <HoliHeading level="1" size={'large'}>
              {/*TODO: how to not render for optional props (headline, text, buttonText)? */}
              {t(`${i18nPrefix}.${partnerKey}.headline`)}
            </HoliHeading>
          </HoliBox>
          <HoliBox padding={[16, 0, 0, 0]}>
            <HoliText>{t(`${i18nPrefix}.${partnerKey}.text`)}</HoliText>
          </HoliBox>
          <HoliBox padding={[32, 0, 0, 0]} layout={{ alignSelf: 'stretch' }}>
            <HoliButton transparent onPress={() => (partner.url ? Linking.openURL(partner.url) : null)} label={''}>
              <View style={styles.outlink}>
                <HoliText>{t(`${i18nPrefix}.${partnerKey}.buttonText`)}</HoliText>
                <HoliIcon icon={'share-box'} />
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
      style={[styles.flexWrapper, isMultiplePartners ? styles.modal : null]}
      autoHeight={!isMultiplePartners}
      relativeHeight={isMultiplePartners ? 1 : undefined}
      show={show}
      onDismiss={onDismiss}
    >
      <HoliModalContentWrapper
        actionButtonText={t('volunteering:shared.partner.modal.close')}
        onActionButtonPress={onDismiss}
        style={styles.flexWrapper}
      >
        <HoliBox padding={[24, 24, 32, 24]}>
          <View style={isMultiplePartners ? styles.cardContainer : null}>
            {Object.keys(partners).map((partnerKey) => {
              return partnerCard(partnerKey)
            })}
          </View>
        </HoliBox>
      </HoliModalContentWrapper>
    </HoliModal>
  )
}

export default memo(PartnerModal)

const styles = StyleSheet.create({
  flexWrapper: {
    flex: 1,
    flexGrow: 1,
  },
  modal: {
    backgroundColor: colors.background20,
  },
  cardContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: colors.white100,
    borderRadius: 8,
    borderColor: colors.background30,
    borderWidth: 1,
  },
  outlink: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.background20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

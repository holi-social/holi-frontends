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
  text?: string
  buttonText?: string
  partner: PartnerProps
  show: boolean
  onDismiss: () => void
}

const PartnerModal: React.VFC<PartnerModalProps> = ({
  headline,
  text,
  buttonText,
  partner,
  show = false,
  onDismiss,
}: PartnerModalProps) => {
  const { t } = useTranslation()
  return (
    <HoliModal label={headline ?? ''} show={show} onDismiss={onDismiss}>
      <HoliModalContentWrapper
        actionButtonText={t('volunteering:shared.partner.modal.close')}
        onActionButtonPress={onDismiss}
      >
        <HoliBox padding={[24, 24, 32, 24]} layout={{ alignItems: 'flex-start' }}>
          {!!partner.wordmark && !!partner.wordmark.src && (
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
          {!!headline && (
            <HoliBox padding={[32, 0, 0, 0]}>
              <HoliHeading level="1" size={'large'}>
                {headline}
              </HoliHeading>
            </HoliBox>
          )}
          {!!text && (
            <HoliBox padding={[16, 0, 0, 0]}>
              <HoliText>{text}</HoliText>
            </HoliBox>
          )}
          {!!buttonText && (
            <HoliBox padding={[32, 0, 0, 0]} layout={{ alignSelf: 'stretch' }}>
              <HoliButton transparent onPress={() => (partner.url ? Linking.openURL(partner.url) : null)} label={''}>
                <View style={styles.outlink}>
                  <HoliText>{buttonText}</HoliText>
                  <HoliIcon icon={'share-box'} />
                </View>
              </HoliButton>
            </HoliBox>
          )}
        </HoliBox>
      </HoliModalContentWrapper>
    </HoliModal>
  )
}

export default memo(PartnerModal)

const styles = StyleSheet.create({
  outlink: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.background20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

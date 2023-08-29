import React, { useCallback } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Linking, Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { FeatureToggleName, useFeatureToggle } from '@holi/core/helpers/useFeatureToggle'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { FeatureToggleStatus } from '@holi/core/screens/homeFeed/queries'
import { getUrlForSpaceStorage } from '@holi/core/screens/spaces/helpers/urls'
import CollaboratorAreaCard from '@holi/core/screens/spaces/linkHub/components/CollaborationAreaCard'
import { Space } from '@holi/core/screens/spaces/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ExternalLink, FolderOpen, Information, Zzz } from '@holi/icons/src/generated'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import HoliCarousel from '@holi/ui/components/organisms/HoliCarousel'
import { colors } from '@holi/ui/styles/globalVars'

interface StorageWidgetProps {
  space: Space
  style?: StyleProp<ViewStyle>
}

const StorageWidget: React.VFC<StorageWidgetProps> = ({ space, style }) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { visible, show, hide } = useModalState()

  const navigateToStorageScreen = useCallback(() => {
    if (Platform.OS === 'web') {
      Linking.openURL(getUrlForSpaceStorage(space))
    } else {
      navigate(`/spaces/${space.name}/storage`)
    }
  }, [navigate, space])

  const storageWidgetList = [
    {
      label: t('spaces.storage.widget.owncloud.logo'),
      title: t('spaces.storage.widget.owncloud.title'),
      visit: t('spaces.storage.widget.owncloud.link'),
      image: require('@holi/ui/assets/img/logo/owncloud-logo.png'),
      i18nKey: 'spaces.storage.widget.owncloud.text',
      link: 'https://owncloud.com/',
      imageWidth: 120,
      imageHeight: 60,
    },
    {
      label: t('spaces.storage.widget.onlyoffice.logo'),
      title: t('spaces.storage.widget.onlyoffice.title'),
      visit: t('spaces.storage.widget.onlyoffice.link'),
      image: require('@holi/ui/assets/img/logo/onlyoffice-logo.png'),
      i18nKey: 'spaces.storage.widget.onlyoffice.text',
      link: 'https://owncloud.com/onlyoffice',
      imageWidth: 90,
      imageHeight: 70,
    },
  ]

  const { status } = useFeatureToggle(FeatureToggleName.OWNCLOUD_ONLYOFFICE)
  const ftMaintenance = status === FeatureToggleStatus.MAINTENANCE
  if (ftMaintenance) {
    return (
      <CollaboratorAreaCard
        headerLeftIcon={Zzz}
        title={t('global.maintenance.title', { feature: t('spaces.storage.maintenance.feature') })}
        style={style}
        disabled={ftMaintenance}
      >
        <HoliText size="small" style={styles.maintenance}>
          {t('global.maintenance.description')}
        </HoliText>
      </CollaboratorAreaCard>
    )
  }

  return (
    <CollaboratorAreaCard
      headerLeftIcon={FolderOpen}
      headerRightIcon={Information}
      title={t('spaces.storage.title')}
      onPressHeaderLeft={navigateToStorageScreen}
      onPressHeaderRight={show}
      headerRightButtonLabel={t('spaces.digitalToolKit.add.button.label')}
      style={style}
    >
      <HoliButton
        style={styles.container}
        transparent
        label={t('spaces.storage.widget.description')}
        onPress={navigateToStorageScreen}
      >
        <HoliText size="small" style={styles.descriptionText}>
          {t('spaces.storage.widget.description')}
        </HoliText>
        <HoliText size="small" style={styles.instruction}>
          {t('spaces.storage.widget.instruction')}
        </HoliText>
      </HoliButton>

      <HoliModal label={t('spaces.storage.widget.owncloud.modal')} show={visible} onDismiss={hide}>
        <HoliModalContentWrapper
          actionButtonText={t('global.gotIt')}
          onActionButtonPress={hide}
          style={styles.modalContainer}
        >
          <HoliCarousel
            marginHorizontal={20}
            slides={storageWidgetList.map((widget) => ({
              children: (
                <View style={styles.carouselContainer}>
                  <HoliLocalImage
                    imageSource={widget.image}
                    label={widget.label || ''}
                    width={widget.imageWidth || 120}
                    height={widget.imageHeight || 60}
                    resizeMode="contain"
                    style={styles.image}
                  />
                  <HoliHeading level="1">{widget.title}</HoliHeading>
                  <HoliText style={styles.text}>
                    <Trans t={t} i18nKey={widget.i18nKey}>
                      <HoliText bold />
                    </Trans>
                  </HoliText>
                  <HoliButton label={widget.visit || ''} transparent onPress={() => Linking.openURL(widget.link || '')}>
                    <View style={styles.link}>
                      <HoliText>{widget.visit}</HoliText>
                      <HoliIcon icon={ExternalLink} />
                    </View>
                  </HoliButton>
                </View>
              ),
            }))}
          />
        </HoliModalContentWrapper>
      </HoliModal>
    </CollaboratorAreaCard>
  )
}

export default StorageWidget

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: 8,
    paddingBottom: 16,
    marginTop: 24,
  },
  maintenance: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  instruction: {
    marginTop: 12,
    alignSelf: 'center',
    color: colors.foreground30,
  },
  descriptionText: {
    textAlign: 'center',
    color: colors.foreground20,
  },
  carouselContainer: {
    width: '100%',
    flex: 1,
    flexGrow: 1,
    ...Platform.select({
      web: {
        paddingHorizontal: 24,
      },
      native: {
        paddingHorizontal: 20,
      },
    }),
    justifyContent: 'space-between',
  },
  modalContainer: {
    paddingBottom: 20,
  },
  image: {
    alignSelf: 'flex-start',
    marginBottom: 32,
  },
  link: {
    marginBottom: 32,
    backgroundColor: colors.background20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    padding: 16,
    width: '100%',
  },
  text: {
    marginTop: 16,
    marginBottom: 32,
  },
})

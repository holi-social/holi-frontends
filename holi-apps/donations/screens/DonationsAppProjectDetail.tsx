import { useLazyQuery } from '@apollo/client'
import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { displayError } from '@holi/core/errors/helpers'
import BackButton from '@holi/core/navigation/components/BackButton'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import createParam from '@holi/core/navigation/hooks/useParam'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliReadMore from '@holi/ui/components/molecules/HoliReadMore'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import DonationProgress from '@holi-apps/donations/components/DonationProgress'
import { AppDonationsProjectByIdResponse, projectByIdQuery } from '@holi-apps/donations/queries'
import { Picture } from '@holi-apps/donations/typings'

export type DonationsAppProjectDetailParams = {
  projectId: string
}

const { useParam } = createParam<DonationsAppProjectDetailParams>()

type DonationsAppProjectDetailProps = NativeStackScreenProps<HomeStackScreens>

const DonationsAppProjectDetail: React.VFC<DonationsAppProjectDetailProps> = ({
  navigation,
}: DonationsAppProjectDetailProps) => {
  const [projectId] = useParam('projectId')
  const { t, i18n } = useTranslation()
  const title = t('donations:app.name')

  useNavigationHeader(navigation, {
    title: title,
    headerLeft: () => <BackButton />,
  })

  const mixins = useStyleMixins()

  const { height: deviceHeight } = useWindowDimensions()

  const [fetchProjectById, { loading, data, error }] = useLazyQuery<AppDonationsProjectByIdResponse>(projectByIdQuery)

  const project = data?.appDonations_project

  // TODO: workaround for params always being undefined on initial page load
  // > will probably be solved with ssr
  // see https://github.com/nandorojo/solito/issues/100
  useLayoutEffect(() => {
    if (projectId && !loading && !project) {
      fetchProjectById({
        variables: {
          locale: i18n.language,
          id: Number(projectId),
        },
      })
    }
  }, [fetchProjectById, projectId, loading, project, i18n.language])

  if (!projectId || loading) {
    // TODO: replace with proper loading indicator
    return (
      <View style={[mixins.container, styles.messageContainer]}>
        <HoliText>{t('donations:donationListing.loading')}</HoliText>
      </View>
    )
  }

  if (error) {
    displayError(error, t('donations:donationListing.error'))
  }

  if (!project) {
    return <HoliText>{t('donations:projectDetail.notFound', { projectId })}</HoliText>
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const picture: Picture = (project.picture.find((p) => p.type === 'original') ||
    project.picture.find((p) => p.type === 'small'))!

  const donateButtonLabel = t('donations:projectDetail.donate')

  return (
    <View style={{ alignItems: 'center', backgroundColor: colors.backgroundColorGreyLight }}>
      <DefaultLayout style={{ backgroundColor: colors.backgroundColorGreyLight }}>
        <View style={[mixins.container, styles.container, { minHeight: deviceHeight }]}>
          <Image source={{ uri: picture.url }} style={styles.image} />
          <View style={styles.header}>
            <HoliHeading level="2" size={'large'} testID="donations-project-detail-heading">
              {project.title}
            </HoliHeading>
            <View style={styles.location}>
              <HoliIcon icon="globe" size={20} />
              <HoliText size="small" style={{ marginLeft: 8 }}>
                {project.initiative.city}, {project.initiative.country}
              </HoliText>
            </View>
          </View>
          <DonationProgress
            donationsCount={project.donationsCount}
            progressPercentage={project.progressPercentage}
            openAmountInCents={project.openAmountInCents}
            size="large"
            style={styles.card}
          />
          {/* TODO replace with project initiative card once available */}
          <View style={[styles.card, { paddingVertical: 24 }]}>
            <HoliText size={'large'} bold style={{ marginBottom: 24 }}>
              Quisque vel augue vestibulum, finibus metus a, malesuada sem. Nulla at convallis massa.
            </HoliText>
            <HoliReadMore numberOfLines={5}>
              Nam condimentum est massa. Donec ultrices maximus mauris, id accumsan risus mollis non. Pellentesque ut ex
              mollis, interdum quam vitae, lobortis velit. Sed sed interdum nisi. Integer malesuada ex at arcu consequat
              gravida. Vivamus accumsan nisi a erat tristique condimentum. Phasellus auctor dolor ac pulvinar facilisis.
              Quisque placerat posuere tempor.
            </HoliReadMore>
          </View>
        </View>
      </DefaultLayout>
      <View style={[mixins.container, styles.donateButton]}>
        <HoliButton label={donateButtonLabel}>
          <HoliText bold style={{ marginRight: 8 }}>
            {donateButtonLabel}
          </HoliText>
          <HoliIcon icon="share-box" size={16} />
        </HoliButton>
      </View>
    </View>
  )
}

export default DonationsAppProjectDetail

const styles = StyleSheet.create({
  messageContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  container: {
    paddingBottom: 132,
    paddingHorizontal: 0,
  },
  image: {
    aspectRatio: 375 / 240,
    width: '100%',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    backgroundColor: colors.white,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  card: {
    paddingHorizontal: 24,
    borderRadius: 32,
    backgroundColor: colors.white,
    marginTop: 2,
    paddingVertical: 16,
  },
  donateButton: {
    bottom: 40,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        position: 'absolute',
      },
      android: {
        position: 'absolute',
      },
      default: {
        position: 'fixed',
      },
    }),
  },
})

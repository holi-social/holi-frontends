import { useLazyQuery } from '@apollo/client'
import { displayError } from 'core/errors/helpers'
import { AppDonationsProjectByIdResponse, projectByIdQuery } from 'holi-apps/donations/queries'
import React, { useLayoutEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Image, Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
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

  const { setNavigationHeader, clearNavigationHeader } = useNavigationHeader()
  const { t, i18n } = useTranslation()
  const title = t('apps.donations.detail.title')
  const mixins = useStyleMixins()

  const { height: deviceHeight } = useWindowDimensions()

  const [fetchProjectById, { loading, data, error }] = useLazyQuery<AppDonationsProjectByIdResponse>(projectByIdQuery)

  const project = data?.appDonations_project

  // TODO: workaround for params always being undefined on initial page load
  // > will probably be solved with ssr
  // see https://github.com/nandorojo/solito/issues/100
  useLayoutEffect(() => {
    console.debug('projectId', projectId, 'loading', loading, 'project', project)
    if (projectId && !loading && !project) {
      console.debug('fetchProjectById()')
      fetchProjectById({
        variables: {
          locale: i18n.language,
          id: Number(projectId),
        },
      })
    }
  }, [fetchProjectById, projectId, loading, project, i18n.language])

  useLayoutEffect(() => {
    setNavigationHeader(title, {
      headerLeft: () => <BackButton />,
    })
    return clearNavigationHeader
  }, [navigation, projectId, title, setNavigationHeader, clearNavigationHeader])

  if (!projectId || loading) {
    // TODO: replace with proper loading indicator
    return (
      <View style={[mixins.container, styles.messageContainer]}>
        <HoliText>{t('donations.donationListing.loading')}</HoliText>
      </View>
    )
  }

  if (error) {
    displayError(error, t('donations.donationListing.error'))
  }

  if (!project) {
    return <HoliText>{t('apps.donations.detail.notFound', { projectId })}</HoliText>
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const picture: Picture = (project.picture.find((p) => p.type === 'original') ||
    project.picture.find((p) => p.type === 'small'))!

  return (
    <>
      <DefaultLayout style={{ backgroundColor: colors.backgroundColorGreyLight }}>
        <View style={[mixins.container, styles.container, { minHeight: deviceHeight }]}>
          <Image source={{ uri: picture.url }} style={styles.images} />
          <View style={styles.header}>
            <HoliHeading level="2" size={'large'}>
              {project.title}
            </HoliHeading>
            <View style={styles.location}>
              <HoliIcon icon="globe" size={20} />
              <HoliText size="small" style={{ marginLeft: 8 }}>
                {project.carrier.city}, {project.carrier.country}
              </HoliText>
            </View>
          </View>
          {/* TODO update to organism once API is available */}
          <View style={styles.donationStats}>
            <View style={styles.donationStatsHeader}>
              <View style={styles.donationStatsHeaderSection}>
                <HoliText size={'small'} style={{ color: colors.fontColorGrey, marginLeft: 8 }}>
                  <Trans t={t} i18nKey="apps.donations.label" values={{ count: project.donationsCount }} />
                </HoliText>
              </View>
            </View>
            <DonationProgress
              donationsCount={project.donationsCount}
              progressPercentage={project.progressPercentage}
              openAmountInCents={project.openAmountInCents}
              bold
              hideDonationsCount={true}
              style={{ marginTop: 8 }}
            />
          </View>
          {/* TODO replace with project initiative card once available */}
          <View style={styles.DonationsAppProjectDetails}>
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
        <HoliButton label={t('apps.donations.detail.donate')}>
          <HoliText bold style={{ marginRight: 8 }}>
            {t('apps.donations.detail.donate')}
          </HoliText>
          <HoliIcon icon="external-link" size={16} />
        </HoliButton>
      </View>
    </>
  )
}

export default DonationsAppProjectDetail

const styles = StyleSheet.create({
  messageContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  container: {
    paddingBottom: 92,
    paddingHorizontal: 0,
  },
  images: {
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
  donationStats: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 32,
    backgroundColor: colors.white,
    marginTop: 2,
  },
  donationStatsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  donationStatsHeaderSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  donateButton: {
    bottom: 92,
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
  DonationsAppProjectDetails: {
    backgroundColor: colors.white,
    padding: 24,
    borderRadius: 32,
    marginTop: 2,
  },
})

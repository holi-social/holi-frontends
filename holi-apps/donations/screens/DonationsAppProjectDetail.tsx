import { useLazyQuery } from '@apollo/client'
import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

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
import HoliReadMore from '@holi/ui/components/molecules/HoliReadMore'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import DonationButton from '@holi-apps/donations/components/DonationButton'
import DonationImage from '@holi-apps/donations/components/DonationImage'
import DonationInitiativeButton from '@holi-apps/donations/components/DonationInitiativeButton'
import DonationNews from '@holi-apps/donations/components/DonationNews'
import DonationProgress from '@holi-apps/donations/components/DonationProgress'
import { AppDonationsProjectByIdResponse, projectByIdQuery } from '@holi-apps/donations/queries'

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
    // label={t('donations:donationListing.loading')}
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

  const news = [
    {
      title:
        'We send our rescue ship, the SEA-EYE 4, into the Mediterranean in order to help people in distress at sea. But we need donations. Will you help us?',
      description: 'some news 1 text',
      id: '12322475A',
      publishDate: new Date(Date.now() - Math.random()).toDateString(),
      author: {
        avatar: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/768.jpg',
        name: 'Some Dude',
      },
      body: "Bring your owner a dead bird kitty pounce, trip, faceplant you didn't see that no you didn't definitely didn't lick, lick, lick, and preen away the embarrassment kitty time scoot butt on the rug. Pet my belly, you know you want to; seize the hand and shred it! find something else more interesting. Sitting in a box stare at imaginary bug, so i want to go outside let me go outside nevermind inside is better put butt in owner's face or hiss and stare at nothing then run suddenly away for ask to be pet then attack owners hand that box? i can fit in that box. Meow to be let in found somthing move i bite it tail for intrigued by the shower.",
      picture:
        'https://betterplace-assets.betterplace.org/uploads/project/profile_picture/000/014/049/fill_960x500_bp1658244542_photo_2018-01-29_14-05-38.jpg',
      source: 'theguardian.co.uk',
      url: 'https://www.betterplace.org/en/organisations/5147-berliner-obdachlosenhilfe-e-v',
    },
    {
      title: 'Hilfstransport für ukrainische Bevölkerung gestartet',
      description: 'some news 2 text',
      id: '12322475B',
      publishDate: new Date(Date.now() - Math.random()).toDateString(),
      author: {
        avatar: 'someImageUrl',
        name: 'Some Dude',
      },
      body: "Bring your owner a dead bird kitty pounce, trip, faceplant you didn't see that no you didn't definitely didn't lick, lick, lick, and preen away the embarrassment kitty time scoot butt on the rug. Pet my belly, you know you want to; seize the hand and shred it! find something else more interesting. Sitting in a box stare at imaginary bug, so i want to go outside let me go outside nevermind inside is better put butt in owner's face or hiss and stare at nothing then run suddenly away for ask to be pet then attack owners hand that box? i can fit in that box. Meow to be let in found somthing move i bite it tail for intrigued by the shower.",
      url: 'https://www.betterplace.org/en/organisations/5147-berliner-obdachlosenhilfe-e-v',
    },
    {
      title: 'Erste Reaktionen auf die Unruhen in den Nachbarländern betroffener Regionen',
      description: 'some news 3 text',
      id: '12322475C',
      publishDate: new Date(Date.now() - Math.random()).toDateString(),
      author: {
        avatar: 'someImageUrl',
        name: 'Some Dude',
      },
      body: "Bring your owner a dead bird kitty pounce, trip, faceplant you didn't see that no you didn't definitely didn't lick, lick, lick, and preen away the embarrassment kitty time scoot butt on the rug. Pet my belly, you know you want to; seize the hand and shred it! find something else more interesting. Sitting in a box stare at imaginary bug, so i want to go outside let me go outside nevermind inside is better put butt in owner's face or hiss and stare at nothing then run suddenly away for ask to be pet then attack owners hand that box? i can fit in that box. Meow to be let in found somthing move i bite it tail for intrigued by the shower.",
    },
    {
      title: 'Timeline des Chaos',
      description: 'some news 4 text',
      id: '12322475D',
      publishDate: new Date(Date.now() - Math.random()).toDateString(),
      author: {
        avatar: 'someImageUrl',
        name: 'Some Dude',
      },
      body: "Bring your owner a dead bird kitty pounce, trip, faceplant you didn't see that no you didn't definitely didn't lick, lick, lick, and preen away the embarrassment kitty time scoot butt on the rug. Pet my belly, you know you want to; seize the hand and shred it! find something else more interesting. Sitting in a box stare at imaginary bug, so i want to go outside let me go outside nevermind inside is better put butt in owner's face or hiss and stare at nothing then run suddenly away for ask to be pet then attack owners hand that box? i can fit in that box. Meow to be let in found somthing move i bite it tail for intrigued by the shower.",
      url: 'https://www.betterplace.org/en/organisations/5147-berliner-obdachlosenhilfe-e-v',
    },
  ]

  return (
    <View style={{ alignItems: 'center', backgroundColor: colors.backgroundColorGreyLight }}>
      <DefaultLayout style={{ backgroundColor: colors.backgroundColorGreyLight }}>
        <View style={[mixins.container, styles.container, { minHeight: deviceHeight }]}>
          <DonationImage picture={project.picture} label={project.title} style={styles.image} />
          <View style={styles.header}>
            <HoliHeading level="1" size={'large'} testID="donations-project-detail-heading">
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
          <View style={[styles.card, { paddingVertical: 24 }]}>
            <DonationInitiativeButton initiative={project.initiative} />
            <HoliText size={'large'} style={{ marginVertical: 24 }}>
              &ldquo;{project.summary}&rdquo;
            </HoliText>
            <HoliReadMore numberOfLines={5}>{project.description}</HoliReadMore>
          </View>
          <View style={[styles.card, { paddingVertical: 24 }]}>
            <DonationNews totalEntries={4} news={news} />
          </View>
        </View>
      </DefaultLayout>
      <View style={[mixins.container, styles.donateButton]}>
        <DonationButton
          icon="share-box"
          label={t('donations:projectDetail.donate')}
          onPress={() => Linking.openURL(project.donationUrl)}
          testID="donations-project-detail-donate-btn"
        />
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
    ...Platform.select({
      native: {
        maxWidth: '100%',
      },
    }),
  },
  donateButton: {
    bottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    ...Platform.select({
      native: {
        position: 'absolute',
      },
      default: {
        position: 'fixed',
      },
    }),
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
})

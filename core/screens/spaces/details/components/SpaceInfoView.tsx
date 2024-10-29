import { ChipLabel } from 'holi-bricks/components/chips'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import InfoModal from '@holi/core/components/InfoModal'
import { termsBySortNumberComparator } from '@holi/core/domain/shared/types'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import SpaceAvatar from '@holi/core/screens/spaces/components/SpaceAvatar'
import SpacePublicLink from '@holi/core/screens/spaces/components/SpacePublicLink'
import SpaceSection from '@holi/core/screens/spaces/components/SpaceSection'
import SpaceWelcome from '@holi/core/screens/spaces/details/components/SpaceWelcome'
import SpacesHorizontalSlider from '@holi/core/screens/spaces/discover/components/SpacesHorizontalSlider'
import SpacesSeeMore from '@holi/core/screens/spaces/discover/components/SpacesSeeMore'
import { SDG_INFO_MODAL_SOURCES_MAPPING } from '@holi/core/screens/spaces/edit/EditSpace'
import { Space } from '@holi/core/screens/spaces/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowRightS, At, Information, Phone } from '@holi/icons/src/generated'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliBlockItem from '@holi/ui/components/molecules/HoliBlockItem'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import Spacing from '@holi/ui/foundations/Spacing'
import { useTheme } from '@holi/ui/styles/theme'

type SpaceInfoViewProps = {
  space: Space
  style?: StyleProp<ViewStyle>
}

const RELATED_SPACE_CARD_WIDTH = 256

const SpaceInfoView: React.FC<SpaceInfoViewProps> = ({ space, style }: SpaceInfoViewProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { theme } = useTheme()
  const { colors } = theme

  const { show: showInfoModal, hide: closeInfoModal, visible: infoModalVisible } = useModalState()
  const partner = SDG_INFO_MODAL_SOURCES_MAPPING['sdg']

  const sdgs = space.sdgs ? [...space.sdgs].sort(termsBySortNumberComparator) : []

  const links = space.links || []

  const {
    show: showAboutSpacesRelationShipModal,
    hide: hideAboutSpacesRelationShipModal,
    props: aboutSpacesRelationShipModalProps,
  } = useModalState()

  return (
    <View style={style}>
      <SpaceWelcome space={space} />

      {/* Main Space */}
      {!!space.parentSpace && (
        <SpaceSection title={t('spaces.spaceDetails.parentSpace')}>
          <HoliBlockItem
            {...space.parentSpace}
            label={space.parentSpace.title}
            imageElement={<SpaceAvatar space={space} size="large" />}
            users={space.parentSpace.members.data.map((membership) => membership.user)}
            totalUserCount={space.parentSpace.members.totalResults}
            href={`/spaces/${space.parentSpace.id}`}
            testID="main-space-link"
          />
        </SpaceSection>
      )}

      {/* Related Spaces */}
      {!!space.childSpaces?.data.length && (
        <SpaceSection
          title={t('spaces.spaceDetails.relatedSpaces')}
          actionButton={
            space.childSpaces.totalResults > 4 ? (
              <View>
                <HoliLink
                  label={t('spaces.spaceDetails.relatedSpaces.viewAll')}
                  testID="related-spaces-view-all-btn"
                  href={`/spaces/${space.id}/relatedSpaces`}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <HoliText>{t('spaces.spaceDetails.relatedSpaces.viewAll')}</HoliText>
                    <HoliIcon icon={ArrowRightS} size={Spacing.lg} />
                  </View>
                </HoliLink>
              </View>
            ) : undefined
          }
          style={!!space.parentSpace && styles.childSpacesSection}
        >
          <SpacesHorizontalSlider
            cardWidth={RELATED_SPACE_CARD_WIDTH}
            slideGap={8}
            seeMoreButton={
              space.childSpaces.totalResults > 4 ? (
                <SpacesSeeMore
                  style={{ paddingVertical: Spacing['3xs'] }}
                  onPress={() => navigate(`/spaces/${space.id}/relatedSpaces`)}
                  testID={'related-spaces-see-more'}
                />
              ) : undefined
            }
            style={{ width: '100%' }}
            paddingVertical={0}
            testID="related-spaces-slider"
          >
            {space.childSpaces.data.map((space) => (
              <HoliBlockItem
                key={space.id}
                label={space.title}
                title={space.title}
                subtitle={space.location}
                description={space.description}
                imageSrc={space.cover}
                imageBlurhash={space.coverBlurhash}
                users={space.members.data.map((membership) => membership.user)}
                href={`/spaces/${space.name}`}
                size="large"
                totalUserCount={space.members.totalResults}
                cardWidthForImageScaling={RELATED_SPACE_CARD_WIDTH}
                testID="related-space-item"
              />
            ))}
          </SpacesHorizontalSlider>

          <View>
            <HoliGap size="m" />
            <HoliButton
              label={t('spaces.spaceDetails.relatedSpaces.relationship.title')}
              transparent
              onPress={showAboutSpacesRelationShipModal}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <HoliText>{t('spaces.spaceDetails.relatedSpaces.relationship.title')}</HoliText>
                <HoliGap size="xxs" direction="horizontal" />
                <HoliIcon icon={Information} />
              </View>
            </HoliButton>
          </View>

          <HoliModal
            {...aboutSpacesRelationShipModalProps}
            label={t('spaces.spaceDetails.relatedSpaces.relationship.modal.title')}
            testID="about-spaces-relationship-modal"
          >
            <HoliContainer>
              <HoliHeading size="l">{t('spaces.spaceDetails.relatedSpaces.relationship.modal.title')}</HoliHeading>
              <HoliGap size="xs" />
              <HoliText>{t('spaces.spaceDetails.relatedSpaces.relationship.modal.description')}</HoliText>
              <HoliGap size="s" />
              <HoliButton
                label={t('spaces.spaceDetails.relatedSpaces.relationship.modal.close')}
                onPress={hideAboutSpacesRelationShipModal}
              >
                {t('spaces.spaceDetails.relatedSpaces.relationship.modal.close')}
              </HoliButton>
              <HoliGap size="s" />
            </HoliContainer>
          </HoliModal>
        </SpaceSection>
      )}

      {/* Topics */}
      {!!space.topics?.length && (
        <SpaceSection title={t('spaces.spaceDetails.topics')}>
          <View style={styles.listContainer}>
            {space.topics?.map((topic, index) => (
              <ChipLabel key={`topic_${index}`} color="green">
                {topic.title}
              </ChipLabel>
            ))}
          </View>
        </SpaceSection>
      )}

      {/* Location */}
      {space.location && (
        <SpaceSection title={t('spaces.spaceDetails.location')}>
          <HoliText>{space.location}</HoliText>
        </SpaceSection>
      )}

      {/* SDGs */}
      {!!sdgs.length && (
        <SpaceSection title={t('spaces.spaceDetails.sdgs')} infoIcon onPressInfo={showInfoModal}>
          <View style={styles.listContainer}>
            {sdgs.map((sdg, index) => (
              <ChipLabel key={`sdg_${index}`} color="white">{`${sdg.number}. ${sdg.title}`}</ChipLabel>
            ))}
          </View>
          <InfoModal
            items={{ sdg: partner }}
            show={!!infoModalVisible}
            onDismiss={closeInfoModal}
            i18nPrefix={'spaces.input.sdgs.infoModal'}
          />
        </SpaceSection>
      )}

      {/* Contact */}
      {(!!space.contactDescription || !!space.contactEmail || !!space.contactPhone) && (
        <SpaceSection title={t('spaces.spaceDetails.contact')}>
          <View style={styles.contactWrapper}>
            {!!space.contactDescription && <HoliText>{space.contactDescription}</HoliText>}
            {!!space.contactEmail && (
              <View style={styles.contactContainer}>
                <HoliIcon icon={At} color={colors.foreground20} style={styles.contactIcon} />
                <HoliText size="small" bold>
                  {space.contactEmail}
                </HoliText>
              </View>
            )}
            {!!space.contactPhone && (
              <View style={styles.contactContainer}>
                <HoliIcon icon={Phone} color={colors.foreground20} style={styles.contactIcon} />
                <HoliText size="small" bold>
                  {space.contactPhone}
                </HoliText>
              </View>
            )}
          </View>
        </SpaceSection>
      )}

      {/* Links */}
      {!!links.length && (
        <SpaceSection title={t('spaces.spaceDetails.publicLinks')}>
          <View style={styles.listContainer}>
            {links.map((link, index) => (
              <SpacePublicLink key={`link_${index}`} link={link} style={styles.link} />
            ))}
          </View>
        </SpaceSection>
      )}
    </View>
  )
}
export default SpaceInfoView

const styles = StyleSheet.create({
  listContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexShrink: 1,
    gap: Spacing['3xs'],
  },
  link: {
    marginRight: Spacing['sm'],
    marginBottom: Spacing['sm'],
  },
  childSpacesSection: {
    borderTopWidth: 0,
    paddingTop: 0,
  },
  contactIcon: {
    marginRight: 10,
  },
  contactWrapper: {
    flex: 1,
    gap: Spacing['xs'],
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})

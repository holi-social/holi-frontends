import type React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { TextLink } from 'holi-bricks/components/text'

import type { PartnerProps } from '@holi-apps/volunteering/types'
import AvatarPile, { type AvatarPileProps } from 'holi-bricks/components/avatar/AvatarPile'

interface PartnerListInfoRowProps {
  rowText: string
  linkLabel: string
  partners: { [name: string]: PartnerProps }
  onPress?: () => void
}

export const PartnerListInfoRow = ({ rowText, partners, onPress, linkLabel }: PartnerListInfoRowProps) => {
  return (
    <Pressable onPress={onPress} accessibilityLabel={linkLabel}>
      <View style={styles.partnerInfoRow}>
        <AvatarPile
          size="xs"
          margin={{ right: '3xs' }}
          avatars={
            Object.keys(partners)
              .map((partnerKey) => {
                const partner = partners[partnerKey]
                return partner.logo?.src
                  ? {
                      label: partnerKey,
                      source: partner.logo.src,
                    }
                  : undefined
              })
              .filter((avatar) => !!avatar) as AvatarPileProps['avatars']
          }
        />
        <View style={{ flex: 1 }}>
          <TextLink size="md">{rowText}</TextLink>
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  partnerInfoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

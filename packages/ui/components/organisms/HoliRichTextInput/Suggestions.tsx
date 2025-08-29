import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import type { User } from '@holi/core/domain/shared/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { Avatar } from 'holi-bricks/components/avatar'

export type HoliRichTextInputSuggestionsProps = {
  options?: User[]
  onChooseSuggestion: (selectedSuggestion: User) => void
  testID: string
}

const HoliRichTextInputSuggestions: React.FC<HoliRichTextInputSuggestionsProps> = ({
  options = [],
  onChooseSuggestion,
  testID,
}) => {
  const { t } = useTranslation()

  return (
    <View style={[styles.suggestionsContainer]} testID={testID || 'holi-rich-text-input-suggestions'}>
      {options.map((item) => (
        <HoliButton
          key={item.id}
          label={t('comment.suggestionItem.label', { item: item.fullName })}
          transparent
          style={styles.suggestionItem}
          contentStyle={styles.suggestionButton}
          onPress={() => onChooseSuggestion(item)}
          testID={testID ? `${testID}-item` : 'holi-rich-text-input-suggestions-item'}
        >
          <View style={styles.suggestionItemImage}>
            <Avatar
              source={item.avatar}
              label={item.fullName}
              initials={item.avatarLabel}
              imgPlaceholder={item.avatarBlurhash}
              size="xs"
            />
            <HoliText>{item.fullName}</HoliText>
          </View>
        </HoliButton>
      ))}
    </View>
  )
}

const customComparator = (prevProps: HoliRichTextInputSuggestionsProps, nextProps: HoliRichTextInputSuggestionsProps) =>
  nextProps.options === prevProps.options

export default React.memo(HoliRichTextInputSuggestions, customComparator)

const styles = StyleSheet.create({
  suggestionsContainer: {
    width: '100%',
    marginBottom: 24,
  },
  suggestionItem: {
    display: 'flex',
    whiteSpace: 'nowrap',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 7,
    paddingBottom: 7,
  },
  suggestionButton: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  suggestionItemImage: {
    flexDirection: 'column',
    gap: 10,
  },
})

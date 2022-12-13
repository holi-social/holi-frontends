import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import type { User } from '@holi/core/screens/userprofile/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliUserAvatar from '@holi/ui/components/molecules/HoliUserAvatar'

export type HoliRichTextInputSuggestionsProps = {
  options?: User[]
  onChooseSuggestion: (selectedSuggestion: User) => void
  testID: string
}

const HoliRichTextInputSuggestions: React.VFC<HoliRichTextInputSuggestionsProps> = ({
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
          <HoliUserAvatar
            imageSrc={item.avatar}
            label={item.fullName}
            initials={item.avatarLabel}
            defaultColor={item.avatarDefaultColor}
            size="micro"
            style={styles.suggestionItemImage}
          />
          <HoliText>{item.fullName}</HoliText>
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
    marginRight: 10,
  },
})

import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import { colors } from '@holi/ui/styles/globalVars'

const AnswerOption = ({text}: PostPreviewProps) => {
  return (
    <View style={styles.container}>
      {/* Post content */}
      <label>
        <input type="radio" />{' '}
        <HoliRichTextOutput text={text} users={[]} links={[]} allowAllLinks size="default" color="gray300" />
        
      </label>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderWidth: 1,
    borderColor: colors.background30,
    borderRadius: 12,
    backgroundColor: colors.background10,
    margin: 5,
  },
  postTitleLink: {
    marginBottom: 4,
  },
  imageContainer: {
    width: '100%',
  },
  linkPreview: {
    paddingTop: 16,
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
  },
  reactionsBar: {
    paddingTop: 21,
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reactionsLink: {
    height: 'auto',
    display: 'flex',
  },
  noCommentsYetMessage: {
    paddingRight: 24,
    flex: 1,
    marginTop: Platform.OS === 'web' ? 0 : 4,
  },
})

export default AnswerOption

import React, { useState } from 'react'
// import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, TextInput, View, ViewStyle } from 'react-native'

import { userFullName } from '@holi/core/helpers'
import CommentConnector from '@holi/core/screens/comments/CommentConnector'
import { User } from '@holi/core/screens/userprofile/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliUserAvatar from '@holi/ui/components/molecules/HoliUserAvatar'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type CreateCommentProps = {
  user?: User
  style?: StyleProp<ViewStyle>
}

const CreateCommentView: React.VFC<CreateCommentProps> = ({ user, style }) => {
  const [text, setText] = useState('')
  //   const { t } = useTranslation()
  const mixins = useStyleMixins()

  const isWeb = Platform.OS === 'web'

  console.log(user)
  if (!user) return <></>

  const handleTextChange = (inputText: string) => {
    setText(inputText)
  }

  const name = userFullName(user)
  return (
    <View style={[mixins.container, styles.wrapper, style]}>
      <CommentConnector style={styles.commentConnector} />

      <View style={styles.body}>
        <HoliUserAvatar
          imageSrc={user.avatar}
          label={name}
          initials={user.avatarLabel || ''}
          defaultColor={user.avatarDefaultColor || ''}
          size="small"
        />

        {/* Mobile version */}
        {!isWeb && (
          <TextInput
            onChangeText={handleTextChange}
            style={styles.textInput}
            placeholder="Share your thoughts..."
            placeholderTextColor={colors.fontColorGrey}
            multiline
          >
            <HoliText style={[styles.text, (!text && styles.placeholder) || {}]}>{text}</HoliText>
          </TextInput>
        )}

        {/* Web version */}
        {isWeb && (
          <TextInput
            onChangeText={handleTextChange}
            style={styles.textInput}
            placeholder="Share your thoughts..."
            placeholderTextColor={colors.fontColorGrey}
            multiline
            value={text}
          />
        )}
      </View>
      <View style={styles.bottomBar}>
        <HoliButton label="Post" inline style={styles.button}>
          Post
        </HoliButton>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    ...Platform.select({ web: { paddingHorizontal: 20 } }),
  },
  commentConnector: {
    marginTop: 16,
    marginBottom: 32,
    marginHorizontal: 20,
  },
  body: {
    flexDirection: 'row',
  },
  textInput: {
    marginLeft: 18,
    paddingTop: 10,
    flex: 1,
    minHeight: 100,
  },
  text: {
    lineHeight: 20,
  },
  placeholder: {
    color: colors.fontColorGrey,
  },
  bottomBar: {
    height: 50,
    paddingHorizontal: 24,
    borderTopColor: colors.borderColorGrey,
    borderTopWidth: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  button: {
    width: 120,
  },
})

export default CreateCommentView

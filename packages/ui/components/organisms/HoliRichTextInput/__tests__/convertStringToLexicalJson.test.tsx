import { User } from '@holi/core/screens/userprofile/types'
import { convertStringToLexicalJson } from '@holi/ui/components/organisms/HoliRichTextInput/helper/convertStringToLexicalJson'

// Mock data
const mentions: User[] = [
  { id: '1', fullName: 'John Doe', identity: 'test_1', avatarDefaultColor: 'black', avatarLabel: 'JD' },
  { id: '2', fullName: 'Jane Smith', identity: 'test_2', avatarDefaultColor: 'red', avatarLabel: 'JS' },
]

describe('convertStringToLexicalJson', () => {
  it('should convert a simple text string without mentions', () => {
    const inputString = 'Hello world'
    const result = convertStringToLexicalJson(inputString)

    expect(result).toEqual({
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Hello world',
                type: 'text',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    })
  })

  it('should convert a string with a mention at the start', () => {
    const inputString = '@1 how are you'
    const result = convertStringToLexicalJson(inputString, mentions)

    expect(result).toEqual({
      root: {
        children: [
          {
            children: [
              {
                detail: 1,
                format: 0,
                mode: 'segmented',
                style: '',
                text: 'John Doe',
                type: 'mention',
                version: 1,
                userId: '1',
                userName: 'John Doe',
                displayString: '@John Doe',
              },
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: ' how are you',
                type: 'text',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    })
  })

  it('should convert a string with a mention in the middle', () => {
    const inputString = 'Hello @2 world'
    const result = convertStringToLexicalJson(inputString, mentions)

    expect(result).toEqual({
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Hello ',
                type: 'text',
                version: 1,
              },
              {
                detail: 1,
                format: 0,
                mode: 'segmented',
                style: '',
                text: 'Jane Smith',
                type: 'mention',
                version: 1,
                userId: '2',
                userName: 'Jane Smith',
                displayString: '@Jane Smith',
              },
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: ' world',
                type: 'text',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    })
  })

  it('should convert a string with multiple mentions', () => {
    const inputString = 'Hello @1 and @2'
    const result = convertStringToLexicalJson(inputString, mentions)

    expect(result).toEqual({
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Hello ',
                type: 'text',
                version: 1,
              },
              {
                detail: 1,
                format: 0,
                mode: 'segmented',
                style: '',
                text: 'John Doe',
                type: 'mention',
                version: 1,
                userId: '1',
                userName: 'John Doe',
                displayString: '@John Doe',
              },
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: ' and ',
                type: 'text',
                version: 1,
              },
              {
                detail: 1,
                format: 0,
                mode: 'segmented',
                style: '',
                text: 'Jane Smith',
                type: 'mention',
                version: 1,
                userId: '2',
                userName: 'Jane Smith',
                displayString: '@Jane Smith',
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    })
  })

  it('should handle an empty string', () => {
    const inputString = ''
    const result = convertStringToLexicalJson(inputString)

    expect(result).toEqual({
      root: {
        children: [
          {
            children: [],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    })
  })

  it('should handle a string with an unknown mention', () => {
    const inputString = 'Hello @3'
    const result = convertStringToLexicalJson(inputString, mentions)

    expect(result).toEqual({
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Hello @3',
                type: 'text',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    })
  })
})

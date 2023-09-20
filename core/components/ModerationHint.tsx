import fetch from 'cross-fetch'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import { perspectiveKey, perspectiveUrl } from '@holi/core/helpers/config'
import HoliColumn from '@holi/ui/components/atoms/HoliColumn'
import HoliColumns from '@holi/ui/components/atoms/HoliColumns'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { useDebounce } from '@holi/ui/helper/useDebounce'

type PerspectiveAttrKey = 'TOXICITY' | 'INSULT' | 'SEVERE_TOXICITY' | 'PROFANITY' | 'IDENTITY_ATTACK'

interface ModerationScore {
  attributeScores: {
    [key in PerspectiveAttrKey]: {
      spanScores: SpanScore[]
      summaryScore: Score
    }
  }
  languages: PerspectiveLang[]
  detectedLanguages: PerspectiveLang[]
}

interface Score {
  value: number
  type: 'PROBABILITY'
}

interface SpanScore {
  begin: number
  end: number
  score: Score
}

type PerspectiveLang = 'en' | 'de'
const fetchPerspectiveScore = async (lang: PerspectiveLang, text: string): Promise<null | ModerationScore> => {
  const searchParams = new URLSearchParams({
    key: perspectiveKey,
  })

  const url = perspectiveUrl + '?' + searchParams

  const response = await fetch(url, {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: `{
      "comment": { "text": "${text}"},
      "languages": ["${lang}"],
      "requestedAttributes": {
             "TOXICITY": {},
             "SEVERE_TOXICITY": {},
             "IDENTITY_ATTACK": {},
             "INSULT": {},
             "PROFANITY": {},
             "THREAT": {}
            }
      }`,
    method: 'POST',
  })

  if (!response.ok) return null

  const result: ModerationScore = await response.json()

  return result
}

const perspectiveScoreAtom = atom(0)
const setPerspectiveScoreAtom = atom(null, async (_get, set, text: string) => {
  try {
    const perspectiveScore = await fetchPerspectiveScore('en', text)
    set(perspectiveScoreAtom, () => {
      if (perspectiveScore === null) return 0

      return perspectiveScore.attributeScores.TOXICITY.summaryScore.value
    })
  } catch (err) {
    // We reset the value in case we get an error from the fetch call
    set(perspectiveScoreAtom, 0)
    logError(err, 'could not fetch the moderation score to update setPerspectiveScoreAtom', {
      location: 'setPerspectiveScoreAtom',
    })
  }
})

interface Props {
  text: string
}

const ModerationHint = ({ text }: Props) => {
  const perspectiveScore = useAtomValue(perspectiveScoreAtom)
  const setPerspectiveScore = useSetAtom(setPerspectiveScoreAtom)
  const calcPerspectiveScore = useDebounce(async (text: string) => await setPerspectiveScore(text), 1000)

  const showHint = perspectiveScore > 0.7

  useEffect(() => {
    if (text.length < 5) return
    calcPerspectiveScore(text)
  }, [calcPerspectiveScore, text])

  return (
    <View style={[styles.container, showHint && styles.containerVisible]}>
      <HoliColumns>
        <View style={styles.circle} />
        <HoliColumn padding={[0, 6]}>
          <HoliText size="small">Please keep this conversation nice and friendly</HoliText>
        </HoliColumn>
      </HoliColumns>
      {/*<HoliText size="extrasmall">Score: {perspectiveScore}</HoliText>*/}
    </View>
  )
}

export default ModerationHint

const styles = StyleSheet.create({
  container: {
    padding: 16,
    opacity: 0,
  },
  containerVisible: {
    opacity: 1,
  },
  circle: {
    backgroundColor: '#FFC046',
    width: 16,
    height: 16,
    borderRadius: 50,
    alignSelf: 'center',
  },
})

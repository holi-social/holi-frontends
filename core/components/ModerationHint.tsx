import fetch from 'cross-fetch'
import { produce } from 'immer'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import { perspectiveKey, perspectiveUrl } from '@holi/core/helpers/config'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliColumn from '@holi/ui/components/atoms/HoliColumn'
import HoliColumns from '@holi/ui/components/atoms/HoliColumns'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { useDebounce } from '@holi/ui/helper/useDebounce'

type PerspectiveLang = 'en' | 'de'
type PerspectiveAttributes = 'TOXICITY' | 'SEVERE_TOXICITY' | 'INSULT' | 'IDENTITY_ATTACK' | 'PROFANITY' | 'THREAT'

interface PerspectiveScoreResponse {
  attributeScores: {
    [key in PerspectiveAttributes]: {
      spanScores: {
        begin: number
        end: number
        score: PerspectiveScore
      }[]
      summaryScore: PerspectiveScore
    }
  }
  languages: PerspectiveLang[]
  detectedLanguages: PerspectiveLang[]
}

interface PerspectiveScore {
  value: number
  type: 'PROBABILITY'
}

interface CommentScores {
  TOXICITY: number
  SEVERE_TOXICITY: number
  IDENTITY_ATTACK: number
  INSULT: number
  PROFANITY: number
  THREAT: number
}

const isPerspectiveLang = (lang: string): lang is PerspectiveLang => {
  return lang === 'en' || lang === 'de'
}

const getPerspectiveLang = (lang: string): PerspectiveLang => {
  return isPerspectiveLang(lang) ? lang : 'en'
}
async function fetchCommentScores(lang: PerspectiveLang, text: string): Promise<null | PerspectiveScoreResponse> {
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
             "INSULT": {},
             "IDENTITY_ATTACK": {},
             "PROFANITY": {},
             "THREAT": {}
            }
      }`,
    method: 'POST',
  })

  if (!response.ok) return null

  return response.json()
}

const updateCommentScore = produce((scores: CommentScores, incomingScores: PerspectiveScoreResponse) => {
  let scoreKey: keyof typeof scores

  for (scoreKey in scores) {
    const score = scores[scoreKey]
    const incomingScore = incomingScores.attributeScores[scoreKey].summaryScore.value

    if (score === incomingScore) continue

    scores[scoreKey] = incomingScore
  }
})

const initialCommentsScore: CommentScores = {
  TOXICITY: 0,
  SEVERE_TOXICITY: 0,
  INSULT: 0,
  IDENTITY_ATTACK: 0,
  PROFANITY: 0,
  THREAT: 0,
}

const _commentScoresAtom = atom<CommentScores>(initialCommentsScore)
const commentWarningScoresAtom = atom((get) =>
  Object.entries(get(_commentScoresAtom)).filter(([, value]) => value > 0.6)
)

const setCommentScoresAtom = atom(null, async (_get, set, lang: PerspectiveLang, text: string) => {
  try {
    const perspectiveScore = await fetchCommentScores(lang, text)
    if (perspectiveScore === null) return

    set(_commentScoresAtom, (prevScore) => updateCommentScore(prevScore, perspectiveScore))
  } catch (err) {
    set(_commentScoresAtom, (prevModerationScore) => prevModerationScore)
    logError(err, 'could not fetch the moderation score to update setPerspectiveScoreAtom', {
      location: 'setPerspectiveScoreAtom',
    })
  }
})

interface Props {
  text: string
}

const ModerationHint = ({ text }: Props) => {
  const { i18n } = useTranslation()
  const warningScores = useAtomValue(commentWarningScoresAtom)
  const setPerspectiveScore = useSetAtom(setCommentScoresAtom)
  const calcPerspectiveScore = useDebounce(
    async (text: string) => await setPerspectiveScore(getPerspectiveLang(i18n.language), text),
    1000
  )

  const showHint = warningScores.length > 0

  useEffect(() => {
    // Heuristic to not analyze at the beginning when the user is typing
    if (text.length < 5) return
    calcPerspectiveScore(text)
  }, [calcPerspectiveScore, text])

  return (
    <View style={[styles.container, showHint && styles.containerVisible]}>
      <HoliColumns padding={[0, 0, 8, 0]}>
        <View style={styles.circle} />
        <HoliColumn padding={[0, 6]}>
          <HoliText size="small">Please keep this conversation nice and friendly</HoliText>
        </HoliColumn>
      </HoliColumns>
      {warningScores.map(([key, value]) => (
        <HoliBox key={key} padding={[2, 0, 2, 24]}>
          <HoliText size="extrasmall">
            {key} Score: {value}
          </HoliText>
        </HoliBox>
      ))}
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

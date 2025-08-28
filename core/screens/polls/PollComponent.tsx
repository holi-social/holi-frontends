import { useMutation, useQuery } from '@apollo/client'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { logError } from '@holi/core/errors/helpers'
import { useClientWindowDimensions } from '@holi/core/helpers/useClientWindowDimensions'
import { useSignupModal } from '@holi/core/providers/SignupModalProvider'
import PollResults from '@holi/core/screens/polls/components/PollResults'
import PollSelection from '@holi/core/screens/polls/components/PollSelection'
import { voteOnPollMutation } from '@holi/core/screens/polls/mutations'
import { userHasVotedByPollId } from '@holi/core/screens/polls/queries'
import type { Choice, Poll } from '@holi/core/screens/polls/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import userTeam from '@holi/icons/src/generated/UserTeam'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliColumns from '@holi/ui/components/atoms/HoliColumns'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Button } from 'holi-bricks/components/button'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { TrackingEvent } from '@holi/core/tracking'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { breakpoints } from 'holi-bricks/foundations'

export type PollComponentProps = {
  poll: Poll
  type?: 'regular' | 'good_deed'
  bordered?: boolean
  onPress?: () => void
  hideTitle?: boolean
}

const PollComponent = ({ poll, type = 'regular', onPress, bordered = true, hideTitle = false }: PollComponentProps) => {
  const { track } = useTracking()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme, bordered), [theme, bordered])
  const choices = poll?.choices
  const { width: screenWidth } = useClientWindowDimensions()
  const { openSignupModal } = useSignupModal()
  const { isLoading: loadingUser, user } = useLoggedInUser()

  const [loading, setLoading] = useState(true)
  const [selectedAnswerOptions, setSelectedAnswerOptions] = useState<Choice[]>([])
  const [votesSum, setVotesSum] = useState<number>(() => {
    return choices.reduce((acc, choice) => acc + choice.votes, 0)
  })

  const { data: userHasVoted, loading: loadingVote } = useQuery(userHasVotedByPollId, {
    variables: { id: poll.id },
    skip: !user,
    onError: (error) =>
      logError(error, 'Failed to load user votes', {
        location: 'PollComponent.userHasVotedByPollId',
      }),
  })

  const { refetch } = useQuery(userHasVotedByPollId, {
    variables: { id: poll.id },
    skip: !user,
    onError: (error) =>
      logError(error, 'Failed to refetch user votes', {
        location: 'PollComponent.refetch',
      }),
  })

  useEffect(() => {
    if (!loadingUser && !loadingVote) {
      setLoading(false)
    }
  }, [loadingUser, loadingVote])

  const [voteOnPoll] = useMutation(voteOnPollMutation, {
    onError: (error) =>
      logError(error, 'Failed to vote on poll', {
        location: 'PollComponent.voteOnPoll',
      }),
  })

  const sendVote = async () => {
    if (selectedAnswerOptions.length > 0) {
      await voteOnPoll({
        variables: {
          pollId: poll.id,
          choiceIds: selectedAnswerOptions.map((option) => option.id),
        },
      })
      refetch()
      setVotesSum(votesSum + 1)
      track(TrackingEvent.PollVoteSubmitted(poll.id, type))
    }
  }

  const handleSelected = (selectedAnswers: Choice[] | null) => {
    if (!user) {
      return openSignupModal({
        description: t('insight.poll.reaction.loginRedirect.text'),
        trackTrigger: 'POLL_ANSWER_INSIGHT',
      })
    }
    setSelectedAnswerOptions(selectedAnswers || [])
  }

  if (loading) {
    return (
      <View style={styles.loader}>
        <HoliLoader />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {!hideTitle && (
        <HoliButton transparent label={poll.questionText} onPress={onPress} inline>
          <View style={styles.pollTitle}>
            <HoliHeading level="3" size="s">
              {poll.questionText}
            </HoliHeading>
          </View>
        </HoliButton>
      )}

      {!userHasVoted?.userHasVotedByPollId && !!choices ? (
        // if not voted yet
        <PollSelection
          answerOptions={choices}
          onSelected={handleSelected}
          isMultiSelect={poll.isMultiSelect}
          maxChoices={poll.maxChoices}
        />
      ) : (
        // else, show results
        choices.map((choice: Choice) => {
          return (
            <PollResults
              key={choice.id}
              choice={choice}
              votesSum={votesSum}
              selected={selectedAnswerOptions.some((option) => option.id === choice.id)}
            />
          )
        })
      )}

      <View style={styles.bottomBar}>
        <HoliColumns justifyContent="space-between" flexDirection={screenWidth > breakpoints.sm ? 'row' : 'column'}>
          <HoliBox padding={[0, 0, 0, 0]} layout={styles.headlineContainer}>
            <HoliIcon icon={userTeam} size={20} style={styles.icon} />
            <HoliText size={'default'} style={styles.counter}>
              {votesSum} {t('homeFeed.pollComponent.anonymousVotes')}
            </HoliText>
          </HoliBox>
          {!userHasVoted?.userHasVotedByPollId && (
            <View style={screenWidth < breakpoints.sm && styles.button}>
              <Button
                inline={screenWidth > breakpoints.sm}
                disabled={selectedAnswerOptions.length === 0}
                label={t('homeFeed.pollComponent.sendAnswer')}
                onPress={sendVote}
              />
            </View>
          )}
        </HoliColumns>
      </View>
    </View>
  )
}

const getStyles = (theme: HoliTheme, bordered: boolean) =>
  StyleSheet.create({
    container: {
      padding: bordered ? 16 : 0,
      borderWidth: bordered ? 1 : 0,
      borderColor: bordered ? theme.colors.black300 : 'transparent',
      borderRadius: bordered ? 12 : 0,
      backgroundColor: theme.colors.background10,
    },
    pollTitle: {
      marginBottom: 16,
    },
    headlineContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      ...Platform.select({
        web: {
          marginBottom: 0,
        },
        native: {
          marginBottom: 16,
        },
      }),
    },
    icon: {
      marginLeft: 7,
    },
    counter: {
      marginLeft: 8,
      color: theme.colors.foreground20,
    },
    userItemContent: {
      flexShrink: 1,
    },
    bottomBar: {
      marginTop: 16,
    },
    loader: {
      marginVertical: 20,
    },
    button: {
      marginTop: 24,
    },
  })

export default PollComponent

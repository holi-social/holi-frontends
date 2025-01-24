import { useMutation, useQuery } from '@apollo/client'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { logError } from '@holi/core/errors/helpers'
import { useClientWindowDimensions } from '@holi/core/helpers/useClientWindowDimensions'
import { useSignupModal } from '@holi/core/providers/SignupModalProvider'
import PollCompletionMessage from '@holi/core/screens/polls/components/PollCompletionMessage'
import PollResults from '@holi/core/screens/polls/components/PollResults'
import PollSelection from '@holi/core/screens/polls/components/PollSelection'
import { type UpdatePollResponse, updateVotesMutation } from '@holi/core/screens/polls/mutations'
import { userHasVotedByPollId } from '@holi/core/screens/polls/queries'
import type { Choice, Poll } from '@holi/core/screens/polls/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import userTeam from '@holi/icons/src/generated/UserTeam'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliColumns from '@holi/ui/components/atoms/HoliColumns'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Button } from 'holi-bricks/components/button'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { TrackingEvent } from '@holi/core/tracking'

const MIN_VOTES_RESULTS_REVEAL = 5

export type PollComponentProps = {
  poll: Poll
}

const PollComponent = ({ poll }: PollComponentProps) => {
  const { track } = useTracking()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const choices = poll?.choices
  const { width: screenWidth } = useClientWindowDimensions()
  const { openSignupModal } = useSignupModal()
  const { isLoading: loadingUser, user } = useLoggedInUser()

  const [loading, setLoading] = useState(true)
  const [selectedAnswerOption, setSelectedAnswerOption] = useState<Choice | null>()
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

  const [updateVotes] = useMutation<UpdatePollResponse>(updateVotesMutation, {
    onError: (error) =>
      logError(error, 'Failed to update votes of poll', {
        location: 'PollComponent.updateVotes',
      }),
  })

  const sendVote = async () => {
    if (selectedAnswerOption) {
      await updateVotes({
        variables: {
          id: selectedAnswerOption.id,
        },
      })
      refetch()
      setVotesSum(votesSum + 1)
      track(TrackingEvent.PollVoteSubmitted(poll.id))
    }
  }

  const handleSelected = (selectedChoice: Choice | null) => {
    if (!user) {
      return openSignupModal({
        description: t('insight.poll.reaction.loginRedirect.text'),
        trackTrigger: 'POLL_ANSWER_INSIGHT',
      })
    }
    setSelectedAnswerOption(selectedChoice)
  }

  if (loading) {
    return (
      <View style={styles.loader}>
        <HoliLoader />
      </View>
    )
  }

  if (userHasVoted?.userHasVotedByPollId && votesSum < MIN_VOTES_RESULTS_REVEAL) {
    return <PollCompletionMessage />
  }

  return (
    <View style={styles.container}>
      <View style={styles.pollTitle}>
        <HoliHeading level="3" size="s">
          {poll.questionText}
        </HoliHeading>
      </View>

      {!userHasVoted?.userHasVotedByPollId && !!choices ? (
        // if not voted yet
        <PollSelection answerOptions={choices} onSelected={handleSelected} />
      ) : (
        // else, show results
        choices.map((choice: Choice) => {
          return (
            <PollResults
              key={choice.id}
              choice={choice}
              votesSum={votesSum}
              selected={selectedAnswerOption ? choice.id == selectedAnswerOption.id : false}
            />
          )
        })
      )}

      <View style={styles.bottomBar}>
        <HoliColumns
          justifyContent="space-between"
          flexDirection={screenWidth > dimensions.breakpointS ? 'row' : 'column'}
        >
          <HoliBox padding={[0, 0, 0, 0]} layout={styles.headlineContainer}>
            <HoliIcon icon={userTeam} size={20} style={styles.icon} />
            <HoliText size={'default'} style={styles.counter}>
              {votesSum} {t('homeFeed.pollComponent.anonymousVotes')}
            </HoliText>
          </HoliBox>
          {!userHasVoted?.userHasVotedByPollId && (
            <View style={screenWidth < dimensions.breakpointS && styles.button}>
              <Button
                inline={screenWidth > dimensions.breakpointS}
                disabled={!selectedAnswerOption}
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

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      padding: 16,
      borderWidth: 1,
      borderColor: theme.colors.black300,
      borderRadius: 12,
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

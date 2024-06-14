import { useMutation, useQuery } from '@apollo/client'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useClientWindowDimensions } from '@holi/core/helpers/useClientWindowDimensions'
import { useLoginModal } from '@holi/core/providers/LoginModalProvider'
import {
  NotificationsPreferencesResponse,
  notificationsPreferencesQuery,
} from '@holi/core/screens/notifications/queries'
import PollCompletionMessage from '@holi/core/screens/polls/components/PollCompletionMessage'
import PollResults from '@holi/core/screens/polls/components/PollResults'
import PollSelection from '@holi/core/screens/polls/components/PollSelection'
import { UpdatePollResponse, updateVotesMutation } from '@holi/core/screens/polls/mutations'
import { userHasVotedByPollId } from '@holi/core/screens/polls/queries'
import { Choice, Poll } from '@holi/core/screens/polls/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import userTeam from '@holi/icons/src/generated/UserTeam'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliColumns from '@holi/ui/components/atoms/HoliColumns'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type PollComponentProps = {
  poll: Poll
  insightId?: string
}

const PollComponent = ({ poll }: PollComponentProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const choices = poll?.choices
  const { width: screenWidth } = useClientWindowDimensions()
  const { openLoginModal } = useLoginModal()
  const { user } = useLoggedInUser()
  const { displayError } = useErrorHandling()
  const { data: workflowPreferences, loading } = useQuery<NotificationsPreferencesResponse>(
    notificationsPreferencesQuery,
    {
      fetchPolicy: 'network-only',
      skip: !user,
      onError: (error) =>
        displayError(error, 'Failed to load notification preferences', {
          location: 'useNotificationPreferences.notificationsPreferencesQuery',
        }),
    }
  )

  const [voted, setVoted] = useState<boolean>(false)
  const [selectedAnswerOption, setSelectedAnswerOption] = useState<Choice | null>()
  const [votesSum, setVotesSum] = useState<number>(() => {
    return choices.reduce((acc, choice) => acc + choice.votes, 0)
  })

  const [updateVotes] = useMutation<UpdatePollResponse>(updateVotesMutation, {
    onError: (error) => logError(error, 'Failed to update votes of poll', { location: 'PollComponent.updateVotes' }),
  })

  let notificationsEnabled
  if (!user) {
    notificationsEnabled = false
  } else {
    const updates = workflowPreferences?.notifications_preferences.find((entry) => entry.id === 'POLL_UPDATES')
    notificationsEnabled = updates?.preferences?.email || updates?.preferences?.push
  }

  const sendVote = async () => {
    if (selectedAnswerOption) {
      await updateVotes({
        variables: {
          id: selectedAnswerOption.id,
        },
      })
      setVoted(true)
      setVotesSum(votesSum + 1)
    }
  }

  const { data } = useQuery(userHasVotedByPollId, {
    variables: { id: poll.id },
    skip: !user,
  })

  useEffect(() => {
    if (data && data.userHasVotedByPollId) {
      setVoted(true)
    }
  }, [data])

  const handleSelected = (selectedChoice: Choice | null) => {
    if (!user) {
      return openLoginModal({
        description: t('individuals.post.reaction.loginRedirect.text'),
      })
    }
    setSelectedAnswerOption(selectedChoice)
  }

  if (user && loading) {
    return (
      <View style={styles.loader}>
        <HoliLoader />
      </View>
    )
  }

  if (voted && votesSum < 30) {
    return <PollCompletionMessage notificationsEnabled={notificationsEnabled || false} />
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.pollTitle}>
          <HoliHeading level="3" size="s">
            {poll.questionText}
          </HoliHeading>
        </View>

        {!voted && !!choices ? (
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
            {/* number of anonymous votes */}
            <HoliBox padding={[0, 0, 0, 0]} layout={styles.headlineContainer}>
              <HoliIcon icon={userTeam} size={20} style={styles.icon} />
              <HoliText size={'default'} style={styles.counter}>
                {votesSum} {t('homeFeed.pollComponent.anonymousVotes')}
              </HoliText>
            </HoliBox>
            {/* button to submit answer */}
            {!voted && (
              <HoliButton
                inline={screenWidth > dimensions.breakpointS}
                disabled={!selectedAnswerOption}
                label={'submit'}
                onPress={sendVote}
              >
                {t('homeFeed.pollComponent.sendAnswer')}
              </HoliButton>
            )}
          </HoliColumns>
        </View>
      </View>
    </>
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
      marginBottom: 20,
    },
  })

export default PollComponent

import { useMutation, useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import { useClientWindowDimensions } from '@holi/core/helpers/useClientWindowDimensions'
import { useLoginModal } from '@holi/core/providers/LoginModalProvider'
import PollCompletionMessage from '@holi/core/screens/polls/components/PollCompletionMessage'
import PollNotificationMessage from '@holi/core/screens/polls/components/PollNotificationMessage'
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
import { colors } from '@holi/ui/styles/globalVars'
import { dimensions } from '@holi/ui/styles/globalVars'

interface BaseProps {
  poll: Poll
  insightId?: string
}

interface Props extends BaseProps {
  loading?: false
}

export type PollComponentProps = Props

const PollComponent = ({ poll }: PollComponentProps) => {
  const { t } = useTranslation()
  const choices = poll?.choices
  const { width: screenWidth } = useClientWindowDimensions()
  const { openLoginModal } = useLoginModal()
  const { user } = useLoggedInUser()

  const [voted, setVoted] = useState<boolean>(false)
  const [selectedAnswerOption, setSelectedAnswerOption] = useState<Choice | null>()
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false)
  const [votesSum, setVotesSum] = useState<number>(() => {
    return choices.reduce((acc, choice) => acc + choice.votes, 0)
  })

  const [updateVotes] = useMutation<UpdatePollResponse>(updateVotesMutation, {
    onError: (error) => logError(error, 'Failed to update votes of poll', { location: 'PollComponent.updateVotes' }),
  })

  const sendVote = () => {
    setVoted(true)
    setVotesSum(votesSum + 1)
    if (selectedAnswerOption) {
      updateVotes({
        variables: {
          id: selectedAnswerOption.id,
        },
      })
    }
  }

  const { data } = useQuery(userHasVotedByPollId, {
    variables: { id: poll.id },
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

  if (notificationsEnabled && votesSum < 30) {
    return <PollNotificationMessage />
  }

  if (voted && votesSum < 30) {
    return (
      <PollCompletionMessage
        notificationsEnabled={notificationsEnabled}
        onNotificationsEnable={() => {
          setNotificationsEnabled(true)
        }}
      />
    )
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

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderWidth: 1,
    borderColor: colors.black300,
    borderRadius: 12,
    backgroundColor: colors.background10,
  },
  pollTitle: {
    marginBottom: 16,
  },
  headlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 7,
  },
  counter: {
    marginLeft: 8,
    color: colors.foreground20,
  },
  userItemContent: {
    flexShrink: 1,
  },
  bottomBar: {
    marginTop: 16,
  },
})

export default PollComponent

import React from 'react'
import { StyleSheet } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { StarRounded } from '@holi/icons/src/generated'
//import { Notification2 } from '@holi/icons/src/generated'
//import { NotificationSmallFilledSoftPurple } from '@holi/icons/src/generated'
import HoliColumns from '@holi/ui/components/atoms/HoliColumns'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'

//import { useTheme } from '@holi/ui/styles/theme'

const NotEnoughVotesNotification = () => {
  //const notificationIcon = StarRounded

  return (
    <div style={styles.notificationBoxStyle}>
      <div style={styles.notificationContentStyle}>
        <HoliColumns alignItems="center" justifyContent="space-between" padding={[0, 0, 8, 0]}>
          <HoliHeading>Danke für deine Teilnahme!</HoliHeading>
          <HoliIcon icon={StarRounded} size={25} />
        </HoliColumns>
        <HoliText>
          Bist du auch schon gespannt auf die Ergebnisse? Lass dich darüber informieren, sobald Ergebnisse vorliegen.
        </HoliText>
      </div>
    </div>
  )
}

const styles = StyleSheet.create({
  notificationBoxStyle: {
    display: 'flex',
    width: 343,
    height: 176,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    border: '1px solid ' + '#bfbebe',
    borderColor: '#bfbebe',
    borderRadius: 16,
    borderWidth: 1,
    margin: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    position: 'relative',
  },

  notificationContentStyle: {
    flexGrow: 1, // Take up available space
  },

  notificationHeadingStyle: {
    margin: 0, // Remove default margin
    //fontSize: '1.2', // Larger font size
  },

  notificationTextStyle: {
    margin: 0, // Remove default margin
    //fontSize: '0.9em', // Smaller font size
  },
})

export default NotEnoughVotesNotification

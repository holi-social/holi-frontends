import React from 'react'
import { StyleSheet } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Notification2 } from '@holi/icons/src/generated'
import HoliColumns from '@holi/ui/components/atoms/HoliColumns'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

//import { useTheme } from '@holi/ui/styles/theme'

const NotEnoughVotesNotification = () => {
  const notificationIcon = Notification2

  return (
    <div style={styles.notificationBoxStyle}>
      <div style={styles.notificationContentStyle}>
        <HoliColumns alignItems="center" justifyContent="space-between" padding={[0, 0, 8, 0]}>
          <h2 style={styles.notificationHeadingStyle}>Alles klar, du wirst informiert!</h2>
          <HoliIcon icon={notificationIcon} size={25} />
        </HoliColumns>
        <HoliText size="small">
          Wir geben dir Bescheid, sobald die Ergebnisse vorliegen. Bis dahin, schau doch einfach mal in den Diskussionen
          rein.
        </HoliText>
      </div>
    </div>
  )
}

const styles = StyleSheet.create({
  notificationBoxStyle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    border: '1px solid ' + '#BFBEBE',
    //borderWidth: 1,
    borderColor: colors.background30,
    borderRadius: 12,
    //backgroundColor: '#808080',
    margin: 20, // Margin for spacing
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

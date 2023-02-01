import React from 'react'

import HoliWizardContext, { HoliWizardContextType } from '@holi/ui/components/organisms/HoliWizard/HoliWizardContext'

const useWizard = () => {
  const context = React.useContext(HoliWizardContext)
  return context as HoliWizardContextType
}

export default useWizard

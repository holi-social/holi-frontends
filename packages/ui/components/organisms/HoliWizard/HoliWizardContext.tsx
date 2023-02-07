import { createContext } from 'react'

export interface HoliWizardContextType {
  setNextButtonEnabled: (buttonStatus: boolean) => void
}

const HoliWizardContext = createContext<HoliWizardContextType | null>(null)
export default HoliWizardContext

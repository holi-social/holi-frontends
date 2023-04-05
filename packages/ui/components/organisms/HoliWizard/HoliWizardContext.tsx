import { createContext } from 'react'

export interface HoliWizardContextType {
  setNextButtonEnabled: (buttonStatus: boolean) => void
  currentStep: number
}

const HoliWizardContext = createContext<HoliWizardContextType | null>(null)
export default HoliWizardContext

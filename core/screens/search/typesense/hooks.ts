// useTranslation() is exceptionally hard to mock in testing (because of global mock interference)
// so this tiny custom hook can be mocked in testing
import { useTranslation } from 'react-i18next'

export const useUserLanguage = (): string => {
  const {
    i18n: { language },
  } = useTranslation()
  return language
}

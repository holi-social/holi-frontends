import { useCallback } from 'react'

const useTranslate = () => {
  const translate = useCallback((text: string, language = 'default') => {
    // Placeholder for translation logic

    text = 'Hallo, habs übersetzt'
    return text // This should be replaced with the actual translated text
  }, [])

  return translate
}

export default useTranslate

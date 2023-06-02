interface UseCurrentUrl {
  currentUrl: string
}

const useCurrentUrl = (): UseCurrentUrl => {
  return { currentUrl: window.location.href }
}

export default useCurrentUrl

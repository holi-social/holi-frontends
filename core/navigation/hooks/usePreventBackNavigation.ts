// eslint-disable-next-line @typescript-eslint/no-unused-vars
const usePreventBackNavigation = (condition?: boolean) => {
  // For iOS set `gestureEnabled` to `false` in the stack navigation screen opions.
  // No-op implementation for web, as browser back navigation can not be prevented and navigation has to be enforced using other ways.
}

export default usePreventBackNavigation

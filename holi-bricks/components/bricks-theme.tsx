import { useBricks } from 'holi-bricks/hooks/useBricks'
import { useEffect } from 'react'

export const BricksTheme = ({
  children,
  initialTheme = 'light',
}: React.PropsWithChildren<{ initialTheme?: AvailableThemes }>) => {
  const { setActiveTheme } = useBricks()
  useEffect(() => {
    setActiveTheme(initialTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return children
}

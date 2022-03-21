import React from 'react'

// nextjs takes care of the routing configuration. We have this so we can use a shared navigation provider in a shared app provider
export const NavigationProvider: React.FC = ({ children }) => <>{children}</>

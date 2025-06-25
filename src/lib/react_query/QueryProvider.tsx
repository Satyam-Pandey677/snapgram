import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import React from 'react'


const quiryClient = new QueryClient()
export const QueryProvider = ({children} : {children : React.ReactNode}) => {
  return (
    <QueryClientProvider client={quiryClient}>
        {children}
    </QueryClientProvider>
  )
}


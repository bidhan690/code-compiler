"use client"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FC } from 'react'

interface indexProps {
 children?: React.ReactNode
}

const queryClient = new QueryClient()

const Providers: FC<indexProps> = ({children}) => {
  return <>
 <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  </>
}

export default Providers

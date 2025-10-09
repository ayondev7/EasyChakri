"use client"

import { SessionProvider } from "next-auth/react"
import { Toaster } from "react-hot-toast"
import { AuthProvider } from "@/contexts/AuthContext"
import { SavedJobsProvider } from "@/contexts/SavedJobsContext"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SavedJobsProvider>
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#fff',
                  color: '#363636',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
          </SavedJobsProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}
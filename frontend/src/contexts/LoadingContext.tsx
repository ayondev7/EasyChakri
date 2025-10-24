"use client"

import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Loader from '@/components/Loader'

const LoadingContext = createContext<{
  isLoading: boolean
}>({
  isLoading: false,
})

export const useLoading = () => useContext(LoadingContext)

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const initialRender = useRef(true)

  useEffect(() => {
    // Don't show loader on first page load
    if (initialRender.current) {
      initialRender.current = false
      return
    }

    // Route change detected - hide loader
    setIsLoading(false)
  }, [pathname, searchParams])

  useEffect(() => {
    // Listen to all click events on the document
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')
      
      if (link && link.href && !link.target && !link.download) {
        // Check if it's an internal link
        try {
          const url = new URL(link.href, window.location.origin)
          if (url.origin === window.location.origin && url.pathname !== pathname) {
            setIsLoading(true)
          }
        } catch (error) {
          // Invalid URL, ignore
        }
      }
    }

    // Listen to form submissions (for login/register)
    const handleFormSubmit = (e: Event) => {
      const form = e.target as HTMLFormElement
      // Check if form has action attribute or will navigate
      try {
        if (form.action && new URL(form.action).pathname !== pathname) {
          setIsLoading(true)
        }
      } catch (error) {
        // Invalid URL, ignore
      }
    }

    // Listen to browser back/forward
    const handlePopState = () => {
      setIsLoading(true)
    }

    document.addEventListener('click', handleClick, true)
    document.addEventListener('submit', handleFormSubmit, true)
    window.addEventListener('popstate', handlePopState)

    return () => {
      document.removeEventListener('click', handleClick, true)
      document.removeEventListener('submit', handleFormSubmit, true)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [pathname])

  return (
    <LoadingContext.Provider value={{ isLoading }}>
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-gray-900">
          <Loader />
        </div>
      )}
      {children}
    </LoadingContext.Provider>
  )
}

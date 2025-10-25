"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, Briefcase, Building2, MapPinIcon, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSearchSuggestions } from "@/hooks/jobHooks"
import Image from "next/image"

export function SearchBar() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [shouldSearch, setShouldSearch] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  const { data: suggestions, isLoading } = useSearchSuggestions(
    shouldSearch ? searchQuery : "", 
    8
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (shouldSearch && searchQuery.trim().length >= 2 && suggestions?.data && suggestions.data.length > 0) {
      setShowSuggestions(true)
    } else if (shouldSearch && searchQuery.trim().length >= 2 && suggestions?.data && suggestions.data.length === 0 && !isLoading) {
      setShowSuggestions(false)
    }
  }, [shouldSearch, searchQuery, suggestions, isLoading])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (searchQuery.trim().length >= 2) {
      setShouldSearch(true)
      setShowSuggestions(true)
    }
  }

  const handleSuggestionClick = (jobId: string) => {
    setShowSuggestions(false)
    setSearchQuery("")
    router.push(`/jobs/${jobId}`)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setShowSuggestions(false)
    setShouldSearch(false)
  }

  const viewAllResults = () => {
    setShowSuggestions(false)
    setShouldSearch(false)
    
    const params = new URLSearchParams()
    if (searchQuery) params.set("search", searchQuery)
    if (location) params.set("location", location)
    router.push(`/jobs?${params.toString()}`)
  }

  return (
    <div ref={searchRef} className="relative mx-auto max-w-3xl">
      <form onSubmit={handleSearch}>
        <div className="flex flex-col md:flex-row gap-3 p-2 bg-card border border-border rounded-lg shadow-lg">
          <div className="flex-1 flex items-center gap-2 px-3 border-r border-border relative">
            <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <Input
              type="text"
              placeholder="Job title, keywords, or company"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                if (shouldSearch) {
                  setShouldSearch(false)
                  setShowSuggestions(false)
                }
              }}
              onFocus={() => {
                if (shouldSearch && searchQuery.trim().length >= 2 && suggestions?.data && suggestions.data.length > 0) {
                  setShowSuggestions(true)
                }
              }}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="flex-shrink-0 p-1 hover:bg-muted rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
          <div className="flex-1 flex items-center gap-2 px-3">
            <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <Input
              type="text"
              placeholder="City or state"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-5 w-5 mr-2" />
                Search Jobs
              </>
            )}
          </Button>
        </div>
      </form>

      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">
                <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin text-emerald-500" />
                <div className="text-sm">Searching for jobs...</div>
              </div>
            ) : suggestions?.data && suggestions.data.length > 0 ? (
              <>
                {suggestions.data.map((job) => (
                  <button
                    key={job.id}
                    onClick={() => handleSuggestionClick(job.id)}
                    className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                  >
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {job.company.logo ? (
                        <Image
                          src={job.company.logo}
                          alt={job.company.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm line-clamp-1 text-foreground">
                        {job.title}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {job.company.name}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPinIcon className="h-3 w-3" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          {job.type}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
                <div className="px-3 py-2 border-t border-border mt-2">
                  <button
                    onClick={viewAllResults}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    See all results for &quot;{searchQuery}&quot;
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}

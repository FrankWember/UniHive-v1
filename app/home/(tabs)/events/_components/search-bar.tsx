"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  CalendarIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons"
import { User as UserIcon } from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { useDebounce } from "@/hooks/use-debounce"
import { searchEvents } from "@/actions/events"

type SearchResult = {
  id: string
  name: string | null
  type: "event" | "creator"
  creatorName?: string | null
}

export function SearchBar() {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const debouncedQuery = useDebounce(query, 300)
  const [results, setResults] = React.useState<SearchResult[]>([])
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  React.useEffect(() => {
    if (debouncedQuery.length > 0) {
      searchEvents(debouncedQuery).then((searchResults) => {
        setResults(searchResults)
      })
    } else {
      setResults([])
    }
  }, [debouncedQuery])

  const handleSelect = (result: SearchResult) => {
    setOpen(false)
    if (result.type === "event") {
      router.push(`/home/(tabs)/events/${result.id}`)
    } else if (result.type === "creator") {
      router.push(`/home/(tabs)/events?creator=${result.id}`)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="hidden sm:flex text-muted-foreground font-normal justify-between space-x-4 bg-neutral-100 dark:bg-neutral-900 hover:border-stone-700"
      >
        <MagnifyingGlassIcon className="mr-2" />
        Search events...
        <code className="text-muted-foreground rounded p-1 bg-background font-mono text-xs">⌘K</code>
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setOpen(true)}
        className="sm:hidden text-muted-foreground font-normal bg-neutral-100 dark:bg-neutral-900 hover:border-stone-700"
      >
        <MagnifyingGlassIcon height={25} />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search events or creators..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {results.length > 0 && (
            <>
              <CommandGroup heading="Events">
                {results
                  .filter((result) => result.type === "event")
                  .map((result) => (
                    <CommandItem key={result.id} onSelect={() => handleSelect(result)}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <span>{result.name}</span>
                      {result.creatorName && (
                        <span className="ml-2 text-sm text-muted-foreground">
                          by {result.creatorName}
                        </span>
                      )}
                    </CommandItem>
                  ))}
              </CommandGroup>
              <CommandGroup heading="Creators">
                {results
                  .filter((result) => result.type === "creator")
                  .map((result) => (
                    <CommandItem key={result.id} onSelect={() => handleSelect(result)}>
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>{result.name}</span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
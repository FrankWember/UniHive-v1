"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { User as UserIcon, CalendarIcon } from "lucide-react"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { useEvents } from "@/contexts/events-context"

type SearchResult = {
  id: string
  name: string
  type: "event" | "creator"
  creatorName?: string
}

export function SearchBar() {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const router = useRouter()
  const { events, isLoading } = useEvents()

  const results = React.useMemo(() => {
    if (query.length === 0 || isLoading) return []

    const filteredResults: SearchResult[] = [
      ...events
        .filter((event) => event.title.toLowerCase().includes(query.toLowerCase()))
        .map((event) => ({
          id: event.id,
          name: event.title,
          type: "event" as const,
          creatorName: event.creator.name || undefined,
        })),
      ...events
        .map((event) => event.creator)
        .filter((creator, index, self) => self.findIndex((c) => c.id === creator.id) === index)
        .filter((creator) => creator.name && creator.name.toLowerCase().includes(query.toLowerCase()))
        .map((creator) => ({
          id: creator.id,
          name: creator.name!,
          type: "creator" as const,
        })),
    ]
    return filteredResults
  }, [query, events, isLoading])

  const handleSelect = (result: SearchResult) => {
    setOpen(false)
    if (result.type === "event") {
      router.push(`/home/events/${result.id}`)
    } else if (result.type === "creator") {
      router.push(`/home/events?creator=${result.id}`)
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
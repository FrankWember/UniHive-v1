"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  CalendarIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons"

import { User as UserIcon, Tag as TagIcon } from "lucide-react"

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
import { searchServices } from "@/actions/services"

type SearchResult = {
  id: string
  name: string
  type: "service" | "provider" | "category"
  providerName?: string
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
      searchServices(debouncedQuery).then(results => setResults(results as SearchResult[]))
    } else {
      setResults([])
    }
  }, [debouncedQuery])

  const handleSelect = (result: SearchResult) => {
    setOpen(false)
    if (result.type === "service") {
      router.push(`/home/services/${result.id}`)
    } else if (result.type === "provider") {
      router.push(`/home/services/provider/${result.id}`)
    } else if (result.type === "category") {
      router.push(`/home/services?category=${result.name}`)
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
        Search services...
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
          placeholder="Search services, providers, or categories..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {results.length > 0 && (
            <>
              <CommandGroup heading="Services">
                {results
                  .filter((result) => result.type === "service")
                  .map((result) => (
                    <CommandItem key={result.id} onSelect={() => handleSelect(result)}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <span>{result.name}</span>
                      {result.providerName && (
                        <span className="ml-2 text-sm text-muted-foreground">
                          by {result.providerName}
                        </span>
                      )}
                    </CommandItem>
                  ))}
              </CommandGroup>
              <CommandGroup heading="Providers">
                {results
                  .filter((result) => result.type === "provider")
                  .map((result) => (
                    <CommandItem key={result.id} onSelect={() => handleSelect(result)}>
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>{result.name}</span>
                    </CommandItem>
                  ))}
              </CommandGroup>
              <CommandGroup heading="Categories">
                {results
                  .filter((result) => result.type === "category")
                  .map((result) => (
                    <CommandItem key={result.id} onSelect={() => handleSelect(result)}>
                      <TagIcon className="mr-2 h-4 w-4" />
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
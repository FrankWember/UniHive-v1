"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { User as UserIcon, Tag as TagIcon } from "lucide-react"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { useServices } from "@/contexts/services-context"

type SearchResult = {
  id: string
  name: string | null
  type: "service" | "provider" | "category"
  providerName: string | null
}

export function SearchBar() {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const router = useRouter()
  const { services, isLoading } = useServices()

  const results = React.useMemo(() => {
    if (query.length === 0 || isLoading) return []

    const filteredResults: SearchResult[] = [
      ...services
        .filter((service) => service.name.toLowerCase().includes(query.toLowerCase()))
        .map((service) => ({
          id: service.id,
          name: service.name,
          type: "service" as const,
          providerName: service.provider.name,
        })),
      ...services
        .flatMap((service) => service.category)
        .filter((category, index, self) => self.indexOf(category) === index)
        .filter((category) => category.toLowerCase().includes(query.toLowerCase()))
        .map((category) => ({
          id: category,
          name: category,
          type: "category" as const,
          providerName: null,
        })),
      ...services
        .map((service) => service.provider)
        .filter((provider, index, self) => self.findIndex((p) => p.id === provider.id) === index)
        .filter((provider) => provider.name && provider.name.toLowerCase().includes(query.toLowerCase()))
        .map((provider) => ({
          id: provider.id,
          name: provider.name,
          type: "provider" as const,
          providerName: provider.name,
        })),
    ]
    return filteredResults
  }, [query, services, isLoading])

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
                      <MagnifyingGlassIcon className="mr-2 h-4 w-4" />
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
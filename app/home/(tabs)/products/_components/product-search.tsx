"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { User as UserIcon, Tag as TagIcon } from "lucide-react"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { useProducts } from "@/contexts/products-context"

type SearchResult = {
  id: string
  name: string | null
  type: "product" | "seller" | "category"
  sellerName: string | null
}

export function SearchBar() {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const router = useRouter()
  const { products, isLoading } = useProducts()

  const results = React.useMemo(() => {
    if (query.length === 0 || isLoading) return []

    const filteredResults: SearchResult[] = [
      ...products
        .filter((product) => product.name.toLowerCase().includes(query.toLowerCase()))
        .map((product) => ({
          id: product.id,
          name: product.name,
          type: "product" as const,
          sellerName: product.seller.name,
        })),
      ...products
        .flatMap((product) => product.categories)
        .filter((category, index, self) => self.indexOf(category) === index)
        .filter((category) => category.toLowerCase().includes(query.toLowerCase()))
        .map((category) => ({
          id: category,
          name: category,
          type: "category" as const,
          sellerName: null,
        })),
      ...products
        .map((product) => product.seller)
        .filter((seller, index, self) => self.findIndex((s) => s.id === seller.id) === index)
        .filter((seller) => seller.name && seller.name.toLowerCase().includes(query.toLowerCase()))
        .map((seller) => ({
          id: seller.id,
          name: seller.name,
          type: "seller" as const,
          sellerName: seller.name,
        })),
    ]
    return filteredResults
  }, [query, products, isLoading])

  const handleSelect = (result: SearchResult) => {
    setOpen(false)
    if (result.type === "product") {
      router.push(`/home/products/${result.id}`)
    } else if (result.type === "seller") {
      router.push(`/home/products/seller/${result.id}`)
    } else if (result.type === "category") {
      router.push(`/home/products?category=${result.name}`)
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
        Search products...
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setOpen(true)}
        className="sm:hidden text-muted-foreground font-normal bg-neutral-100 dark:bg-neutral-900 hover:border-stone-700"
      >
        <MagnifyingGlassIcon className="h-4 w-4" />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search products, sellers, or categories..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {results.length > 0 && (
            <>
              <CommandGroup heading="Products">
                {results
                  .filter((result) => result.type === "product")
                  .map((result) => (
                    <CommandItem key={result.id} onSelect={() => handleSelect(result)}>
                      <MagnifyingGlassIcon className="mr-2 h-4 w-4" />
                      <span>{result.name}</span>
                      {result.sellerName && (
                        <span className="ml-2 text-sm text-muted-foreground">
                          by {result.sellerName}
                        </span>
                      )}
                    </CommandItem>
                  ))}
              </CommandGroup>
              <CommandGroup heading="Sellers">
                {results
                  .filter((result) => result.type === "seller")
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
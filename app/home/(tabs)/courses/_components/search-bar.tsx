"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons"
import { GraduationCap } from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Course } from "@prisma/client"


export function SearchBar({courses}: {courses: Course[]}) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<Course[]>([])
  const router = useRouter()

  const handleSelect = (result: Course) => {
    setOpen(false)
    router.push(`/home/courses/${result.id}`)
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="hidden sm:flex text-muted-foreground font-normal justify-between space-x-4 bg-neutral-100 dark:bg-neutral-900 hover:border-stone-700"
      >
        <MagnifyingGlassIcon className="mr-2" />
        Search courses...
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
          placeholder="Search your courses..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No courses found.</CommandEmpty>
          {results.length > 0 && (
            <>
              <CommandGroup heading="Courses">
                {results
                  .filter((result) => result.title === query)
                  .map((result) => (
                    <CommandItem key={result.id} onSelect={() => handleSelect(result)}>
                      <GraduationCap className="mr-2 h-4 w-4" />
                      <span>{result.title}</span>
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
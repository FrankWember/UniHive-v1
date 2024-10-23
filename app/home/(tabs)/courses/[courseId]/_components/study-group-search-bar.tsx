"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { Users, BookOpen } from "lucide-react"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { StudyGroup, StudyGroupMember, User } from "@prisma/client"

type SearchResult = {
  id: string
  name: string
}

interface StudyGroupSearchBarProps {
  studyGroups: (StudyGroup & { members: (StudyGroupMember & { user: User })[] })[],
}

export function StudyGroupSearchBar({ studyGroups }: StudyGroupSearchBarProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const router = useRouter()

  const results = React.useMemo(() => {
    if (query.length === 0) return []

    const filteredResults: SearchResult[] = [
      ...studyGroups
        .filter((group) => group.name.toLowerCase().includes(query.toLowerCase()))
        .map((group) => ({
          id: group.id,
          name: group.name,
        })),
    ]
    return filteredResults
  }, [query, studyGroups])

  const handleSelect = (result: SearchResult) => {
    setOpen(false)
    router.push(`/home/courses/study-group/${result.id}`)
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="w-full justify-start text-left font-normal"
      >
        <MagnifyingGlassIcon className="mr-2 h-4 w-4" />
        <span>Search study groups...</span>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search study groups or courses..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {results.length > 0 && (
            <>
              <CommandGroup heading="Study Groups">
                {results.map((result) => (
                    <CommandItem key={result.id} onSelect={() => handleSelect(result)}>
                      <Users className="mr-2 h-4 w-4" />
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
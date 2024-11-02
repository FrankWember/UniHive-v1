"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { useQuery } from '@tanstack/react-query'
import { getCourseUsers } from '@/utils/data/courses'

interface UserSelectProps {
  value: string[]
  onChange: (value: string[]) => void
  courseId: string
}

export function UserSelect({ value, onChange, courseId }: UserSelectProps) {
  const [open, setOpen] = React.useState(false)

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['courseUsers', courseId],
    queryFn: () => getCourseUsers(courseId),
  })

  const toggleUser = (userId: string) => {
    onChange(
      value.includes(userId)
        ? value.filter((id) => id !== userId)
        : [...value, userId]
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value.length > 0
            ? `${value.length} users selected`
            : "Select users..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Search users..." />
          <CommandEmpty>No users found.</CommandEmpty>
          <CommandGroup>
            {users.map((user) => (
              <CommandItem
                key={user.id}
                onSelect={() => toggleUser(user.id)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value.includes(user.id) ? "opacity-100" : "opacity-0"
                  )}
                />
                {user.name}
                <Badge variant="secondary" className="ml-auto">
                  {user.studentId}
                </Badge>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
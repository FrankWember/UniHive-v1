"use client"

import * as React from "react"
import { ChevronsUpDown, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Command, CommandEmpty, CommandGroup,  CommandInput,  CommandItem, CommandList } from "@/components/ui/command"
import { ScrollArea } from "@/components/ui/scroll-area"


export function CategorySelect({
  options = [],
  value = [],
  onChange,
}: {
  options?: { value: string; label: string }[]
  value?: string[]
  onChange: (value: string[]) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [filteredOptions, setFilteredOptions] = React.useState(options)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [customCategory, setCustomCategory] = React.useState("")

  const handleToggle = (categoryValue: string) => {
    const newValue = value.includes(categoryValue)
      ? value.filter(v => v !== categoryValue)
      : [...value, categoryValue]
    onChange(newValue)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setFilteredOptions(
      options?.filter(option =>
        option.label.toLowerCase().includes(query.toLowerCase())
      ) || []
    )
  }

  // const handleAddCustomCategory = () => {
  //   if (customCategory && !options.some(opt => opt.value === customCategory)) {
  //     onChange([...value, customCategory])
  //     setCustomCategory("")
  //   }
  // }

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
            ? `${value.length} categories selected`
            : "Select categories..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <Command>
          <CommandInput
            placeholder="Search categories..."
            value={searchQuery}
            onValueChange={handleSearch}
          />
          <CommandList>
            <CommandEmpty>No categories found.</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-72">
                {filteredOptions && filteredOptions.length > 0 && filteredOptions.map((option) => (
                  <CommandItem key={option.value}>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={option.value}
                        checked={value.includes(option.value)}
                        onCheckedChange={() => handleToggle(option.value)}
                      />
                      <Label htmlFor={option.value}>{option.label}</Label>
                    </div>
                  </CommandItem>
                ))}
                {/* {custom && (
                  <div className="p-2">
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="Add custom category"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                      />
                      <Button size="sm" onClick={handleAddCustomCategory}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )} */}
              </ScrollArea>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}


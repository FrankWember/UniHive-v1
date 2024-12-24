"use client"

import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"



export function CategorySelect({
  options,
  value = [],
  onChange
}: {
  options: { value: string; label: string }[]
  value?: string[]
  onChange: (value: string[]) => void
}) {
  const [open, setOpen] = React.useState(false)

  const handleToggle = (categoryValue: string) => {
    const newValue = value.includes(categoryValue)
      ? value.filter(v => v !== categoryValue)
      : [...value, categoryValue]
    onChange(newValue)
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
            ? `${value.length} categories selected`
            : "Select categories..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <ScrollArea className="h-80">
          <div className="grid gap-4">
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Switch
                  id={option.value}
                  checked={value.includes(option.value)}
                  onCheckedChange={() => handleToggle(option.value)}
                />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </div>
          <ScrollBar />
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
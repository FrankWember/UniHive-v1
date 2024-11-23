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

const defaultCategories = [
  { value: "tutoring", label: "Tutoring" },
  { value: "note-taking", label: "Note Taking" },
  { value: "essay-writing", label: "Essay Writing" },
  { value: "research-assistance", label: "Research Assistance" },
  { value: "programming-help", label: "Programming Help" },
]

export function CategorySelect({
  options,
  value = [],
  onChange
}: {
  options?: { value: string; label: string }[]
  value?: string[]
  onChange: (value: string[]) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [categories, setCategories] = React.useState(options || defaultCategories)
  const [newCategory, setNewCategory] = React.useState("")

  const handleToggle = (categoryValue: string) => {
    const newValue = value.includes(categoryValue)
      ? value.filter(v => v !== categoryValue)
      : [...value, categoryValue]
    onChange(newValue)
  }

  const handleAddCategory = () => {
    if (newCategory && !categories.some(cat => cat.value === newCategory.toLowerCase())) {
      const newCat = { value: newCategory.toLowerCase(), label: newCategory }
      setCategories([...categories, newCat])
      handleToggle(newCat.value)
      setNewCategory("")
    }
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
        <div className="grid gap-4">
          {categories.map((category) => (
            <div key={category.value} className="flex items-center space-x-2">
              <Switch
                id={category.value}
                checked={value.includes(category.value)}
                onCheckedChange={() => handleToggle(category.value)}
              />
              <Label htmlFor={category.value}>{category.label}</Label>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Add new category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddCategory()
                }
              }}
            />
            <Button type="button" size="icon" onClick={handleAddCategory}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
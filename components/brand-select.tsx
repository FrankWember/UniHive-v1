"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Plus } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandList,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

type Brand = {
  name: string
}

type BrandSelectProps = {
  brands?: Brand[]
  selectedBrand: string | null
  onSelectBrand: (brandName: string) => void
}

export function BrandSelect({ brands = [], selectedBrand, onSelectBrand }: BrandSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")
  const [customBrand, setCustomBrand] = React.useState("")

  const filteredBrands = brands?.filter((brand) =>
    brand.name.toLowerCase().includes(searchValue.toLowerCase())
  ) || []

  const handleSelectBrand = (brandName: string) => {
    onSelectBrand(brandName.toLowerCase())
    setOpen(false)
    setSearchValue("")
  }

  const handleAddCustomBrand = () => {
    if (customBrand.trim() !== "") {
      onSelectBrand(customBrand.trim())
      setOpen(false)
      setSearchValue("")
      setCustomBrand("")
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
          {selectedBrand
            ? selectedBrand || customBrand || "1 brand selected"
            : "Select brand..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput 
            placeholder="Search brand..." 
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>
                <div className="p-2">
                <p className="text-sm text-muted-foreground mb-2">No brand found. Add a custom brand?</p>
                <div className="flex items-center space-x-2">
                    <Input
                    placeholder="Enter custom brand"
                    value={customBrand}
                    onChange={(e) => setCustomBrand(e.target.value)}
                    />
                    <Button size="sm" onClick={handleAddCustomBrand}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                </div>
            </CommandEmpty>
            <CommandGroup>
                {filteredBrands && filteredBrands.map((brand) => (
                <CommandItem
                    key={brand.name}
                    onSelect={() => handleSelectBrand(brand.name)}
                >
                    <Check
                    className={cn(
                        "mr-2 h-4 w-4",
                        selectedBrand === brand.name ? "opacity-100" : "opacity-0"
                    )}
                    />
                    {brand.name}
                </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}


"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

// This is a mock function. Replace it with actual data fetching logic.
async function getCategories(): Promise<string[]> {
  return ['Electronics', 'Books', 'Clothing', 'Home & Garden', 'Sports']
}

export function ProductCategories() {
  const [categories, setCategories] = useState<string[]>([])
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category')

  useEffect(() => {
    getCategories().then(setCategories)
  }, [])

  const handleCategoryClick = (category: string) => {
    router.push(`/home/products?category=${encodeURIComponent(category)}`)
  }

  return (
    <ScrollArea className="h-[300px] rounded-md border p-4">
      <h2 className="font-semibold mb-4">Categories</h2>
      <div className="flex flex-col gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={currentCategory === category ? "secondary" : "ghost"}
            className="justify-start"
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </Button>
        ))}
      </div>
    </ScrollArea>
  )
}
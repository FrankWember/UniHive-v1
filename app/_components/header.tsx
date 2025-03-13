"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const yOffset = -64 // Adjust this value based on your header height
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
    setIsOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['features', 'how-it-works', 'testimonials']
      const scrollPosition = window.scrollY + 64 // Adjust this value based on your header height

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { top, bottom } = element.getBoundingClientRect()
          if (top <= scrollPosition && bottom > scrollPosition) {
            document.querySelector(`[href="#${section}"]`)?.classList.add('text-primary')
          } else {
            document.querySelector(`[href="#${section}"]`)?.classList.remove('text-primary')
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b fixed top-0 left-0 right-0 bg-background z-50">
      <Link className="flex items-center justify-center" href="/">
        <Suspense fallback={<Skeleton className="w-40 h-40" />}>
          <Image
            src="/DormBiz.png"
            width={40}
            height={40}
            alt="DormBiz logo"
            className="rounded-lg"
          />
        </Suspense>
        <span className="ml-2 text-2xl font-bold">DormBiz</span>
      </Link>
      <div className="flex items-center space-x-4">
        <nav className="hidden md:flex space-x-4">
          {['features', 'how-it-works', 'testimonials'].map((section) => (
            <Link
              key={section}
              className="text-sm font-medium hover:text-primary transition-colors"
              href={`#${section}`}
              onClick={(e) => {
                e.preventDefault()
                scrollToSection(section)
              }}
            >
              {section.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </Link>
          ))}
        </nav>
        <ThemeSwitcher />
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {['features', 'how-it-works', 'testimonials'].map((section) => (
              <DropdownMenuItem key={section} onSelect={() => scrollToSection(section)}>
                {section.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
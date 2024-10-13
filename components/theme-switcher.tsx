"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun, Laptop } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeSwitcher({mode="default"} : {mode?: "default" | "compact" | "expanded"}) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const themes = [
    { name: "System", value: "system", icon: Laptop },
    { name: "Light", value: "light", icon: Sun },
    { name: "Dark", value: "dark", icon: Moon },
  ]

  return (
    <>
      {mode === "default" && (
        <>
          {/* Mobile: Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {themes.map((t) => (
                <DropdownMenuItem key={t.value} onClick={() => setTheme(t.value)}>
                  <t.icon className="mr-2 h-4 w-4" />
                  {t.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Desktop: 3-option switch */}
          <div className="hidden md:flex border rounded-full">
            {themes.map((t) => (
              <Button
                key={t.value}
                variant={theme === t.value ? "default" : "ghost"}
                size="icon"
                onClick={() => setTheme(t.value)}
                className="rounded-full"
              >
                <t.icon className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">{t.name}</span>
              </Button>
            ))}
          </div>
        </>
      )}

      {mode === "compact" && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {themes.map((t) => (
              <DropdownMenuItem key={t.value} onClick={() => setTheme(t.value)}>
                <t.icon className="mr-2 h-4 w-4" />
                {t.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {mode === "expanded" && (
        <div className="flex border rounded-full">
          {themes.map((t) => (
            <Button
              key={t.value}
              variant={theme === t.value ? "default" : "ghost"}
              size="icon"
              onClick={() => setTheme(t.value)}
              className="rounded-full"
            >
              <t.icon className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">{t.name}</span>
            </Button>
          ))}
        </div>
      )}
    </>
  )
}
"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="flex items-center space-x-2 h-6">
        {/* Placeholder to prevent layout shift */}
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="dark-mode-toggle"
        checked={theme === "dark"}
        onCheckedChange={(checked) => {
          setTheme(checked ? "dark" : "light")
        }}
        aria-label="Toggle dark mode"
      />
      <Label htmlFor="dark-mode-toggle">Mode Gelap</Label>
    </div>
  )
}

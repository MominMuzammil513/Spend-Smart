"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from "next-themes"
import {SessionProvider} from "next-auth/react"
export default function Providers({ children }: ThemeProviderProps) {
  return <SessionProvider><NextThemesProvider  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange>{children}</NextThemesProvider>
  </SessionProvider>
}

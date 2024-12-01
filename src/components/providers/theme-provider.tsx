/**
 * @file src/components/providers/theme-provider.tsx
 * Theme provider component for handling dark/light mode
 */
'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from 'next-themes'

/**
 * ThemeProvider Component
 * Wraps the application with theme context
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

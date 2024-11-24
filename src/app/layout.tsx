/**
 * @file src/app/layout.tsx
 * Root layout component with theme provider and sidebar navigation
 */
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Link from 'next/link'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Sidebar } from '@/components/navigation/sidebar'
import { Toaster } from '@/components/ui/toaster'

// Font configurations
const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900',
})

const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900',
})

// Metadata
export const metadata: Metadata = {
	title: 'WalkingPad Control',
	description: 'Control and monitor your WalkingPad exercise',
	icons: {
		icon: '/favicon.ico',
	},
}

/**
 * RootLayout Component
 * Provides theme support and basic layout structure
 */
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<div className="flex min-h-screen bg-background">
						<Sidebar />
						<main className="flex-1 overflow-auto">
							<div className="container h-full px-4 py-6 lg:px-8">
								{children}
							</div>
						</main>
					</div>
					<Toaster />
					<footer className="fixed bottom-0 right-0 z-50">
						<Link
							href="https://andy-cinquin.com"
							className="flex items-center gap-1 rounded-tl-lg bg-card/80 px-3 py-2 text-xs backdrop-blur-sm transition-colors hover:bg-card"
						>
							Developed with{' '}
							<span role="img" aria-label="heart" className="text-red-500">
								❤️
							</span>{' '}
							by{' '}
							<span className="font-medium hover:underline">Andy Cinquin</span>
						</Link>
					</footer>
				</ThemeProvider>
			</body>
		</html>
	)
}

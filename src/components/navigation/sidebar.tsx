/**
 * @file src/components/navigation/sidebar.tsx
 * Main navigation sidebar component
 */

'use client'

import { cn } from '@/lib/utils'
import { Home, Target, User, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ModeToggle } from '../controls/mode-toggle'

/**
 * Navigation item configuration
 */
interface NavItem {
	title: string
	href: string
	icon: React.ComponentType<{ className?: string }>
	label?: string
}

/**
 * Main navigation items
 */
const navItems: NavItem[] = [
	{
		title: 'Exercise',
		href: '/',
		icon: Home,
		label: 'Start your workout',
	},
	{
		title: 'Goals',
		href: '/goals',
		icon: Target,
		label: 'Track your progress',
	},
	{
		title: 'Profile',
		href: '/profile',
		icon: User,
		label: 'Your information',
	},
	{
		title: 'Settings',
		href: '/settings',
		icon: Settings,
		label: 'Configure device',
	},
]

/**
 * Navigation item component
 */
function NavItem({ item, isActive }: { item: NavItem; isActive: boolean }) {
	return (
		<Link
			href={item.href}
			className={cn(
				'group flex h-16 w-full flex-col items-center justify-center gap-1',
				'rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent',
				isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
			)}
			title={item.label}
		>
			<item.icon className={cn('h-6 w-6', isActive && 'text-primary')} />
			<span className="text-xs">{item.title}</span>
		</Link>
	)
}

/**
 * Sidebar Component
 * Main navigation sidebar with mode toggle
 */
export function Sidebar() {
	const pathname = usePathname()

	return (
		<aside className="flex h-screen w-[72px] flex-col items-center border-r bg-card px-2 py-4">
			<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
				<span className="font-bold text-primary-foreground">WP</span>
			</div>

			<nav className="flex flex-1 flex-col items-center gap-4">
				{navItems.map(item => (
					<NavItem
						key={item.href}
						item={item}
						isActive={
							item.href === '/'
								? pathname === item.href
								: pathname.startsWith(item.href)
						}
					/>
				))}
			</nav>

			<div className="mt-auto">
				<ModeToggle />
			</div>
		</aside>
	)
}

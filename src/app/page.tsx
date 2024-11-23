/**
 * @file src/app/page.tsx
 * Main application component integrating all tabs and navigation
 */

'use client'

import { useState, useEffect } from 'react'
import { Home, User, Target, Timer, Settings } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { WalkingPadMode } from '@/lib/types'
import MeTab from '@/components/MeTab/MeTab'
import MainTab from '@/components/MainTab/MainTab'
import GoalsTab from '@/components/GoalsTab/GoalsTab'

/**
 * Navigation item type definition
 */
interface NavItem {
	id: string
	label: string
	icon: React.ElementType
}

/**
 * Navigation items configuration
 */
const navItems: NavItem[] = [
	{ id: 'main', label: 'Home', icon: Home },
	{ id: 'me', label: 'Profile', icon: User },
	{ id: 'goals', label: 'Goals', icon: Target },
]

/**
 * Tab transition variants for animations
 */
const tabVariants = {
	enter: (direction: number) => ({
		x: direction > 0 ? 1000 : -1000,
		opacity: 0,
	}),
	center: {
		zIndex: 1,
		x: 0,
		opacity: 1,
	},
	exit: (direction: number) => ({
		zIndex: 0,
		x: direction < 0 ? 1000 : -1000,
		opacity: 0,
	}),
}

/**
 * Main application component
 */
export default function App() {
	// State for active tab and navigation
	const [activeTab, setActiveTab] = useState('main')
	const [navigationDirection, setNavigationDirection] = useState(0)
	const [isConnected, setIsConnected] = useState(false)
	const [padMode, setPadMode] = useState<WalkingPadMode>(WalkingPadMode.STANDBY)

	// Effect to handle device connection status
	useEffect(() => {
		const checkConnection = async () => {
			try {
				// TODO: Implement actual device connection check
				console.debug('Checking device connection...')
				setIsConnected(true)
			} catch (error) {
				console.error('Connection error:', error)
				setIsConnected(false)
			}
		}

		checkConnection()
		const interval = setInterval(checkConnection, 5000)
		return () => clearInterval(interval)
	}, [])

	/**
	 * Handle tab change with direction for animations
	 */
	const handleTabChange = (tabId: string) => {
		const currentIndex = navItems.findIndex(item => item.id === activeTab)
		const newIndex = navItems.findIndex(item => item.id === tabId)
		setNavigationDirection(newIndex > currentIndex ? 1 : -1)
		setActiveTab(tabId)
	}

	return (
		<div className="flex h-screen flex-col bg-background text-foreground">
			{/* Connection Status Bar */}
			<div
				className={cn(
					'px-4 py-2 text-center text-sm transition-colors',
					isConnected
						? 'bg-green-500/10 text-green-500'
						: 'bg-red-500/10 text-red-500'
				)}
			>
				{isConnected
					? 'Connected to WalkingPad'
					: 'Disconnected - Trying to connect...'}
			</div>

			{/* Main Content Area */}
			<main className="flex-1 overflow-hidden">
				<AnimatePresence mode="wait" custom={navigationDirection}>
					<motion.div
						key={activeTab}
						custom={navigationDirection}
						variants={tabVariants}
						initial="enter"
						animate="center"
						exit="exit"
						transition={{
							x: { type: 'spring', stiffness: 300, damping: 30 },
							opacity: { duration: 0.2 },
						}}
						className="h-full"
					>
						{activeTab === 'main' && (
							<MainTab
								isConnected={isConnected}
								padMode={padMode}
								onModeChange={setPadMode}
							/>
						)}
						{activeTab === 'me' && <MeTab />}
						{activeTab === 'goals' && <GoalsTab />}
					</motion.div>
				</AnimatePresence>
			</main>

			{/* Bottom Navigation */}
			<nav className="flex items-center justify-around border-t border-border bg-card p-2">
				{navItems.map(({ id, label, icon: Icon }) => (
					<Button
						key={id}
						variant="ghost"
						size="lg"
						className={cn(
							'flex flex-col items-center gap-1 px-6',
							activeTab === id && 'text-primary'
						)}
						onClick={() => handleTabChange(id)}
					>
						<Icon className="h-5 w-5" />
						<span className="text-xs font-medium">{label}</span>
					</Button>
				))}
			</nav>
		</div>
	)
}

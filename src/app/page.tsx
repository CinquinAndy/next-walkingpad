/**
 * @file src/app/page.tsx
 * Main application component with updated design
 */

'use client'

import { useState } from 'react'
import { Home, User, Target } from 'lucide-react'
import { cn } from '@/lib/utils'
import MainTab from '@/components/MainTab/MainTab'
import MeTab from '@/components/MeTab/MeTab'
import GoalsTab from '@/components/GoalsTab/GoalsTab'

/**
 * Navigation configuration
 */
const navigation = [
	{ id: 'main', icon: Home, label: 'Home' },
	{ id: 'me', icon: User, label: 'Profile' },
	{ id: 'goals', icon: Target, label: 'Goals' },
] as const

type TabId = (typeof navigation)[number]['id']

/**
 * Main application component with sidebar navigation
 */
export default function App() {
	const [activeTab, setActiveTab] = useState<TabId>('main')

	return (
		<div className="flex h-screen bg-background">
			{/* Sidebar Navigation */}
			<div className="flex w-16 flex-col items-center space-y-4 border-r bg-card py-4">
				{navigation.map(({ id, icon: Icon, label }) => (
					<button
						key={id}
						onClick={() => setActiveTab(id)}
						className={cn(
							'rounded-lg p-3 transition-colors',
							'hover:bg-accent hover:text-accent-foreground',
							activeTab === id
								? 'bg-primary text-primary-foreground'
								: 'text-muted-foreground'
						)}
						title={label}
					>
						<Icon size={20} />
						<span className="sr-only">{label}</span>
					</button>
				))}
			</div>

			{/* Main Content Area */}
			<div className="flex-1 overflow-auto">
				<div className="container mx-auto p-6">
					{activeTab === 'main' && <MainTab />}
					{activeTab === 'me' && <MeTab />}
					{activeTab === 'goals' && <GoalsTab />}
				</div>
			</div>
		</div>
	)
}

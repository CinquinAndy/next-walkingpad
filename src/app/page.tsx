/**
 * @file src/app/page.tsx
 * Main exercise tracking and control page
 */
'use client'

import { useEffect } from 'react'
import { StatsDisplay } from '@/components/stats/stats-display'
import { SpeedControl } from '@/components/controls/speed-control'
import { ActivityChart } from '@/components/charts/activity-chart'
import { TargetModal } from '@/components/modals/target-modal'
import { useWalkingPadStore } from '@/store/walking-pad.store'
import { Button } from '@/components/ui/button'
import { Settings, Target } from 'lucide-react'
import Link from 'next/link'

/**
 * Main exercise page component
 * Displays current exercise stats, controls, and activity tracking
 */
export default function ExercisePage() {
	const { currentTarget, isLoading, error, resetState } = useWalkingPadStore()

	// Reset state when component unmounts
	useEffect(() => {
		return () => {
			resetState()
		}
	}, [resetState])

	// Show loading state
	if (isLoading) {
		return <div>Loading...</div>
	}

	// Show error state if any
	if (error) {
		return <div>Error: {error}</div>
	}

	return (
		<main className="mx-auto max-w-4xl space-y-6 p-6">
			{/* Header */}
			<div>
				<h1 className="text-2xl font-bold">Today's Exercise</h1>
				<p className="text-muted-foreground">
					{currentTarget
						? `Target: ${currentTarget.value} ${currentTarget.unit}`
						: 'No target set'}
				</p>
			</div>

			{/* Current Stats */}
			<StatsDisplay />

			{/* Controls Section */}
			<div className="grid grid-cols-3 gap-4">
				<Button asChild variant="outline" size="lg">
					<Link href="/settings">
						<Settings className="mr-2 h-5 w-5" />
						Settings
					</Link>
				</Button>

				<SpeedControl />

				<Button variant="outline" size="lg">
					<Target className="mr-2 h-5 w-5" />
					Set Target
				</Button>
			</div>

			{/* Activity Tracking */}
			<ActivityChart />

			{/* Modals */}
			<TargetModal />
		</main>
	)
}
